import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicantProfile extends Document {
    userId: mongoose.Types.ObjectId;
    education?: string;
    experience?: string;
    skills: string[];
    location?: string;
    resumeUrl?: string;
    createdAt: Date;
}

const ApplicantProfileSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    education: { type: String },
    experience: { type: String },
    skills: [{ type: String }],
    location: { type: String },
    resumeUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IApplicantProfile>('ApplicantProfile', ApplicantProfileSchema);
