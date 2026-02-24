import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    companyId: mongoose.Types.ObjectId;
    postedById: mongoose.Types.ObjectId;
    title: string;
    description: string;
    location: string;
    salary?: string;
    type?: string;
    status: 'Active' | 'Closed' | 'Draft';
    skills: string[];
    noticePeriodRequired?: boolean;
    expectedCTCRequired?: boolean;
    currentCTCRequired?: boolean;
    relocationRequired?: boolean;
    screeningQuestions: string[];
    maxApplications?: number;
    applicationCount: number;
    createdAt: Date;
}

const JobSchema: Schema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    postedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: '' },
    type: { type: String, default: 'Full-time' },
    status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
    skills: [{ type: String }],
    noticePeriodRequired: { type: Boolean, default: false },
    expectedCTCRequired: { type: Boolean, default: false },
    currentCTCRequired: { type: Boolean, default: false },
    relocationRequired: { type: Boolean, default: false },
    screeningQuestions: [{ type: String }],
    maxApplications: { type: Number },
    applicationCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJob>('Job', JobSchema);
