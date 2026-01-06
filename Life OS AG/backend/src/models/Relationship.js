import mongoose from 'mongoose';


const RelationshipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            default: 'other'
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

export default mongoose.model('Relationship', RelationshipSchema);
