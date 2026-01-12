import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Habit from './models/Habit.js';
import LifeEvent from './models/LifeEvent.js';
import HealthLog from './models/HealthLog.js';
import Finance from './models/Finance.js';
import Goal from './models/Goal.js';
import Relationship from './models/Relationship.js';
import Task from './models/Task.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeos');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Habit.deleteMany({});
        await LifeEvent.deleteMany({});
        await HealthLog.deleteMany({});
        await Finance.deleteMany({});
        await Goal.deleteMany({});
        await Relationship.deleteMany({});
        await Task.deleteMany({});

        // 1. Create a demo user with exact scores from mockup
        const user = await User.create({
            name: 'John Doe',
            email: 'demo@lifeos.com',
            password: 'password123',
            lifeScore: 78,
            healthScore: 85,
            wealthScore: 72,
            habitScore: 91,
            goalScore: 76,
            relationshipScore: 88,
        });

        const userId = user._id;

        // 2. Create today's health log to match quick stats
        await HealthLog.create({
            userId,
            sleepHours: 7.5,
            sleepQuality: 8.5,
            waterIntake: 2.1,
            mood: 8,
            stress: 3,
            timestamp: new Date()
        });

        // 3. Create some past logs for a realistic trend line
        const pastDays = [1, 2, 3, 4, 5, 6];
        for (const day of pastDays) {
            await HealthLog.create({
                userId,
                sleepHours: 7 + Math.random(),
                sleepQuality: 7 + Math.random() * 2,
                waterIntake: 2 + Math.random(),
                mood: 7 + Math.random() * 2,
                stress: 2 + Math.random() * 2,
                timestamp: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
            });
        }

        // 4. Create dummy entries for other modules
        await Finance.create({ userId, type: 'income', amount: 5000, category: 'Salary', description: 'Monthly' });
        await Habit.create({ userId, name: 'Morning Routine', streak: 12, lastCompleted: new Date() });
        await Habit.create({ userId, name: 'Deep Work', streak: 8, lastCompleted: new Date() });
        await Goal.create({ userId, title: 'Learn React', progress: 76, category: 'Intellectual' });
        await Relationship.create({ userId, name: 'Family', healthScore: 90 });

        console.log('Clean demo user created with mockup-aligned data:', user.email);
        console.log('Comprehensive seeding complete (Premium Initial State)!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
