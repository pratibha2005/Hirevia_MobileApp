import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    applicantId: mongoose.Types.ObjectId;
    resumeUrl: string;
    screeningAnswers: {
        question: string;
        answer: string;
    }[];
    appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    screeningAnswers: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    appliedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
