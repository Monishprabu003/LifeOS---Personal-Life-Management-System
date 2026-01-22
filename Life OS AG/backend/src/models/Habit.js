import mongoose from 'mongoose';


const HabitSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        category: {
            type: String,
            default: 'General'
        },
        frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
        targetDays: { type: Number, default: 30 },
        emoji: { type: String, default: '✨' },
        color: { type: String, default: '#10b981' },
        streak: { type: Number, default: 0 },
        bestStreak: { type: Number, default: 0 },
        lastCompleted: { type: Date },
        history: [
            {
                date: { type: Date, required: true },
                completed: { type: Boolean, default: true },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Habit', HabitSchema);
