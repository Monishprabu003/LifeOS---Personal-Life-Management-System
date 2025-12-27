import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    category: 'personal' | 'professional' | 'health' | 'wealth' | 'learning';
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
    priority: 'low' | 'medium' | 'high';
    deadline?: Date;
    progress: number; // 0-100
    tasks: mongoose.Types.ObjectId[];
    alignmentScore: number; // How well this aligns with life purpose (0-100)
}

const GoalSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            enum: ['personal', 'professional', 'health', 'wealth', 'learning'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'on_hold'],
            default: 'pending'
        },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        deadline: { type: Date },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        alignmentScore: { type: Number, default: 0, min: 0, max: 100 },
    },
    { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
