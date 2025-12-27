import mongoose, { Schema, Document } from 'mongoose';

export interface IFinance extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    currency: string;
    description?: string;
    date: Date;
    isRecurring: boolean;
    recurrencePeriod?: 'monthly' | 'yearly';
}

const FinanceSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export default mongoose.model<IFinance>('Finance', FinanceSchema);
