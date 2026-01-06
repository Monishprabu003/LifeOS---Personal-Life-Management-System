import mongoose from 'mongoose';


const HealthLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sleepHours: { type: Number, required: true },
        sleepQuality: { type: Number, required: true },
        waterIntake: { type: Number, required: true },
        mood: { type: Number, required: true },
        stress: { type: Number, required: true },
        notes: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model('HealthLog', HealthLogSchema);
