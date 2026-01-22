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
        console.log('Cleaning existing data...');
        const deleteUsers = await User.deleteMany({});
        console.log(`Deleted ${deleteUsers.deletedCount} users.`);

        await Promise.all([
            Habit.deleteMany({}),
            LifeEvent.deleteMany({}),
            HealthLog.deleteMany({}),
            Finance.deleteMany({}),
            Goal.deleteMany({}),
            Relationship.deleteMany({}),
            Task.deleteMany({})
        ]);
        console.log('Other collections cleared.');

        // 1. Create a demo user
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

        // 4. Create entries for other modules and corresponding LifeEvents
        await Finance.create({ userId, type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary' });
        await LifeEvent.create({
            userId,
            type: 'financial',
            title: 'Income Logged',
            description: 'Monthly Salary: +$5,000',
            impact: 'positive',
            value: 100,
            timestamp: new Date()
        });

        const today = new Date();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const habitData = [
            { name: 'Morning Meditation', emoji: '🧘', streak: 12, targetDays: 30, color: '#10b981', completed: true },
            { name: 'Read 30 minutes', emoji: '📚', streak: 8, targetDays: 21, color: '#8b5cf6', completed: true },
            { name: 'Drink 2L water', emoji: '💧', streak: 15, targetDays: 30, color: '#10b981', completed: false },
            { name: 'Daily journaling', emoji: '📝', streak: 5, targetDays: 14, color: '#f43f5e', completed: false },
            { name: 'No social media before noon', emoji: '📵', streak: 3, targetDays: 7, color: '#f59e0b', completed: true },
            { name: 'Track expenses', emoji: '💰', streak: 10, targetDays: 30, color: '#3b82f6', completed: false },
        ];

        for (const meta of habitData) {
            const h = await Habit.create({
                userId,
                name: meta.name,
                emoji: meta.emoji,
                streak: meta.streak,
                targetDays: meta.targetDays,
                color: meta.color,
                lastCompleted: meta.completed ? today : yesterday,
                history: meta.completed ? [{ date: today, completed: true }] : []
            });

            if (meta.completed) {
                await LifeEvent.create({
                    userId,
                    type: 'habit',
                    title: 'Habit Completed',
                    description: `${meta.name} streak: ${meta.streak} days`,
                    impact: 'positive',
                    value: 91,
                    timestamp: today
                });
            }
        }

        await Goal.create({ userId, title: 'Learn React', progress: 76, category: 'Intellectual' });
        await LifeEvent.create({
            userId,
            type: 'productivity',
            title: 'Goal Progress',
            description: 'Learn React: 76% completed',
            impact: 'positive',
            value: 76,
            timestamp: new Date()
        });

        await Relationship.create({ userId, name: 'Family', healthScore: 90 });
        await LifeEvent.create({
            userId,
            type: 'social',
            title: 'Relationship Peak',
            description: 'Strong connection with Family',
            impact: 'positive',
            value: 90,
            timestamp: new Date()
        });

        // Create Health LifeEvents for the past logs
        const logs = await HealthLog.find({ userId });
        for (const log of logs) {
            await LifeEvent.create({
                userId,
                type: 'health',
                title: 'Health Sync',
                description: `Mood: ${log.mood}/10 • Sleep: ${log.sleepHours}h • Water: ${log.waterIntake}L`,
                impact: 'positive',
                value: 85,
                timestamp: log.timestamp
            });
        }

        console.log('Clean demo user created with mockup-aligned data:', user.email);
        console.log('Comprehensive seeding complete (Premium Initial State with Event History)!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
