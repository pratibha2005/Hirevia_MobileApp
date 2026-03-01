import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailabilitySlot {
    startTime: string;
    endTime: string;
}

export interface IInterviewAvailability extends Document {
    companyId: mongoose.Types.ObjectId;
    days: {
        dayOfWeek: number;
        slots: IAvailabilitySlot[];
    }[];
    updatedAt: Date;
}

const AvailabilitySlotSchema: Schema = new Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, { _id: false });

const DayAvailabilitySchema: Schema = new Schema({
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: { type: [AvailabilitySlotSchema], default: [] }
}, { _id: false });

const InterviewAvailabilitySchema: Schema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
    days: { type: [DayAvailabilitySchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInterviewAvailability>('InterviewAvailability', InterviewAvailabilitySchema);
