import mongoose from 'mongoose';


const FinanceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
        description: { type: String },
        date: { type: Date, default: Date.now },
        isRecurring: { type: Boolean, default: false },
        recurrencePeriod: { type: String, enum: ['monthly', 'yearly'] },
    },
    { timestamps: true }
);

export default mongoose.model('Finance', FinanceSchema);
