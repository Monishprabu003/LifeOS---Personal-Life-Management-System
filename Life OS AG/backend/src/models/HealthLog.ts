import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthLog extends Document {
    userId: mongoose.Types.ObjectId;
    sleepHours: number;
    sleepQuality: number;
    waterIntake: number;
    mood: number;
    stress: number;
    notes?: string;
    timestamp: Date;
}

const HealthLogSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sleepHours: { type: Number, required: true },
        sleepQuality: { type: Number, required: true },
        waterIntake: { type: Number, required: true },
        mood: { type: Number, required: true },
        stress: { type: Number, required: true },
        notes: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IHealthLog>('HealthLog', HealthLogSchema);
