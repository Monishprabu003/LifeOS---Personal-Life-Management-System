import mongoose from 'mongoose';


const TaskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
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

export default mongoose.model('Task', TaskSchema);
