import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';

// POST /api/applications — APPLICANT applies to a job
export const applyToJob = async (req: Request, res: Response) => {
    try {
        const { jobId, screeningAnswers } = req.body;

        if (!jobId)
            return res.status(400).json({ success: false, message: 'jobId is required' });

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.status !== 'Active')
            return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });

        const application = await Application.create({
            jobId,
            applicantId: req.user!.userId,
            resumeUrl: req.body.resumeUrl || '',
            screeningAnswers: screeningAnswers || [],
            status: 'New',
        });

        await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

        return res.status(201).json({ success: true, application });
    } catch (err: any) {
        if (err.code === 11000)
            return res.status(409).json({ success: false, message: 'You have already applied to this job' });
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

        const application = await Application.findById(req.params.id).populate<{ jobId: any }>('jobId');
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        if (String(application.jobId.companyId) !== String(req.user!.companyId))
            return res.status(403).json({ success: false, message: 'Forbidden' });

        application.status = status;
        await application.save();

        return res.json({ success: true, application });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
