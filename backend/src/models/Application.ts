import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus = 'New' | 'Under Review' | 'Shortlisted' | 'Rejected';

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    applicantId: mongoose.Types.ObjectId;
    resumeUrl?: string;
    screeningAnswers: {
        question: string;
        answer: string;
    }[];
    status: ApplicationStatus;
    appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, default: '' },
    screeningAnswers: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    status: { type: String, enum: ['New', 'Under Review', 'Shortlisted', 'Rejected'], default: 'New' },
    appliedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
