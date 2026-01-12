import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Phone,
    MessageCircle,
    Heart,
    MessageSquare,
    MoreVertical
} from 'lucide-react';
import { AddConnectionModal } from './AddConnectionModal';
import { socialAPI, kernelAPI } from '../api';

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
                        stroke="#f43f5e"
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

export function SocialModule({ onUpdate, user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [connections, setConnections] = useState([]);
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const res = await socialAPI.getRelationships();
            setConnections(res.data);
        } catch (err) {
            console.error('Failed to fetch connections', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGratitude = async () => {
        try {
            const res = await kernelAPI.getEvents();
            const entries = res.data.filter((e) => e.type === 'emotional_event' || e.title.includes('Gratitude'));
            setGratitudeEntries(entries);
        } catch (err) {
            console.error('Failed to fetch gratitude', err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchGratitude();
    }, [user]);

    // Data matching the mockup exactly
    const mockConnections = [
        { name: 'Mom', lastSeen: '2 days ago', avatar: '👩' },
        { name: 'Best Friend - Sarah', lastSeen: 'Yesterday', avatar: '👭' },
        { name: 'Dad', lastSeen: '5 days ago', avatar: '👨' },
        { name: 'Brother - Mike', lastSeen: '1 week ago', avatar: '👦' },
    ];

    const mockTasks = [
        { title: 'Call Mom', due: 'Today', completed: false },
        { title: 'Text Dad about weekend plans', due: 'Tomorrow', completed: false },
        { title: 'Send birthday wishes to colleague', due: 'In 3 days', completed: false },
    ];

    const stats = [
        { label: 'Connections', value: '24', icon: Users, bgColor: '#fff1f2', iconColor: '#f43f5e' },
        { label: 'Interactions This Week', value: '12', trend: '+20%', trendText: 'vs last week', icon: MessageSquare, bgColor: '#fff1f2', iconColor: '#f43f5e' },
        { label: 'Gratitude Entries', value: '8', trend: '+15%', trendText: 'vs last week', icon: Heart, bgColor: '#fff1f2', iconColor: '#f43f5e' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-100">
                        <Users size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Relationships</h1>
                        <p className="text-slate-400 font-semibold text-sm mt-0.5">Nurture your connections and social wellbeing</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f43f5e] hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-rose-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Add Connection</span>
                </button>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Wellness Gauge */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 self-start">Relationship Wellness</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={88} label="Strong connections this week" />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden border border-slate-50/50 shadow-sm transition-all hover:shadow-md cursor-default" style={{ backgroundColor: stat.bgColor }}>
                        <div className="flex justify-between items-start">
                            <span className="text-[14px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="p-2 rounded-xl bg-white shadow-sm">
                                <stat.icon size={18} className="text-[#f43f5e]" />
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

            {/* Bottom Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Connections List */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Your Connections</h3>
                    </div>
                    <div className="space-y-4">
                        {mockConnections.map((conn, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                                        {conn.avatar}
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-bold text-[#0f172a] tracking-tight">{conn.name}</p>
                                        <p className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-1">
                                            <span className="opacity-50">🕒</span> {conn.lastSeen}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 text-rose-400 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                                        <Phone size={18} strokeWidth={2.5} />
                                    </button>
                                    <button className="p-2.5 text-rose-400 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                                        <MessageCircle size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connection Tasks */}
                <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Connection Tasks</h3>
                    </div>
                    <div className="space-y-4">
                        {mockTasks.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-5 p-5 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group">
                                <div className="w-6 h-6 rounded-lg border-2 border-slate-200 bg-white flex items-center justify-center transition-all cursor-pointer group-hover:border-rose-300 shadow-sm">
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-[#0f172a] tracking-tight leading-none">{task.title}</p>
                                    <p className="text-[11px] font-bold text-slate-400 mt-2">{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddConnectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (data) => {
                    await socialAPI.createRelationship(data);
                    fetchConnections();
                    if (onUpdate) onUpdate();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
