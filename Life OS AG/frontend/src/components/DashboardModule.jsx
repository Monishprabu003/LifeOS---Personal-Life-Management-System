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

const CircularProgress = ({ value, color, size = 200 }) => {
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="#eefdf6"
                    strokeWidth="4"
                    fill="transparent"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke={color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="289"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * value) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[3.8rem] font-bold text-[#0f172a] leading-none tracking-tight">
                    {Math.round(value)}
                </span>
            </div>
        </div>
    );
};

export function DashboardModule({ dashboardData, loading, setActiveTab, allLogs, onUpdate }) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    const handleDeleteLog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this log?')) return;
        try {
            await kernelAPI.deleteEvent(id);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('WARNING: This will permanently delete ALL logs across ALL modules. Are you absolutely sure?')) return;
        try {
            await kernelAPI.deleteAllLogs();
            if (onUpdate) onUpdate();
            alert('All logs cleared successfully.');
        } catch (err) {
            console.error('Failed to clear logs', err);
            alert('Failed to clear logs. Please try again.');
        }
    };

    if (loading) {
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

    return (
        <div className="space-y-12 pb-10">
            {/* Main Hero Card */}
            <div className="bg-[#f8fafc] rounded-[3rem] p-12 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Gauge Section */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-14">LIFE PERFORMANCE INDEX</h3>
                        <div className="relative group">
                            <CircularProgress value={dashboardData?.lifeScore || 0} color="#10b981" />
                            <div className="absolute -top-2 -right-6 bg-[#e3fff2] text-[#059669] px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm border border-emerald-100/80 backdrop-blur-sm z-20">
                                <TrendingUp size={14} strokeWidth={3} /> {dashboardData?.trendValue || '+0%'}
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

            {/* All Logs Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <Activity className="text-[#10b981]" size={24} />
                        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">All Logs</h3>
                    </div>
                    {allLogs && allLogs.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-5 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Trash2 size={14} />
                            <span>Clear All Logs</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {allLogs && allLogs.length > 0 ? allLogs.map((log) => (
                        <div key={log._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group relative overflow-hidden">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#10b981] shadow-sm">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-[16px] font-bold text-[#0f172a] tracking-tight">{log.description}</p>
                                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteLog(log._id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )) : (
                        <div className="py-12 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No logs recorded yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
