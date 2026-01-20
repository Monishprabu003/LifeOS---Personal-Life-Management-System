import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Heart,
    Wallet,
    Users,
    CheckSquare,
    Target,
    RefreshCw,
    ExternalLink,
    Activity,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import {
    XAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { kernelAPI, tasksAPI } from '../api';

const CircularProgress = ({ value, color, size = 180 }) => {
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="#f1f5f9"
                    strokeWidth="3"
                    fill="transparent"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="276"
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * value) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[3.5rem] font-bold text-[#0f172a] leading-none tracking-tighter">
                    {Math.round(value)}
                </span>
            </div>
        </div>
    );
};

export function DashboardModule({ dashboardData, loading, setActiveTab }) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    const deleteTask = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await tasksAPI.deleteTask(id);
            if (setActiveTab) {
                // Trigger global refresh via App.jsx mechanism if possible
                // or just rely on the next poll/update
            }
            window.location.reload(); // Quickest way to refresh shared dashboard state
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    if (loading || !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin text-[#10b981] opacity-20" />
            </div>
        );
    }

    const trendData = dashboardData?.trend || [{ name: 'N/A', performance: 0 }];

    const modules = [
        { name: 'Health', score: dashboardData?.healthScore || 0, color: '#10b981', bgColor: '#f0fdf4', icon: Heart, tab: 'health' },
        { name: 'Wealth', score: dashboardData?.wealthScore || 0, color: '#3b82f6', bgColor: '#eff6ff', icon: Wallet, tab: 'wealth' },
        { name: 'Relationships', score: dashboardData?.relationshipScore || 0, color: '#f43f5e', bgColor: '#fff1f2', icon: Users, tab: 'relationships' },
        { name: 'Habits', score: dashboardData?.habitScore || 0, color: '#f59e0b', bgColor: '#fffbeb', icon: CheckSquare, tab: 'habits' },
        { name: 'Purpose', score: dashboardData?.goalScore || 0, color: '#8b5cf6', bgColor: '#faf5ff', icon: Target, tab: 'goals' },
    ];

    const todayFocus = dashboardData?.dailyStats?.tasks || [];
    const completedTasks = todayFocus.filter(t => t.completed).length;
    const totalTasks = todayFocus.length;

    return (
        <div className="space-y-12 pb-10">
            {/* Main Hero Card */}
            <div className="bg-[#f8fafc] rounded-[3rem] p-12 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Gauge Section */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-12 self-start">LIFE PERFORMANCE INDEX</h3>
                        <div className="relative">
                            <CircularProgress value={dashboardData?.lifeScore || 0} color="#10b981" />
                            <div className="absolute top-2 -right-10 bg-[#e3fff2] text-[#059669] px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm border border-emerald-100/50">
                                <TrendingUp size={12} strokeWidth={3} /> {dashboardData?.trendValue || '+0%'}
                            </div>
                        </div>
                        <div className="mt-12 text-left w-full">
                            <h4 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">
                                {dashboardData?.lifeScore > 80 ? "You're doing great!" : dashboardData?.lifeScore > 50 ? "Keep it up!" : "Let's get started!"}
                            </h4>
                            <p className="text-sm font-semibold text-slate-400">{today}</p>
                        </div>
                    </div>

                    {/* Trend Section */}
                    <div className="lg:col-span-8 flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">7-DAY TREND</h3>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                        dy={15}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="performance"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="url(#trendGradient)"
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Your Modules</h3>
                    <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                        View all <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {modules.map((mod) => (
                        <div
                            key={mod.name}
                            onClick={() => setActiveTab && setActiveTab(mod.tab)}
                            className="rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all active:scale-95 shadow-sm border border-transparent"
                            style={{ backgroundColor: mod.bgColor }}
                        >
                            {/* Color Accent Bar */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-l-full" style={{ backgroundColor: mod.color }} />

                            <div className="p-3 rounded-2xl mb-8 inline-flex transition-colors bg-white/60 shadow-sm" style={{ color: mod.color }}>
                                <mod.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-bold text-[#0f172a] tracking-tight leading-none">{mod.score}</span>
                                <span className="text-xs font-bold text-slate-400 mt-4 opacity-80 uppercase tracking-widest">{mod.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Focus Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <Activity className="text-[#10b981]" size={24} />
                        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Today's Focus</h3>
                    </div>
                    <div className="bg-[#f0fdf4] text-[#10b981] px-4 py-1.5 rounded-full text-[13px] font-bold">
                        {completedTasks}/{totalTasks}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {todayFocus.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group cursor-pointer relative overflow-hidden">
                            {/* Accent Bar */}
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full" style={{ backgroundColor: item.color }} />

                            <div className="pl-10">
                                <p className={`text-[17px] font-bold tracking-tight transition-all ${item.completed ? 'text-slate-400 line-through' : 'text-[#0f172a]'}`}>
                                    {item.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => deleteTask(item._id, e)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${item.completed ? 'bg-[#f0fdf4] text-[#10b981]' : 'bg-white border-2 border-slate-100 text-transparent shadow-sm'}`}>
                                    {item.completed ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
