import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    emailDomain: string;
    logoUrl?: string;
    createdAt: Date;
}

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true },
    emailDomain: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICompany>('Company', CompanySchema);
