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

        // 1. Create a demo user
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

        // 2. Create Health Logs (last 7 days)
        const healthLogs = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            healthLogs.push({
                userId: user._id,
                sleepHours: 7 + Math.random(),
                sleepQuality: 7 + Math.floor(Math.random() * 3),
                waterIntake: 2 + Math.random(),
                mood: 7 + Math.floor(Math.random() * 3),
                stress: 2 + Math.floor(Math.random() * 3),
                timestamp: date
            });
        }
        await HealthLog.insertMany(healthLogs);

        // 3. Create Finance (transactions)
        await Finance.create([
            { userId: user._id, type: 'income', category: 'Salary', amount: 5000, description: 'Monthly Salary', date: new Date() },
            { userId: user._id, type: 'expense', category: 'Rent', amount: 1500, description: 'Apartment Rent', date: new Date() },
            { userId: user._id, type: 'expense', category: 'Food', amount: 600, description: 'Groceries', date: new Date() },
            { userId: user._id, type: 'expense', category: 'Entertainment', amount: 200, description: 'Movies/Games', date: new Date() },
        ]);

        // 4. Create Habits
        await Habit.create([
            { userId: user._id, name: 'Deep Work', category: 'productivity', streak: 12, bestStreak: 15, lastCompleted: new Date() },
            { userId: user._id, name: 'Morning Meditation', category: 'health', streak: 5, bestStreak: 5, lastCompleted: new Date() },
            { userId: user._id, name: 'Reading', category: 'mindset', streak: 3, bestStreak: 10, lastCompleted: new Date() },
        ]);

        // 5. Create Goals & Tasks
        const goal = await Goal.create({
            userId: user._id,
            title: 'Master JavaScript',
            description: 'Become proficient in modern JS and Node.js',
            category: 'Personal',
            status: 'active',
            priority: 'high',
            progress: 45,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        await Task.create([
            { userId: user._id, goalId: goal._id, title: 'Learn Async/Await', status: 'done', priority: 'high' },
            { userId: user._id, goalId: goal._id, title: 'Understand Event Loop', status: 'in_progress', priority: 'medium' },
            { userId: user._id, goalId: goal._id, title: 'Build a CLI tool', status: 'todo', priority: 'low' },
        ]);

        // 6. Create Relationships
        await Relationship.create([
            {
                userId: user._id,
                name: 'Sarah Connor',
                type: 'Family',
                frequencyGoal: 7,
                healthScore: 90,
                interactionHistory: [{ date: new Date(), type: 'Call', description: 'Weekly check-in' }]
            },
            {
                userId: user._id,
                name: 'John Smith',
                type: 'Friend',
                frequencyGoal: 14,
                healthScore: 75,
                interactionHistory: [{ date: new Date(), type: 'Meetup', description: 'Coffee' }]
            }
        ]);

        // 7. Create some events
        await LifeEvent.create([
            {
                userId: user._id,
                type: 'health',
                title: '7.5 Hours Sleep',
                impact: 'positive',
                value: 7.5,
                timestamp: new Date()
            },
            {
                userId: user._id,
                type: 'productivity',
                title: 'Completed UI Foundation',
                impact: 'positive',
                value: 1,
                timestamp: new Date()
            }
        ]);

        console.log('Comprehensive seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
