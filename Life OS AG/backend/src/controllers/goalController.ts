import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';
import { Kernel } from '../services/Kernel';
import { EventType } from '../models/LifeEvent';

export const createGoal = async (req: AuthRequest, res: Response) => {
    try {
        const goal = await Goal.create({
            userId: req.user._id,
            ...req.body,
        });
        res.status(201).json(goal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).populate('tasks');
        res.json(goals);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGoalProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { progress } = req.body;
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goal.progress = progress;
        if (progress === 100) {
            goal.status = 'completed';
            await Kernel.processEvent(req.user._id, {
                type: EventType.PRODUCTIVITY,
                title: `Achieved Goal: ${goal.title}`,
                impact: 'positive',
                value: 10,
                metadata: { goalId: goal._id }
            });
        }

        await goal.save();
        res.json(goal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
