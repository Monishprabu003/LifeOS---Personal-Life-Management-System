import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    category: 'health' | 'wealth' | 'productivity' | 'social' | 'mindset';
    frequency: 'daily' | 'weekly' | 'custom';
    targetDays: number; // e.g., 5 days a week
    streak: number;
    bestStreak: number;
    lastCompleted: Date;
    history: {
        date: Date;
        completed: boolean;
    }[];
    isActive: boolean;
}

const HabitSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        category: {
            type: String,
            enum: ['health', 'wealth', 'productivity', 'social', 'mindset'],
            required: true
        },
        frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
        targetDays: { type: Number, default: 7 },
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

export default mongoose.model<IHabit>('Habit', HabitSchema);
