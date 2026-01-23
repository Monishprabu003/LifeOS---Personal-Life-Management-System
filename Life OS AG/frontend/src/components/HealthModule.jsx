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
    TrendingDown,
    Trash2
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

export function HealthModule({ onUpdate, user, dashboardData }) {
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

    const handleDeleteLog = async (id) => {
        if (!window.confirm('Delete this health log?')) return;
        try {
            await healthAPI.deleteLog(id);
            fetchLogs();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Delete failed', err);
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
        days.forEach((day, i) => sleepData.push({ name: day, hours: 0 }));
    }

    const trendData = logs.slice(0, 7).reverse().map(log => ({
        name: new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: log.mood || 0,
        stress: log.stress || 0
    }));

    if (trendData.length === 0) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach((day, i) => trendData.push({ name: day, mood: 0, stress: 0 }));
    }

    const dailyScore = latestLog
        ? Math.round(((latestLog.mood * 10) + (latestLog.sleepHours * 10) + (100 - (latestLog.stress * 10)) + (Math.min(latestLog.waterIntake, 2.5) * 40)) / 4)
        : 0;

    const stats = [
        { label: 'Sleep', value: latestLog ? `${latestLog.sleepHours} hrs` : '0 hrs', icon: Moon, trend: '0%', trendText: 'no data', color: '#10b981' },
        { label: 'Water', value: latestLog ? `${latestLog.waterIntake} L` : '0 L', icon: Droplets, trend: '0%', trendText: 'no data', color: '#10b981' },
        { label: 'Mood', value: latestLog ? `${latestLog.mood}/10` : '0/10', icon: Smile, trend: '0%', trendText: 'no data', color: '#10b981' },
        { label: 'Stress', value: latestLog ? `${latestLog.stress}/10` : '0/10', icon: Activity, trend: '0%', trendText: 'no data', color: '#ef4444' },
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
                <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-[2rem] p-10 border border-emerald-100/50 shadow-sm flex flex-col items-center justify-between text-center min-h-[380px]">
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
                        className="bg-[#f0fdf4] rounded-[2rem] p-10 flex flex-col justify-start relative overflow-hidden border border-emerald-100/50 shadow-sm transition-all hover:shadow-lg hover:shadow-emerald-100/50 group cursor-pointer active:scale-[0.98] min-h-[380px]"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sleep Tracking Chart */}
                <div className="bg-white rounded-[2rem] p-10 border border-black/[0.08] shadow-sm">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-10">Sleep Tracking</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sleepData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    domain={[0, 12]}
                                    ticks={[0, 3, 6, 9, 12]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood & Stress Chart */}
                <div className="bg-white rounded-[2rem] p-10 border border-black/[0.08] shadow-sm">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-10">Mood & Stress Trends</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
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
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="stress"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Health Habits Section */}
            <div className="bg-white rounded-[2rem] p-10 border border-black/[0.08] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[17px] font-bold text-[#0f172a]">Health Habits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dashboardData?.healthHabits?.length > 0 ? dashboardData.healthHabits.map((habit) => (
                        <div key={habit.name} className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${habit.done ? 'bg-[#f0fdf4] border-[#10b981]/60' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${habit.done ? 'bg-[#10b981] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <habit.icon size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className={`text-[15px] font-bold tracking-tight text-[#0f172a]`}>{habit.name}</p>
                                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">{habit.streak || '0 day streak'} 🔥</p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${habit.done ? 'bg-[#10b981] border-[#10b981]' : 'border-slate-300'}`}>
                                {habit.done && (
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 py-10 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No health habits defined</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Logs Section */}
            <div className="bg-white rounded-[2rem] p-10 border border-black/[0.08] shadow-sm">
                <h3 className="text-[17px] font-bold text-[#0f172a] mb-8">Recent Health Logs</h3>
                <div className="space-y-4">
                    {logs.length > 0 ? logs.slice(0, 5).map((log) => (
                        <div key={log._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl transition-all hover:bg-slate-100/50 group">
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#10b981] shadow-sm">
                                    <Smile size={18} />
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-[#0f172a] tracking-tight">
                                        Mood: {log.mood}/10 • Sleep: {log.sleepHours}h • Water: {log.waterIntake}L
                                    </p>
                                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteLog(log._id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )) : (
                        <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No logs recorded yet</p>
                    )}
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
