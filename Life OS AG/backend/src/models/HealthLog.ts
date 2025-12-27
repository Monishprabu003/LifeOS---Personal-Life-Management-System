import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthLog extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'sleep' | 'exercise' | 'mood' | 'nutrition' | 'meditation';
    value: number; // e.g., hours of sleep, mood score 1-10
    unit?: string;
    notes?: string;
    metadata?: Record<string, any>; // e.g., exercise type, sleep stages
    timestamp: Date;
}

const HealthLogSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['sleep', 'exercise', 'mood', 'nutrition', 'meditation'],
            required: true
        },
        value: { type: Number, required: true },
        unit: { type: String },
        notes: { type: String },
        metadata: { type: Map, of: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IHealthLog>('HealthLog', HealthLogSchema);
