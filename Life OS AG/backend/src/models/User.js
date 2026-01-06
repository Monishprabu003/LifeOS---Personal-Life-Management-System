import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema(
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
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
