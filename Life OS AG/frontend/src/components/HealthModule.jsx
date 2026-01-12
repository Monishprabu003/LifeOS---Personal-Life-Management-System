import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Plus,
    Moon,
    Droplets,
    Smile,
    Zap,
    Activity,
    Brain,
    Footprints,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { HealthLogModal } from './HealthLogModal';
import { healthAPI } from '../api';

const CircularProgress = ({ value, color, size = 160 }) => {
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                    fill="transparent"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * value) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[2.8rem] font-bold text-[#0f172a] leading-none tracking-tighter">
                    {Math.round(value)}
                </span>
            </div>
        </div>
    );
};

export function HealthModule({ onUpdate, user }) {
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await healthAPI.getLogs();
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch health logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [user]);

    const latestLog = logs[0] || null;

    const sleepData = logs.slice(0, 7).reverse().map(log => ({
        name: new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        hours: log.sleepHours || 0
    }));

    if (sleepData.length === 0) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [7, 6.5, 8, 7.5, 7, 9, 8];
        days.forEach((day, i) => sleepData.push({ name: day, hours: values[i] }));
    }

    const trendData = logs.slice(0, 7).reverse().map(log => ({
        name: new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: log.mood || 0,
        stress: log.stress || 0
    }));

    if (trendData.length === 0) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const moodVals = [7, 6, 8, 7, 8, 9, 8];
        const stressVals = [4, 5, 3, 4, 3, 2, 3];
        days.forEach((day, i) => trendData.push({ name: day, mood: moodVals[i], stress: stressVals[i] }));
    }

    const dailyScore = latestLog
        ? Math.round(((latestLog.mood * 10) + (latestLog.sleepHours * 10) + (100 - (latestLog.stress * 10)) + (Math.min(latestLog.waterIntake, 2.5) * 40)) / 4)
        : 76;

    const stats = [
        { label: 'Sleep', value: '7.5 hrs', icon: Moon, trend: '+8%', trendText: 'vs last week', color: '#10b981' },
        { label: 'Water', value: '2.1 L', icon: Droplets, trend: '+12%', trendText: 'vs last week', color: '#10b981' },
        { label: 'Mood', value: '8/10', icon: Smile, trend: '+5%', trendText: 'vs last week', color: '#10b981' },
        { label: 'Stress', value: '3/10', icon: Activity, trend: '15%', trendText: 'vs last week', color: '#ef4444' },
    ];

    return (
        <div className="space-y-12 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shadow-xl shadow-emerald-100/50">
                        <Heart size={28} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-[2.2rem] font-bold text-[#0f172a] tracking-tight leading-none">Health & Wellbeing</h1>
                        <p className="text-slate-400 font-bold text-sm mt-3">Track your daily health indicators</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="bg-[#10b981] hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-100/30"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Log Today's Health</span>
                </button>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Score Card */}
                <div className="bg-white rounded-[2rem] p-10 border border-[#e6f4f1] shadow-sm flex flex-col items-center justify-between text-center min-h-[380px]">
                    <h3 className="text-[17px] font-bold text-[#0f172a] self-start ml-2">Daily Health Score</h3>
                    <div className="flex-1 flex items-center justify-center py-6">
                        <CircularProgress value={dailyScore} color="#10b981" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 opacity-80">Based on today's metrics</p>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[#f0fdfa]/60 rounded-[2rem] p-10 flex flex-col justify-start relative overflow-hidden border border-[#ccfbf1] shadow-sm transition-all hover:shadow-lg hover:shadow-emerald-50/50 group cursor-pointer active:scale-[0.98] min-h-[380px]"
                    >
                        {/* Icon Container at Top Right */}
                        <div className="absolute top-10 right-10 w-12 h-12 rounded-full border border-[#10b981]/20 flex items-center justify-center text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white transition-all duration-300">
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>

                        <div className="space-y-4">
                            <span className="text-[16px] font-bold text-slate-400">{stat.label}</span>
                            <div className="flex flex-col gap-2">
                                <p className="text-[2.2rem] font-bold text-[#0f172a] tracking-tight leading-none">{stat.value}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[13px] font-black ${stat.label === 'Stress' ? 'text-red-500' : 'text-[#10b981]'}`}>{stat.trend}</span>
                                    <span className="text-[13px] font-bold text-slate-400 opacity-60">{stat.trendText}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sleep Chart */}
                <div className="lg:col-span-6 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0f172a] mb-10 opacity-70 uppercase tracking-widest">Sleep Tracking (7 Days)</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sleepData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    domain={[0, 12]}
                                    ticks={[0, 3, 6, 9, 12]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="hours" fill="#10b981" radius={[6, 6, 0, 0]} barSize={45} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood & Stress Chart */}
                <div className="lg:col-span-6 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0f172a] mb-10 opacity-70 uppercase tracking-widest">Mood & Stress Trends</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    domain={[0, 12]}
                                    ticks={[0, 3, 6, 9, 12]}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="stress"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Health Habits Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Health Habits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Morning Meditation', streak: '12 day streak 🔥', done: true, icon: Brain, color: '#10b981' },
                        { name: '30 Min Workout', streak: '8 day streak 🔥', done: false, icon: Activity, color: '#3b82f6' },
                        { name: '10K Steps', streak: '5 day streak 🔥', done: false, icon: Footprints, color: '#8b5cf6' }
                    ].map((habit) => (
                        <div key={habit.name} className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${habit.done ? 'bg-[#f0fdf4] border-[#10b981]/10 shadow-sm' : 'bg-slate-50/50 border-transparent hover:bg-slate-100/50'}`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${habit.done ? 'bg-white text-[#10b981] shadow-md shadow-emerald-100/50' : 'bg-white text-slate-300 shadow-sm'}`}>
                                    <habit.icon size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className={`text-[15px] font-bold tracking-tight ${habit.done ? 'text-[#0f172a]' : 'text-slate-500'}`}>{habit.name}</p>
                                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{habit.streak}</p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${habit.done ? 'bg-[#10b981] border-[#10b981]' : 'border-slate-200'}`}>
                                {habit.done && (
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <HealthLogModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSave={async (data) => {
                    await healthAPI.createLog(data);
                    fetchLogs();
                    if (onUpdate) onUpdate();
                    setIsLogModalOpen(false);
                }}
            />
        </div>
    );
}
