import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    bio?: string;
    avatar?: string;
    lifeScore: number;
    healthScore: number;
    wealthScore: number;
    habitScore: number;
    goalScore: number;
    relationshipScore: number;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
    };
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        bio: { type: String },
        avatar: { type: String },
        lifeScore: { type: Number, default: 0 },
        healthScore: { type: Number, default: 0 },
        wealthScore: { type: Number, default: 0 },
        habitScore: { type: Number, default: 0 },
        goalScore: { type: Number, default: 0 },
        relationshipScore: { type: Number, default: 0 },
        preferences: {
            theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
            notifications: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: any) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
