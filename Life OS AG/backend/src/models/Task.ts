import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    goalId?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    timeBlocking?: {
        startTime: Date;
        endTime: Date;
    };
}

const TaskSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        goalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        dueDate: { type: Date },
        timeBlocking: {
            startTime: { type: Date },
            endTime: { type: Date },
        },
    },
    { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
