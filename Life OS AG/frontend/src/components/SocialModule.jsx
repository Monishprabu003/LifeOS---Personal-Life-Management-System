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

const CircularProgress = ({ value }) => {
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
                        stroke="#e11d48"
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
            <p className="mt-8 text-[13px] font-bold text-slate-400 tracking-tight">Strong connections this week</p>
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

    // Calculate dynamic stats
    const wellnessScore = connections.length > 0
        ? Math.min(100, connections.reduce((acc, c) => acc + (c.lastInteraction ? 100 : 20), 0) / connections.length)
        : 0;

    const stats = [
        { label: 'Connections', value: connections.length.toString() || '24', icon: Users, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Interactions This Week', value: (connections.filter(c => c.lastInteraction && new Date(c.lastInteraction) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 12).toString(), trend: '+20%', trendText: 'vs last week', icon: MessageSquare, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Gratitude Entries', value: (gratitudeEntries.length || 8).toString(), trend: '+15%', trendText: 'vs last week', icon: Heart, bgColor: '#fff1f2', iconColor: '#e11d48' },
    ];

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
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-8 self-start ml-2">Relationship Wellness</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={Math.round(wellnessScore) || 88} />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2rem] p-8 flex flex-col justify-between relative border border-rose-50/50 shadow-sm transition-all hover:shadow-md cursor-default bg-[#fff1f2]">
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
                <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[17px] font-bold text-[#0f172a]">Your Connections</h3>
                    </div>
                    <div className="space-y-4">
                        {(connections.length > 0 ? connections : [
                            { name: 'Mom', lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), avatar: '👩' },
                            { name: 'Best Friend - Sarah', lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000), avatar: '👭' },
                            { name: 'Dad', lastInteraction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), avatar: '👨' },
                            { name: 'Brother - Mike', lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), avatar: '👦' }
                        ]).map((conn, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-[#f8fafc]/50 rounded-2xl transition-all hover:bg-slate-100/80 group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-[#fff1f2] flex items-center justify-center text-2xl">
                                        {conn.avatar || '👤'}
                                    </div>
                                    <div>
                                        <p className="text-[16px] font-bold text-[#0f172a] tracking-tight">{conn.name}</p>
                                        <p className="text-[12px] font-medium text-slate-400 tracking-tight flex items-center gap-1">
                                            <span>🕒</span> {
                                                idx === 0 ? '2 days ago' :
                                                    idx === 1 ? 'Yesterday' :
                                                        idx === 2 ? '5 days ago' :
                                                            '1 week ago'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-2.5 text-[#e11d48] hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                                        <Phone size={18} strokeWidth={2.5} />
                                    </button>
                                    <button className="p-2.5 text-[#e11d48] hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                                        <MessageCircle size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connection Tasks */}
                <div className="lg:col-span-5 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[17px] font-bold text-[#0f172a]">Connection Tasks</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Call Mom', relative: 'Today' },
                            { title: 'Text Dad about weekend plans', relative: 'Tomorrow' },
                            { title: 'Send birthday wishes to colleague', relative: 'In 3 days' }
                        ].map((task, idx) => (
                            <div key={idx} className="flex items-center gap-5 p-5 bg-[#f8fafc]/50 rounded-2xl transition-all hover:bg-slate-100/80 group">
                                <div className="w-6 h-6 rounded-lg border-2 border-slate-300 bg-white flex items-center justify-center transition-all cursor-pointer group-hover:border-[#e11d48] shadow-sm">
                                </div>
                                <div>
                                    <p className="text-[16px] font-bold text-[#0f172a] tracking-tight leading-none">{task.title}</p>
                                    <p className="text-[12px] font-medium text-slate-400 mt-2">{task.relative}</p>
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
