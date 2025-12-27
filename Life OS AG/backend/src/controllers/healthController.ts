import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import HealthLog from '../models/HealthLog';
import { Kernel } from '../services/Kernel';
import { EventType } from '../models/LifeEvent';

export const createHealthLog = async (req: AuthRequest, res: Response) => {
    try {
        const log: any = await HealthLog.create({
            userId: req.user._id,
            ...req.body,
        });

        // Map health log to life event
        await Kernel.processEvent(req.user._id, {
            type: EventType.HEALTH,
            title: `Logged ${log.type}: ${log.value} ${log.unit || ''}`,
            impact: 'positive', // Default positive for taking action
            value: log.value,
            metadata: { logId: log._id }
        });

        res.status(201).json(log);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getHealthLogs = async (req: AuthRequest, res: Response) => {
    try {
        const logs = await HealthLog.find({ userId: req.user._id }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
