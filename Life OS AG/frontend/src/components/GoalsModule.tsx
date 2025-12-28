import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Target,
    Flag,
    Award,
    BookOpen,
    ChevronRight,
    CheckCircle2,
    Circle,
    TrendingUp
} from 'lucide-react';
import { goalsAPI } from '../api';

interface Goal {
    _id: string;
    title: string;
    category: string;
    deadline: string;
    priority: string;
    status: string;
    progress: number;
    subTasks?: Array<{ title: string; completed: boolean }>;
}

export function GoalsModule({ onUpdate }: { onUpdate?: () => void }) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Career');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('high');

    const fetchGoals = async () => {
        try {
            const res = await goalsAPI.getGoals();
            // Enrich goals with mock subtasks for UI demonstration if they don't exist
            const enrichedGoals = res.data.map((g: Goal) => ({
                ...g,
                subTasks: [
                    { title: 'Complete initial research', completed: g.progress > 20 },
                    { title: 'Build core features', completed: g.progress > 50 },
                    { title: 'Beta testing', completed: g.progress > 80 },
                    { title: 'Marketing launch', completed: g.progress === 100 }
                ]
            }));
            setGoals(enrichedGoals);
        } catch (err) {
            console.error('Failed to fetch goals', err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await goalsAPI.createGoal({
                title,
                category,
                deadline: deadline ? new Date(deadline) : undefined,
                priority,
                status: 'active',
                progress: 0
            });
            setShowForm(false);
            setTitle('');
            setCategory('Career');
            setDeadline('');
            setPriority('high');
            fetchGoals();
            if (onUpdate) onUpdate();
        } catch (err) {
            alert('Failed to initialize mission');
        }
    };

    const categories = ['Career', 'Skills', 'Health', 'Wealth', 'Personal'];

    // Mock data for bottom section
    const skills = [
        { name: 'JavaScript', progress: 85 },
        { name: 'React', progress: 80 },
        { name: 'Leadership', progress: 65 },
        { name: 'Communication', progress: 75 },
        { name: 'Python', progress: 45 },
    ];

    const learningItems = [
        { title: 'Advanced React Patterns', type: 'Course', status: 'completed' },
        { title: 'System Design Fundamentals', type: 'Course', status: 'in-progress' },
        { title: 'Machine Learning Basics', type: 'Course', status: 'todo' },
        { title: 'Public Speaking Workshop', type: 'Workshop', status: 'todo' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
                        <Target size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Purpose & Career</h1>
                        <p className="text-slate-500 font-medium mt-1">Define your mission and track your growth</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Goal</span>
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Purpose Score */}
                <div className="bg-[#f5f3ff] dark:bg-slate-900 rounded-[2.5rem] p-8 border border-purple-50 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-6">Purpose Score</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-purple-50 dark:text-slate-800"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="#8b5cf6"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * 76) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-4xl font-display font-bold text-[#0f172a] dark:text-white">76</span>
                    </div>
                    <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Strong progress on goals</p>
                </div>

                {/* Active Goals */}
                <div className="bg-[#f5f3ff] dark:bg-slate-900 rounded-[2.5rem] p-8 border border-purple-50 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Active Goals</p>
                        <Flag size={20} className="text-[#8b5cf6]" />
                    </div>
                    <h4 className="text-5xl font-display font-bold text-[#0f172a] dark:text-white mt-4">{goals.length}</h4>
                </div>

                {/* Skills Tracked */}
                <div className="bg-[#f5f3ff] dark:bg-slate-900 rounded-[2.5rem] p-8 border border-purple-50 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Skills Tracked</p>
                        <Award size={20} className="text-[#8b5cf6]" />
                    </div>
                    <h4 className="text-5xl font-display font-bold text-[#0f172a] dark:text-white mt-4">{skills.length}</h4>
                </div>

                {/* Learning Items */}
                <div className="bg-[#f5f3ff] dark:bg-slate-900 rounded-[2.5rem] p-8 border border-purple-50 dark:border-slate-800 shadow-sm flex flex-col justify-between text-left">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Learning Items</p>
                        <BookOpen size={20} className="text-[#8b5cf6]" />
                    </div>
                    <div className="mt-4">
                        <h4 className="text-5xl font-display font-bold text-[#0f172a] dark:text-white">{learningItems.length}</h4>
                        <p className="text-[10px] font-bold text-[#10b981] mt-2">+25% vs last week</p>
                    </div>
                </div>
            </div>

            {/* Goals List Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-10 pl-2">Your Goals</h3>
                <div className="space-y-6">
                    {goals.map(goal => (
                        <div key={goal._id} className="p-8 border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border-b-2">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xl font-bold text-[#0f172a] dark:text-white">{goal.title}</h4>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="bg-[#f5f3ff] text-[#8b5cf6] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{goal.category}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Mar 2025'}</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-display font-bold text-[#8b5cf6]">{goal.progress}%</span>
                            </div>

                            <div className="w-full h-2.5 bg-purple-50 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${goal.progress}%` }}
                                    className="h-full bg-[#10b981] rounded-full"
                                />
                            </div>

                            <div className="space-y-3 pl-1">
                                {(goal.subTasks || []).map((task, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        {task.completed ? (
                                            <CheckCircle2 size={18} className="text-[#8b5cf6]" />
                                        ) : (
                                            <Circle size={18} className="text-slate-300" />
                                        )}
                                        <span className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {goals.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <Target size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No active goals found. Start your mission by clicking "New Goal".</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Skills & Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Skills Progress */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-10">Skills Progress</h3>
                    <div className="space-y-8">
                        {skills.map(skill => (
                            <div key={skill.name} className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-sm font-bold text-[#0f172a] dark:text-white">{skill.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{skill.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-purple-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.progress}%` }}
                                        className="h-full bg-[#10b981] rounded-full shadow-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Path */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-10">Learning Path</h3>
                    <div className="space-y-4">
                        {learningItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-[#f5f3ff]/50 dark:bg-purple-900/10 rounded-2xl hover:bg-[#f5f3ff] transition-all cursor-pointer group">
                                <div className="flex items-center space-x-5">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                        {item.status === 'completed' ? (
                                            <CheckCircle2 size={20} className="text-[#8b5cf6]" />
                                        ) : item.status === 'in-progress' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Target size={20} className="text-[#8b5cf6]/50" />
                                            </motion.div>
                                        ) : (
                                            <Circle size={20} className="text-slate-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-[#8b5cf6] transition-colors">{item.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.type}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#8b5cf6] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Goal Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative"
                    >
                        <h2 className="text-2xl font-bold mb-8 text-[#0f172a] dark:text-white">Initialize Mission</h2>
                        <form onSubmit={handleCreateGoal} className="space-y-6">
                            <input
                                placeholder="Goal Title (e.g. Get Promoted to Senior)"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 dark:shadow-none transition-all">
                                    Start Mission
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
