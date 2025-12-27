import OpenAI from 'openai';
import { IUser } from '../models/User';
import Habit from '../models/Habit';
import LifeEvent from '../models/LifeEvent';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export class AIService {
    /**
     * Generates a personalized insight based on user data
     */
    static async getDailyInsight(user: IUser): Promise<string> {
        const context = await this.getUserContext(user);

        if (!openai) {
            return this.getSimulatedInsight(user);
        }

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are LifeOS AI, a sophisticated personal optimization coach. Your goal is to provide 1-2 sentences of highly actionable, slightly philosophical, and motivating advice based on the user's current data. Speak as if you are a system monitor reporting on human performance."
                    },
                    {
                        role: "user",
                        content: `User Context: ${JSON.stringify(context)}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            return response.choices[0]?.message.content || "System calibration required.";
        } catch (error) {
            console.error('AI Insight Error:', error);
            return this.getSimulatedInsight(user);
        }
    }

    /**
     * Main chat interface with the Copilot
     */
    static async chat(user: IUser, message: string): Promise<string> {
        const context = await this.getUserContext(user);

        if (!openai) {
            return "I am currently in Simulation Mode (API Key missing). I can tell you that based on your scores, you should prioritize sleep today.";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are the LifeOS Copilot. You have access to the user's life metrics (Health, Wealth, Habits). Help them optimize their life system. Be concise, direct, and encouraging."
                },
                {
                    role: "user",
                    content: `Current User Metrics: ${JSON.stringify(context)}. User Message: ${message}`
                }
            ]
        });

        return response.choices[0]?.message.content || "System error in response generation.";
    }

    private static async getUserContext(user: IUser) {
        const habits = await Habit.find({ userId: user._id, isActive: true });
        const recentEvents = await LifeEvent.find({ userId: user._id }).sort({ timestamp: -1 }).limit(10);

        return {
            scores: {
                life: user.lifeScore,
                health: user.healthScore,
                wealth: user.wealthScore,
                habits: user.habitScore
            },
            activeHabits: habits.map(h => ({ name: h.name, streak: h.streak })),
            recentActivity: recentEvents.map(e => e.title)
        };
    }

    private static getSimulatedInsight(user: IUser): string {
        const insights = [
            "Your consistency in deep work is establishing a powerful foundation. Maintain this trajectory.",
            "The health metrics show a slight decline. Reclaiming 30 minutes of sleep tonight will optimize tomorrow's output.",
            "Wealth accumulation is steady. Consider reviewing your investment goals to align with your long-term roadmap.",
            "Social connectivity is high. Your relationship health is acting as a multiplier for your emotional stability.",
            "Goal alignment is at 85%. You are 15% away from a major breakthrough in your professional module."
        ];
        // Simple logic to pick based on scores
        if (user.healthScore < 70) return insights[1]!;
        if (user.wealthScore < 60) return insights[2]!;
        if (user.lifeScore > 80) return insights[0]!;
        return insights[Math.floor(Math.random() * insights.length)]!;
    }
}
