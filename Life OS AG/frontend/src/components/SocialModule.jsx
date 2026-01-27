import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Phone,
    Heart,
    MessageSquare,
    MoreVertical,
    Trash2,
    Star
} from 'lucide-react';
import { AddConnectionModal } from './AddConnectionModal';
import { socialAPI, kernelAPI } from '../api';

const CircularProgress = ({ value, color = '#e11d48' }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#fdf2f2"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={color}
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
                    <span className="text-[2.8rem] font-bold text-[#0f172a] leading-none tracking-tighter">{value}</span>
                </div>
            </div>
            <p className="mt-8 text-[13px] font-bold text-slate-400 tracking-tight uppercase tracking-[0.1em]">Happiness Index</p>
        </div>
    );
};

export function SocialModule({ onUpdate, user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [connections, setConnections] = useState([]);
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const res = await socialAPI.getRelationships();
            const data = Array.isArray(res?.data) ? res.data : [];
            setConnections(data);
        } catch (err) {
            console.error('Failed to fetch connections', err);
            setConnections([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteRelationship = async (id) => {
        if (!window.confirm('Remove this connection?')) return;
        try {
            await socialAPI.deleteRelationship(id);
            await fetchConnections();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const fetchGratitude = async () => {
        try {
            const res = await kernelAPI.getEvents();
            const data = Array.isArray(res?.data) ? res.data : [];
            const entries = data.filter((e) => e && (e.type === 'emotional' || (e.title && e.title.includes('Gratitude'))));
            setGratitudeEntries(entries);
        } catch (err) {
            console.error('Failed to fetch gratitude', err);
            setGratitudeEntries([]);
        }
    };

    const handleQuickInteract = async (id, type) => {
        try {
            await socialAPI.logInteraction(id, {
                type: type,
                description: `Quick ${type} logged via connection shortcut.`
            });
            await fetchConnections();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Interaction failed', err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchGratitude();
    }, [user]);

    // Calculate dynamic stats with safety checks
    const safeConnections = Array.isArray(connections) ? connections : [];
    const safeGratitude = Array.isArray(gratitudeEntries) ? gratitudeEntries : [];

    // Calculate Wellness Score based on interaction freshness and goals
    const calculateConnectionScore = (conn) => {
        if (!conn.lastInteraction) return 10; // Base score for new connections

        const lastDate = new Date(conn.lastInteraction);
        const now = new Date();
        const daysSinceLast = (now - lastDate) / (1000 * 60 * 60 * 24);
        const goal = conn.frequencyGoal || 7;

        if (daysSinceLast <= goal) return 100;

        // Decay score after goal is missed
        const overGoal = daysSinceLast - goal;
        const decayPerDay = 100 / (goal * 2); // Decay fully over 2x the goal period
        return Math.max(10, Math.round(100 - (overGoal * decayPerDay)));
    };

    const wellnessScore = safeConnections.length > 0
        ? safeConnections.reduce((acc, c) => acc + calculateConnectionScore(c), 0) / safeConnections.length
        : 0;

    const totalWeeklyInteractions = safeConnections.reduce((acc, c) => {
        const history = Array.isArray(c.interactionHistory) ? c.interactionHistory : [];
        const weekly = history.filter(h => {
            try {
                const hDate = new Date(h.date);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return hDate > weekAgo;
            } catch {
                return false;
            }
        });
        return acc + weekly.length;
    }, 0);

    const stats = [
        { label: 'Connections', value: safeConnections.length.toString(), icon: Users, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Weekly Interactions', value: totalWeeklyInteractions.toString(), trend: '+0%', trendText: 'vs last week', icon: MessageSquare, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Gratitude Diary', value: safeGratitude.length.toString(), trend: '+0%', trendText: 'vs last week', icon: Heart, bgColor: '#fff1f2', iconColor: '#e11d48' },
    ];

    if (loading && safeConnections.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 rounded-xl bg-[#e11d48] text-white flex items-center justify-center shadow-lg shadow-rose-100">
                        <Users size={22} />
                    </div>
                    <div>
                        <h1 className="text-[2rem] font-bold text-[#0f172a] tracking-tight">Relationships</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight opacity-70">Nurture your connections and social wellbeing</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#e11d48] hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-rose-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Add Connection</span>
                </button>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Wellness Gauge */}
                <div className="bg-white rounded-[2rem] p-8 border border-black/[0.08] shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-8 self-start ml-2">Relationship Wellness</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={Math.round(wellnessScore)} />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2rem] p-8 flex flex-col justify-between relative border border-black/[0.08] shadow-sm transition-all hover:shadow-md cursor-default bg-[#fff1f2]">
                        <div className="flex justify-between items-start">
                            <span className="text-[15px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#e11d48] shadow-sm">
                                <stat.icon size={16} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-[2.2rem] font-bold text-[#0f172a] tracking-tight leading-none">{stat.value}</p>
                            {stat.trend && (
                                <div className="flex items-center gap-1.5 mt-3">
                                    <span className="text-[11px] font-black text-green-500">{stat.trend}</span>
                                    <span className="text-[11px] font-bold text-slate-400">{stat.trendText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Connection Grid */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Your Connections</h3>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-rose-500" /> Family
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Friends
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-amber-500" /> Work
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-pink-500" /> Favourites
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { id: 'family', label: 'Family', icon: Heart, color: '#f43f5e' },
                        { id: 'friend', label: 'Friends', icon: Users, color: '#3b82f6' },
                        { id: 'professional', label: 'Work', icon: MessageSquare, color: '#f59e0b' },
                        { id: 'favourite', label: 'Favourites', icon: Star, color: '#ec4899' }
                    ].map((cat) => {
                        const filtered = safeConnections.filter(c => (c?.type || 'friend').toLowerCase() === cat.id);
                        const Icon = cat.icon;

                        return (
                            <div key={cat.id} className="bg-white rounded-[2.5rem] p-8 border border-black/[0.05] shadow-sm flex flex-col min-h-[500px] transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                                        <Icon size={18} fill={cat.id === 'family' || cat.id === 'favourite' ? 'white' : 'none'} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f172a] text-[15px]">{cat.label}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">
                                            {filtered.length} {filtered.length === 1 ? 'Person' : 'People'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                    {filtered.length > 0 ? filtered.map((conn, idx) => (
                                        <div key={idx} className="group p-5 rounded-[1.8rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100 transition-all duration-300 relative">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-xl border border-slate-50">
                                                    {conn.avatar || (cat.id === 'family' ? '🏠' : cat.id === 'friend' ? '😊' : cat.id === 'professional' ? '💼' : '⭐')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-bold text-[#0f172a] truncate">{conn.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                        {conn.lastInteraction ? `Active ${new Date(conn.lastInteraction).toLocaleDateString()}` : 'New Connection'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleQuickInteract(conn._id, 'call')}
                                                        className="w-8 h-8 flex items-center justify-center text-[#0f172a]/40 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Log Call"
                                                    >
                                                        <Phone size={15} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickInteract(conn._id, 'message')}
                                                        className="w-8 h-8 flex items-center justify-center text-[#0f172a]/40 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Log Message"
                                                    >
                                                        <MessageSquare size={15} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => deleteRelationship(conn._id)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center py-10 opacity-30">
                                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
                                                <Plus size={20} className="text-slate-300" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">No {cat.label} yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddConnectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (data) => {
                    try {
                        await socialAPI.createRelationship(data);
                        await fetchConnections();
                        if (onUpdate) onUpdate();
                        setIsModalOpen(false);
                    } catch (err) {
                        console.error('Save failed', err);
                    }
                }}
            />
        </div>
    );
}
