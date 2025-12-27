import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Habit from './models/Habit';
import LifeEvent, { EventType } from './models/LifeEvent';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeos');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Habit.deleteMany({});
        await LifeEvent.deleteMany({});

        // Create a demo user
        const user = await User.create({
            name: 'Human 001',
            email: 'demo@lifeos.com',
            password: 'password123',
            lifeScore: 75,
            healthScore: 80,
            wealthScore: 60,
            habitScore: 90,
            goalScore: 70,
            relationshipScore: 85,
        });

        console.log('Demo user created:', user.email);

        // Create some habits
        await Habit.create([
            { userId: user._id, name: 'Deep Work', category: 'productivity', streak: 12, bestStreak: 15 },
            { userId: user._id, name: 'Morning Meditation', category: 'health', streak: 5, bestStreak: 5 },
            { userId: user._id, name: 'Reading', category: 'mindset', streak: 3, bestStreak: 10 },
        ]);

        // Create some events
        await LifeEvent.create([
            {
                userId: user._id,
                type: EventType.HEALTH,
                title: '7.5 Hours Sleep',
                impact: 'positive',
                value: 7.5,
                timestamp: new Date()
            },
            {
                userId: user._id,
                type: EventType.PRODUCTIVITY,
                title: 'Completed UI Foundation',
                impact: 'positive',
                value: 1,
                timestamp: new Date()
            }
        ]);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
