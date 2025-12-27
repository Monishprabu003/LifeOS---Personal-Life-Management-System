import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Plus,
    Moon,
    Droplets,
    Smile,
    Zap,
    Activity,
    CheckCircle2,
    Flame
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

const sleepData = [
    { name: 'Mon', hours: 7 },
    { name: 'Tue', hours: 6.5 },
    { name: 'Wed', hours: 8 },
    { name: 'Thu', hours: 7.5 },
    { name: 'Fri', hours: 7 },
    { name: 'Sat', hours: 9 },
    { name: 'Sun', hours: 8.5 },
];

const trendData = [
    { name: 'Mon', mood: 7, stress: 3 },
    { name: 'Tue', mood: 6, stress: 4 },
    { name: 'Wed', mood: 8, stress: 3 },
    { name: 'Thu', mood: 7, stress: 5 },
    { name: 'Fri', mood: 8, stress: 4 },
    { name: 'Sat', mood: 9, stress: 3 },
    { name: 'Sun', mood: 8, stress: 4 },
];

const CircularProgress = ({ value, color, size = 120, strokeWidth = 10, label }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size + 40 }}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">{value}</span>
                </div>
            </div>
            {label && <p className="mt-4 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">{label}</p>}
        </div>
    );
};

export function HealthModule({ onUpdate }: { onUpdate?: () => void }) {
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    const habits = [
        { name: 'Morning Meditation', streak: 12, completed: true, icon: Smile, color: 'text-[#10b981]', bg: 'bg-[#ecfdf5]' },
        { name: '30 Min Workout', streak: 8, completed: false, icon: Activity, color: 'text-[#f59e0b]', bg: 'bg-[#fffbeb]' },
        { name: '10K Steps', streak: 5, completed: false, icon: Zap, color: 'text-[#3b82f6]', bg: 'bg-[#eff6ff]' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#10b981] flex items-center justify-center text-white shadow-lg shadow-green-100">
                        <Heart size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Health & Wellbeing</h1>
                        <p className="text-slate-500 font-medium mt-1">Track your daily health indicators</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="bg-[#10b981] hover:bg-[#0da271] text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-green-100 dark:shadow-none"
                >
                    <Plus size={20} />
                    <span>Log Today's Health</span>
                </button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
                    <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-8 self-start">Daily Health Score</h3>
                    <CircularProgress value={76} color="#10b981" size={120} label="Based on today's metrics" />
                </div>

                <div className="bg-[#ecfdf5] dark:bg-[#10b981]/10 rounded-[2.5rem] p-8 relative group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sleep</p>
                            <h4 className="text-2xl font-display font-bold mt-2 text-[#0f172a] dark:text-white">7.5 hrs</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+8% vs last week</p>
                        </div>
                        <Moon size={22} className="text-[#10b981]" />
                    </div>
                </div>

                <div className="bg-[#ecfdf5] dark:bg-[#10b981]/10 rounded-[2.5rem] p-8 relative group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Water</p>
                            <h4 className="text-2xl font-display font-bold mt-2 text-[#0f172a] dark:text-white">2.1 L</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+12% vs last week</p>
                        </div>
                        <Droplets size={22} className="text-[#10b981] opacity-70" />
                    </div>
                </div>

                <div className="bg-[#ecfdf5] dark:bg-[#10b981]/10 rounded-[2.5rem] p-8 relative group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mood</p>
                            <h4 className="text-2xl font-display font-bold mt-2 text-[#0f172a] dark:text-white">8/10</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+5% vs last week</p>
                        </div>
                        <Smile size={22} className="text-[#10b981] opacity-70" />
                    </div>
                </div>

                <div className="bg-[#ecfdf5] dark:bg-[#10b981]/10 rounded-[2.5rem] p-8 relative group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stress</p>
                            <h4 className="text-2xl font-display font-bold mt-2 text-[#0f172a] dark:text-white">3/10</h4>
                            <p className="text-[10px] font-bold text-red-500 mt-2">15% vs last week</p>
                        </div>
                        <Activity size={22} className="text-red-500/60" />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Sleep Tracking</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sleepData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    domain={[0, 12]}
                                    ticks={[0, 3, 6, 9, 12]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 8, 8]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Mood & Stress Trends</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    domain={[0, 12]}
                                    ticks={[0, 3, 6, 9, 12]}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                />
                                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                                <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Health Habits Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Health Habits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {habits.map((habit) => {
                        const Icon = habit.icon;
                        return (
                            <div
                                key={habit.name}
                                className={`p-6 rounded-[2rem] flex items-center justify-between transition-all cursor-pointer group border-2 ${habit.completed ? 'border-[#10b981] bg-[#ecfdf5] dark:bg-[#10b981]/10' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-800'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${habit.completed ? 'bg-white text-[#10b981]' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${habit.completed ? 'text-[#0da271]' : 'text-slate-600 dark:text-slate-300'}`}>{habit.name}</h4>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{habit.streak} day streak</span>
                                            <Flame size={12} className="text-orange-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-2 ${habit.completed ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-slate-200 dark:border-slate-700 text-transparent'}`}>
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <HealthLogModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSave={(data) => {
                    console.log('Saved Health Data:', data);
                    if (onUpdate) onUpdate();
                }}
            />
        </div>
    );
}
