import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Target,
    Flag,
    Award,
    BookOpen,
    CheckCircle2,
    Trash2,
    ChevronRight,
    Circle,
    TrendingUp
} from 'lucide-react';
import { goalsAPI, tasksAPI } from '../api';

const CircularProgress = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#8b5cf6"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray="264"
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (264 * value) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[3.5rem] font-bold text-[#0f172a] leading-none tracking-tighter">{value}</span>
                </div>
            </div>
            {label && <p className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>}
        </div>
    );
};

export function GoalsModule({ onUpdate, user }) {
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Career');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('high');

    const fetchGoals = async () => {
        try {
            const res = await goalsAPI.getGoals();
            setGoals(res.data);
        } catch (err) {
            console.error('Failed to fetch goals', err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    const calculateProgress = (goal) => {
        if (!goal.tasks || goal.tasks.length === 0) return goal.progress || 0;
        const completed = goal.tasks.filter(t => t.status === 'done').length;
        return Math.round((completed / goal.tasks.length) * 100);
    };

    // Dynamic data derivation
    const activeGoals = goals.filter(g => g.status !== 'completed');
    const purposeScore = goals.length > 0
        ? Math.round(goals.reduce((acc, g) => acc + calculateProgress(g), 0) / goals.length)
        : 0;

    const skills = goals
        .filter(g => g.category?.toLowerCase() === 'skills' || g.category?.toLowerCase() === 'career')
        .map(g => ({ name: g.title, progress: calculateProgress(g) }));

    const learningPath = goals
        .filter(g => g.category?.toLowerCase() === 'learning' || g.category?.toLowerCase() === 'personal')
        .map(g => ({
            title: g.title,
            type: g.category,
            status: calculateProgress(g) === 100 ? 'done' : calculateProgress(g) > 0 ? 'in-progress' : 'todo',
            progress: calculateProgress(g)
        }));

    const stats = [
        { label: 'Active Goals', value: activeGoals.length.toString(), icon: Flag, bgColor: '#faf5ff' },
        { label: 'Skills Tracked', value: skills.length.toString(), icon: Award, bgColor: '#faf5ff' },
        { label: 'Learning Items', value: learningPath.length.toString(), trend: '0%', trendText: 'no data', icon: BookOpen, bgColor: '#faf5ff' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-100">
                        <Target size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Purpose & Career</h1>
                        <p className="text-slate-400 font-semibold text-sm mt-0.5">Define your mission and track your growth</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-violet-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>New Goal</span>
                </button>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Purpose Score Gauge */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 self-start">Purpose Score</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={purposeScore} label="Overall purpose alignment score" />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden border border-slate-50/50 shadow-sm transition-all hover:shadow-md cursor-default" style={{ backgroundColor: stat.bgColor }}>
                        <div className="flex justify-between items-start">
                            <span className="text-[14px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="p-2 rounded-xl bg-white shadow-sm">
                                <stat.icon size={18} className="text-violet-600" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="text-[3rem] font-bold text-[#0f172a] tracking-tight leading-none">{stat.value}</p>
                            {stat.trend && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[11px] font-black text-emerald-500">{stat.trend}</span>
                                    <span className="text-[11px] font-bold text-slate-400">{stat.trendText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Goals List Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <h3 className="text-xl font-bold text-[#0f172a] mb-10 tracking-tight">Your Goals</h3>
                <div className="space-y-10">
                    {goals.length > 0 ? goals.map((goal) => (
                        <div key={goal._id} className="p-10 border border-slate-50 rounded-[2.5rem] bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-2">{goal.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{goal.category}</span>
                                        <span className="text-slate-400 text-xs font-bold">Due {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                                    </div>
                                </div>
                                <span className="text-3xl font-black text-violet-600">{calculateProgress(goal)}%</span>
                            </div>

                            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculateProgress(goal)}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                {goal.tasks?.map((task) => (
                                    <div key={task._id} className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-200'}`}>
                                            {task.status === 'done' && <CheckCircle2 size={12} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-[15px] font-bold ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{task.title}</span>
                                    </div>
                                ))}
                                {(!goal.tasks || goal.tasks.length === 0) && (
                                    <p className="text-slate-400 text-sm font-bold opacity-60">No sub-tasks defined</p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-slate-50/30 rounded-[2.5rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active missions. Dream big and start one!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Skills & Learning Path Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Progress */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-10 tracking-tight">Skills Progress</h3>
                    <div className="space-y-8">
                        {skills.length > 0 ? skills.map((skill) => (
                            <div key={skill.name} className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-600">{skill.name}</span>
                                    <span className="text-slate-400">{skill.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.progress}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No skills being tracked</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Learning Path */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-10 tracking-tight">Learning Path</h3>
                    <div className="space-y-4">
                        {learningPath.length > 0 ? learningPath.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white ${item.status === 'done' ? 'text-violet-600' : 'text-slate-400'}`}>
                                        {item.status === 'done' ? (
                                            <CheckCircle2 size={20} strokeWidth={2.5} />
                                        ) : item.status === 'in-progress' ? (
                                            <div className="relative w-5 h-5">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" stroke="#f1f5f9" strokeWidth="3" fill="none" />
                                                    <circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth="3" fill="none" strokeDasharray="62.8" strokeDashoffset={62.8 * (1 - (item.progress || 0) / 100)} strokeLinecap="round" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <Circle size={20} strokeWidth={2.5} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-bold text-[#0f172a] tracking-tight">{item.title}</p>
                                        <p className="text-[11px] font-bold text-slate-400 tracking-tight">{item.type}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                            </div>
                        )) : (
                            <div className="py-10 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Learning path empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Goal Creation Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-8 text-[#0f172a]">Define Mission</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await goalsAPI.createGoal({ title, description, category, deadline: deadline ? new Date(deadline) : undefined, priority, status: 'active', progress: 0 });
                            setShowForm(false); fetchGoals(); if (onUpdate) onUpdate();
                        }} className="space-y-6">
                            <input placeholder="Goal Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none text-[#0f172a]" required />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none text-[#0f172a]">
                                    {['Career', 'Skills', 'Health', 'Wealth', 'Personal'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none text-[#0f172a]" />
                            </div>
                            <div className="flex space-x-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                                <button className="flex-1 bg-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-violet-100">Start Mission</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
