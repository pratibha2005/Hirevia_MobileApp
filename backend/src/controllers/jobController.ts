import { Request, Response } from 'express';
import Job from '../models/Job';

// POST /api/jobs — HR creates a job
export const createJob = async (req: Request, res: Response) => {
    try {
        const {
            title, description, location, salary, type, skills,
            screeningQuestions, maxApplications,
            noticePeriodRequired, expectedCTCRequired, currentCTCRequired, relocationRequired
        } = req.body;

        if (!title || !description || !location)
            return res.status(400).json({ success: false, message: 'Title, description and location are required' });

        const job = await Job.create({
            companyId: req.user!.companyId,
            postedById: req.user!.userId,
            title,
            description,
            location,
            salary: salary || '',
            type: type || 'Full-time',
            skills: skills || [],
            screeningQuestions: screeningQuestions || [],
            maxApplications: maxApplications || undefined,
            noticePeriodRequired: noticePeriodRequired || false,
            expectedCTCRequired: expectedCTCRequired || false,
            currentCTCRequired: currentCTCRequired || false,
            relocationRequired: relocationRequired || false,
            status: 'Active',
        });

        return res.status(201).json({ success: true, job });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/jobs — public list of active jobs
export const listJobs = async (_req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ status: 'Active' })
            .populate('companyId', 'name logoUrl')
            .sort({ createdAt: -1 });
        return res.json({ success: true, jobs });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/jobs/my — HR sees their own company's jobs
export const getHRJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ companyId: req.user!.companyId })
            .sort({ createdAt: -1 });
        return res.json({ success: true, jobs });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/jobs/:id — public single job
export const getJobById = async (req: Request, res: Response) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('companyId', 'name logoUrl');
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        return res.json({ success: true, job });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/jobs/:id/status — HR closes or reopens a job
export const updateJobStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, companyId: req.user!.companyId },
            { status },
            { new: true }
        );
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        return res.json({ success: true, job });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
