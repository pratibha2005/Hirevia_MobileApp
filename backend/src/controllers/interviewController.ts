import { Request, Response } from 'express';
import Interview from '../models/Interview';
import InterviewAvailability from '../models/InterviewAvailability';
import User from '../models/User';
import { sendInterviewScheduledEmail } from '../services/emailService';

const isValidIsoDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// GET /api/interviews
export const listInterviews = async (req: Request, res: Response) => {
    try {
        const { weekStart, weekEnd } = req.query as { weekStart?: string; weekEnd?: string };
        const filters: Record<string, any> = { companyId: req.user!.companyId };

        if (weekStart && weekEnd && isValidIsoDate(weekStart) && isValidIsoDate(weekEnd)) {
            filters.interviewDate = { $gte: weekStart, $lte: weekEnd };
        }

        const interviews = await Interview.find(filters)
            .sort({ interviewDate: 1, startTime: 1 });

        return res.json({ success: true, interviews });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/interviews
export const createInterview = async (req: Request, res: Response) => {
    try {
        const {
            title,
            candidateName,
            candidateEmail,
            jobTitle,
            interviewDate,
            startTime,
            endTime,
            mode,
            notes
        } = req.body;

        if (!title || !candidateName || !candidateEmail || !interviewDate || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        if (!isValidIsoDate(interviewDate) || !isValidTime(startTime) || !isValidTime(endTime)) {
            return res.status(400).json({ success: false, message: 'Invalid date or time format' });
        }

        if (!isValidEmail(candidateEmail)) {
            return res.status(400).json({ success: false, message: 'Invalid candidate email format' });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ success: false, message: 'End time must be after start time' });
        }

        const overlap = await Interview.findOne({
            companyId: req.user!.companyId,
            interviewDate,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (overlap) {
            return res.status(409).json({ success: false, message: 'Interview slot overlaps with an existing interview' });
        }

        const recruiter = await User.findById(req.user!.userId).select('name email role');
        if (!recruiter || recruiter.role !== 'HR') {
            return res.status(403).json({ success: false, message: 'Recruiter account not found' });
        }

        if (!isValidEmail(recruiter.email)) {
            return res.status(400).json({ success: false, message: 'Recruiter email is invalid. Update your profile email and try again.' });
        }

        const interview = await Interview.create({
            companyId: req.user!.companyId,
            createdById: req.user!.userId,
            title,
            candidateName,
            candidateEmail,
            jobTitle: jobTitle || '',
            interviewDate,
            startTime,
            endTime,
            mode: mode || 'Google Meet',
            notes: notes || ''
        });

        try {
            await sendInterviewScheduledEmail({
                recruiterName: recruiter.name,
                recruiterEmail: recruiter.email,
                candidateName,
                candidateEmail: candidateEmail.toLowerCase(),
                title,
                jobTitle: jobTitle || '',
                interviewDate,
                startTime,
                endTime,
                mode: mode || 'Google Meet',
                notes: notes || ''
            });
        } catch (mailError: any) {
            await Interview.findByIdAndDelete(interview._id);
            return res.status(502).json({
                success: false,
                message: `Interview email could not be sent to candidate: ${mailError.message}`
            });
        }

        return res.status(201).json({
            success: true,
            message: `Interview scheduled and email sent to ${candidateEmail.toLowerCase()}`,
            interview
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/interviews/availability
export const getAvailability = async (req: Request, res: Response) => {
    try {
        const existing = await InterviewAvailability.findOne({ companyId: req.user!.companyId });

        if (!existing) {
            return res.json({ success: true, availability: { days: [] } });
        }

        return res.json({ success: true, availability: { days: existing.days } });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/interviews/availability
export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { days } = req.body as {
            days: { dayOfWeek: number; slots: { startTime: string; endTime: string }[] }[];
        };

        if (!Array.isArray(days)) {
            return res.status(400).json({ success: false, message: 'days must be an array' });
        }

        for (const day of days) {
            if (typeof day.dayOfWeek !== 'number' || day.dayOfWeek < 0 || day.dayOfWeek > 6 || !Array.isArray(day.slots)) {
                return res.status(400).json({ success: false, message: 'Invalid day availability format' });
            }

            for (const slot of day.slots) {
                if (!isValidTime(slot.startTime) || !isValidTime(slot.endTime) || slot.startTime >= slot.endTime) {
                    return res.status(400).json({ success: false, message: 'Invalid availability time range' });
                }
            }
        }

        const availability = await InterviewAvailability.findOneAndUpdate(
            { companyId: req.user!.companyId },
            { days, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return res.json({ success: true, availability: { days: availability.days } });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
