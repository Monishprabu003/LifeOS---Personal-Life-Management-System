import mongoose from 'mongoose';


const GoalSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            default: 'Personal'
        },
        status: {
            type: String,
            default: 'active'
        },
        priority: { type: String, default: 'medium' },
        deadline: { type: Date },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
        alignmentScore: { type: Number, default: 0, min: 0, max: 100 },
    },
    { timestamps: true }
);

export default mongoose.model('Goal', GoalSchema);
