import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    passwordHash: string;
    role: 'HR' | 'APPLICANT';
    companyId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profileImage: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['HR', 'APPLICANT'], required: true },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: function (this: IUser) { return this.role === 'HR'; }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
