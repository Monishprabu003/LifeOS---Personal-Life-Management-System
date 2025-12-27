import mongoose, { Schema, Document } from 'mongoose';

export enum EventType {
    HEALTH = 'health_event',
    FINANCIAL = 'financial_event',
    HABIT = 'habit_event',
    EMOTIONAL = 'emotional_event',
    PRODUCTIVITY = 'productivity_event',
    SOCIAL = 'social_event',
    SYSTEM = 'system_event',
}

export interface ILifeEvent extends Document {
    userId: mongoose.Types.ObjectId;
    type: EventType;
    title: string;
    description?: string;
    value?: number; // Numeric impact (e.g., $ spent, hours slept, etc.)
    impact: 'positive' | 'negative' | 'neutral';
    tags: string[];
    metadata: Record<string, any>;
    timestamp: Date;
}

const LifeEventSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: Object.values(EventType), required: true },
        title: { type: String, required: true },
        description: { type: String },
        value: { type: Number },
        impact: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
        tags: [{ type: String }],
        metadata: { type: Map, of: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<ILifeEvent>('LifeEvent', LifeEventSchema);
