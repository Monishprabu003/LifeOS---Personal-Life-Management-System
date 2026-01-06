import mongoose from 'mongoose';

export const EventType = {
    HEALTH: 'health_event',
    FINANCIAL: 'financial_event',
    HABIT: 'habit_event',
    EMOTIONAL: 'emotional_event',
    PRODUCTIVITY: 'productivity_event',
    SOCIAL: 'social_event',
    SYSTEM: 'system_event',
};

const LifeEventSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: Object.values(EventType), required: true },
        title: { type: String, required: true },
        description: { type: String },
        value: { type: Number },
        impact: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
        tags: [{ type: String }],
        metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model('LifeEvent', LifeEventSchema);
