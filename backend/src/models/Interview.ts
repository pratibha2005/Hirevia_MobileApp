import mongoose, { Schema, Document } from 'mongoose';

export type InterviewMode = 'In-person' | 'Google Meet' | 'Zoom' | 'Phone';

export interface IInterview extends Document {
    companyId: mongoose.Types.ObjectId;
    createdById: mongoose.Types.ObjectId;
    title: string;
    candidateName: string;
    candidateEmail: string;
    jobTitle?: string;
    interviewDate: string;
    startTime: string;
    endTime: string;
    mode: InterviewMode;
    notes?: string;
    createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    candidateName: { type: String, required: true, trim: true },
    candidateEmail: { type: String, required: true, trim: true, lowercase: true },
    jobTitle: { type: String, default: '', trim: true },
    interviewDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, enum: ['In-person', 'Google Meet', 'Zoom', 'Phone'], default: 'Google Meet' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

InterviewSchema.index({ companyId: 1, interviewDate: 1, startTime: 1 });

export default mongoose.model<IInterview>('Interview', InterviewSchema);
