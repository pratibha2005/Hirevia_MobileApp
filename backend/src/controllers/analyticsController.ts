import { Request, Response } from 'express';
import Job from '../models/Job';
import Application from '../models/Application';
import Interview from '../models/Interview';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const companyId = req.user!.companyId;
        const timeRange = req.query.range as string || 'week'; // 24h, week, month, year
        
        const jobs = await Job.find({ companyId });
        const jobIds = jobs.map(j => j._id);
        
        let applications = await Application.find({ jobId: { $in: jobIds } });
        let interviews = await Interview.find({ companyId });
        
        const totalJobs = jobs.length;
        const totalCandidates = applications.length;
        const candidatesHired = applications.filter(a => a.status === 'Shortlisted').length;
        const interviewsScheduled = interviews.length;

        // Generate data based on range
        let labels: string[] = [];
        let formatDate: (d: Date) => string;

        const now = new Date();
        if (timeRange === '24h') {
            labels = Array.from({length: 24}).map((_, i) => `${i}:00`);
            formatDate = (d) => `${d.getHours()}:00`;
        } else if (timeRange === 'week') {
            labels = Array.from({length: 7}).map((_, i) => {
                const d = new Date(); d.setDate(now.getDate() - (6 - i));
                return d.toLocaleDateString('en-US', { weekday: 'short' });
            });
            formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (timeRange === 'month') {
            labels = Array.from({length: 30}).map((_, i) => {
                const d = new Date(); d.setDate(now.getDate() - (29 - i));
                return `Day ${d.getDate()}`;
            });
            formatDate = (d) => `Day ${d.getDate()}`;
        } else {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short' });
        }

        const buildDataMap = () => {
            const m: Record<string, number> = {};
            labels.forEach(l => m[l] = 0);
            return m;
        };

        const jobsMap = buildDataMap();
        jobs.forEach(j => {
            const k = Object.keys(jobsMap).find(key => key === formatDate(new Date(j.createdAt)));
            if (k) jobsMap[k]++;
        });

        const hiredMap = buildDataMap();
        applications.filter(a => a.status === 'Shortlisted').forEach(a => {
            const dateValue = (a as any).updatedAt || a.appliedAt || new Date();
            const k = Object.keys(hiredMap).find(key => key === formatDate(new Date(dateValue)));
            if (k) hiredMap[k]++;
        });

        const interviewMap = buildDataMap();
        interviews.forEach(i => {
            const dateValue = i.interviewDate || i.createdAt || new Date();
            const k = Object.keys(interviewMap).find(key => key === formatDate(new Date(dateValue)));
            if (k) interviewMap[k]++;
        });

        const charts = {
            jobs: labels.map(name => ({ name, Jobs: jobsMap[name] })),
            hired: labels.map(name => ({ name, Hired: hiredMap[name] })),
            interviews: labels.map(name => ({ name, Interviews: interviewMap[name] })),
        };

        res.json({
            success: true,
            summary: {
                totalJobs,
                totalCandidates,
                interviewsScheduled,
                candidatesHired
            },
            charts
        });
    } catch (error) {
        console.error('getAnalytics error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};