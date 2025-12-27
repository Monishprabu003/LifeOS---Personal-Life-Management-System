import mongoose, { Schema, Document } from 'mongoose';

export interface IRelationship extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: 'family' | 'friend' | 'colleague' | 'partner' | 'other';
    lastInteraction: Date;
    frequencyGoal: number; // target days between interactions
    healthScore: number; // 0-100
    notes?: string;
    interactionHistory: {
        date: Date;
        type: string;
        description: string;
    }[];
}

const RelationshipSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ['family', 'friend', 'colleague', 'partner', 'other'],
            required: true
        },
        lastInteraction: { type: Date, default: Date.now },
        frequencyGoal: { type: Number, default: 7 }, // weekly by default
        healthScore: { type: Number, default: 100 },
        notes: { type: String },
        interactionHistory: [
            {
                date: { type: Date, default: Date.now },
                type: { type: String },
                description: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IRelationship>('Relationship', RelationshipSchema);
