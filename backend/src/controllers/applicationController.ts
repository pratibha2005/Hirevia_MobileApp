import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import ApplicantProfile from '../models/ApplicantProfile';
import { sendApplicationStatusEmail } from '../services/emailService';

// POST /api/applications — APPLICANT applies to a job
export const applyToJob = async (req: Request, res: Response) => {
    try {
        console.log('📝 Application submission received');
        console.log('👤 Applicant ID:', req.user!.userId);
        console.log('📦 Request body:', req.body);
        console.log('📄 File uploaded:', req.file ? req.file.filename : 'No file');

        const { jobId, useExistingResume, relocationAnswer, ctcAnswer } = req.body;
        let screeningAnswers = req.body.screeningAnswers;

        // Parse screeningAnswers if it's a string (from FormData)
        if (typeof screeningAnswers === 'string') {
            try {
                screeningAnswers = JSON.parse(screeningAnswers);
            } catch {
                screeningAnswers = [];
            }
        }

        if (!jobId) {
            console.log('❌ Missing jobId');
            return res.status(400).json({ success: false, message: 'jobId is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            console.log('❌ Job not found:', jobId);
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        if (job.status !== 'Active') {
            console.log('❌ Job not active:', jobId);
            return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
        }

        // Determine which resume to use
        let resumeUrl = '';

        if (useExistingResume === 'true' || useExistingResume === true) {
            // Use resume from applicant profile
            console.log('📎 Using existing resume from profile');
            const profile = await ApplicantProfile.findOne({ userId: req.user!.userId });
            resumeUrl = profile?.resumeUrl || '';
            console.log('📎 Profile resume URL:', resumeUrl);
        } else if (req.file) {
            // Use newly uploaded resume
            resumeUrl = `/uploads/resumes/${req.file.filename}`;
            console.log('📎 Using new uploaded resume:', resumeUrl);
        } else {
            console.log('⚠️ No resume provided');
        }

        const application = await Application.create({
            jobId,
            applicantId: req.user!.userId,
            resumeUrl,
            screeningAnswers: screeningAnswers || [],
            relocationAnswer: relocationAnswer || undefined,
            ctcAnswer: ctcAnswer || undefined,
            status: 'New',
        });

        await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

        console.log('✅ Application created:', application._id);
        return res.status(201).json({ success: true, application });
    } catch (err: any) {
        if (err.code === 11000) {
            console.log('❌ Duplicate application for job:', req.body.jobId);
            return res.status(409).json({ success: false, message: 'You have already applied to this job' });
        }
        console.error('❌ Application error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/applications/my — APPLICANT sees their own applications
export const getMyApplications = async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({ applicantId: req.user!.userId })
            .populate({
                path: 'jobId',
                populate: { path: 'companyId', select: 'name logoUrl' }
            })
            .sort({ appliedAt: -1 });
        return res.json({ success: true, applications });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/applications/company — HR sees ALL applications for their company
export const getCompanyApplications = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ companyId: req.user!.companyId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('applicantId', 'name email phone')
            .populate('jobId', 'title location')
            .sort({ appliedAt: -1 });

        return res.json({ success: true, applications });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/applications/job/:jobId — HR sees applications for a specific job
export const getJobApplications = async (req: Request, res: Response) => {
    try {
        const job = await Job.findOne({ _id: req.params.jobId, companyId: req.user!.companyId });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('applicantId', 'name email phone')
            .sort({ appliedAt: -1 });

        return res.json({ success: true, applications });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/applications/:id/status — HR updates application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const valid = ['New', 'Under Review', 'Shortlisted', 'Rejected'];
        if (!valid.includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status' });

        const application = await Application.findById(req.params.id)
            .populate<{ jobId: any }>({
                path: 'jobId',
                populate: { path: 'companyId', select: 'name emailDomain logoUrl' }
            })
            .populate<{ applicantId: any }>('applicantId', 'name email');

        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        const companyId = application.jobId.companyId._id ? application.jobId.companyId._id : application.jobId.companyId;

        if (String(companyId) !== String(req.user!.companyId))
            return res.status(403).json({ success: false, message: 'Forbidden' });

        application.status = status;
        await application.save();

        if (status === 'Shortlisted' || status === 'Rejected') {
            sendApplicationStatusEmail({
                candidateName: application.applicantId.name,
                candidateEmail: application.applicantId.email,
                companyName: application.jobId.companyId.name,
                jobTitle: application.jobId.title,
                status: status as 'Shortlisted' | 'Rejected'
            }).catch(e => console.error('Failed to send status email:', e));
        }

        return res.json({ success: true, application });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
