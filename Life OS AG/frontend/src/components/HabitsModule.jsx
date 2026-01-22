import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    CheckCircle2,
    Flame,
    Target,
    TrendingUp,
    ClipboardList,
    Trash2
} from 'lucide-react';
import { habitsAPI } from '../api';

const CircularProgress = ({ value, sublabel }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
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
                        stroke="#f59e0b"
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
            {sublabel && <p className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-tight">{sublabel}</p>}
        </div>
    );
};

export function HabitsModule({ onUpdate, user }) {
    const [habits, setHabits] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [description, setDescription] = useState('');

    const fetchHabits = async () => {
        try {
            const res = await habitsAPI.getHabits();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const habitsWithCompletion = res.data.map((h) => ({
                ...h,
                completedToday: h.lastCompleted && new Date(h.lastCompleted) >= today
            }));
            setHabits(habitsWithCompletion);
        } catch (err) {
            console.error('Failed to fetch habits', err);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [user]);

    const completeHabit = async (id) => {
        try {
            await habitsAPI.completeHabit(id);
            fetchHabits();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Completion failed', err);
        }
    };

    const handleDeleteHabit = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this habit?')) return;
        try {
            await habitsAPI.deleteHabit(id);
            fetchHabits();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const activeHabitsCount = habits.length;
    const completedTodayCount = habits.filter(h => h.completedToday).length;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
    const todayProgress = habits.length > 0 ? Math.round((completedTodayCount / activeHabitsCount) * 100) : 0;

    const stats = [
        { label: 'Active Habits', value: activeHabitsCount.toString(), icon: ClipboardList, bgColor: '#fffbeb' },
        { label: 'Completed Today', value: completedTodayCount.toString(), icon: Target, bgColor: '#fffbeb' },
        { label: 'Longest Streak', value: `${longestStreak} days`, icon: Flame, bgColor: '#fffbeb' },
        { label: 'Success Rate', value: `${todayProgress}%`, trend: '0%', trendText: 'no data', icon: TrendingUp, bgColor: '#fffbeb' },
    ];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const weeklyData = days.map((day, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (todayIndex - i));
        date.setHours(0, 0, 0, 0);
        const completions = habits.filter(h => h.history && h.history.some(log => {
            const logDate = new Date(log.date || log.timestamp);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === date.getTime();
        })).length;
        return { day, score: `${completions}/${activeHabitsCount || 0}`, active: i === todayIndex };
    });

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-lg shadow-orange-100">
                        <CheckCircle2 size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Habits & Tasks</h1>
                        <p className="text-slate-400 font-semibold text-sm mt-0.5">Build consistency and track your streaks</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#f59e0b] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-orange-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>New Habit</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 self-start">Today's Progress</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={todayProgress} sublabel={`${completedTodayCount}/${activeHabitsCount} habits completed`} />
                    </div>
                </div>
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden border border-slate-50/50 shadow-sm transition-all hover:shadow-md cursor-default" style={{ backgroundColor: stat.bgColor }}>
                        <div className="flex justify-between items-start">
                            <span className="text-[14px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="p-2 rounded-xl bg-white shadow-sm">
                                <stat.icon size={18} className="text-[#f59e0b]" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="text-[3rem] font-bold text-[#0f172a] tracking-tight leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <h3 className="text-xl font-bold text-[#0f172a] mb-10 tracking-tight">Weekly Overview</h3>
                <div className="grid grid-cols-7 gap-5">
                    {weeklyData.map((item) => (
                        <div key={item.day} className="flex flex-col items-center gap-4">
                            <div className={`w-full h-32 rounded-[2rem] flex items-center justify-center transition-all ${item.active ? 'bg-[#f59e0b] text-white shadow-lg shadow-orange-100' : 'bg-[#fff7ed] text-[#f59e0b]'}`}>
                                <span className="text-[14px] font-bold">{item.score}</span>
                            </div>
                            <span className="text-[13px] font-bold text-slate-400">{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <h3 className="text-xl font-bold text-[#0f172a] mb-10 tracking-[0.01em]">Your Habits</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {habits.length > 0 ? habits.map((habit, idx) => (
                        <div
                            key={habit._id || idx}
                            onClick={() => !habit.completedToday && completeHabit(habit._id)}
                            className={`p-10 rounded-[2rem] border-2 transition-all cursor-pointer group relative ${habit.completedToday
                                ? 'border-[#f59e0b] bg-[#fffcf5]'
                                : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="text-4xl">
                                        {habit.emoji || '✨'}
                                    </div>
                                    <div>
                                        <h4 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{habit.name}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[15px] font-bold text-slate-400 flex items-center gap-2">
                                                <Flame size={16} className="text-[#f59e0b] fill-[#f59e0b]" /> {habit.streak || 0} day streak
                                            </span>
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: habit.color || '#f59e0b' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => handleDeleteHabit(habit._id, e)}
                                        className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${habit.completedToday ? 'bg-[#f59e0b] border-[#f59e0b]' : 'border-[#cbd5e1]'}`}>
                                        {habit.completedToday && (
                                            <svg width="18" height="14" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[13px] font-bold">
                                    <span className="text-slate-400">Progress to goal</span>
                                    <span className="text-slate-400">{habit.streak || 0}/{habit.targetDays || 30} days</span>
                                </div>
                                <div className="h-4 w-full bg-[#fceacc]/40 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, ((habit.streak || 0) / (habit.targetDays || 30)) * 100)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 * idx }}
                                        className="h-full bg-[#10b981] rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 py-20 text-center bg-slate-50/30 rounded-[2.5rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No habits tracked yet. Start one today!</p>
                        </div>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-8 text-[#0f172a]">New Habit</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await habitsAPI.createHabit({ name, frequency, description });
                            setShowForm(false); setName(''); setFrequency('daily'); setDescription(''); fetchHabits(); if (onUpdate) onUpdate();
                        }} className="space-y-6">
                            <input placeholder="Habit Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none text-[#0f172a]" required />
                            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none text-[#0f172a]">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                            <div className="flex space-x-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                                <button className="flex-1 bg-[#f59e0b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100">Start Ritual</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
