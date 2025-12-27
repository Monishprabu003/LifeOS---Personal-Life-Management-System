import { Response } from 'express';
import { Kernel } from '../services/Kernel';
import { AuthRequest } from '../middleware/authMiddleware';
import LifeEvent from '../models/LifeEvent';

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const eventData = req.body;
        const userId = req.user._id;

        const event = await Kernel.processEvent(userId, eventData);
        res.status(201).json(event);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
    try {
        const events = await LifeEvent.find({ userId: req.user._id }).sort({ timestamp: -1 });
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLifeStatus = async (req: AuthRequest, res: Response) => {
    try {
        await Kernel.updateLifeScores(req.user._id);
        res.json({
            lifeScore: req.user.lifeScore,
            healthScore: req.user.healthScore,
            wealthScore: req.user.wealthScore,
            habitScore: req.user.habitScore,
            goalScore: req.user.goalScore,
            relationshipScore: req.user.relationshipScore,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
