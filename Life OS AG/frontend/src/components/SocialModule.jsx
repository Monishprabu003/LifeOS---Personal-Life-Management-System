import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Phone,
    MessageCircle,
    Heart,
    MessageSquare,
    MoreVertical,
    Trash2,
    Star
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
            // Ensure we always have an array
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

    const wellnessScore = safeConnections.length > 0
        ? Math.min(100, safeConnections.reduce((acc, c) => acc + (c?.lastInteraction ? 100 : 20), 0) / safeConnections.length)
        : 0;

    const recentInteractionsCount = safeConnections.filter(c => {
        if (!c?.lastInteraction) return false;
        try {
            const lastDate = new Date(c.lastInteraction);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastDate > weekAgo;
        } catch {
            return false;
        }
    }).length;

    const stats = [
        { label: 'Connections', value: safeConnections.length.toString(), icon: Users, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Interactions This Week', value: recentInteractionsCount.toString(), trend: '+0%', trendText: 'vs last week', icon: MessageSquare, bgColor: '#fff1f2', iconColor: '#e11d48' },
        { label: 'Gratitude Entries', value: safeGratitude.length.toString(), trend: '+0%', trendText: 'vs last week', icon: Heart, bgColor: '#fff1f2', iconColor: '#e11d48' },
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

            {/* Metric Cards - Simplified */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-black/[0.08] shadow-sm">
                    <p className="text-sm font-bold text-slate-500">Connections</p>
                    <p className="text-3xl font-bold mt-2">{safeConnections.length}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-black/[0.08] shadow-sm">
                    <p className="text-sm font-bold text-slate-500">Interactions</p>
                    <p className="text-3xl font-bold mt-2">{recentInteractionsCount}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-black/[0.08] shadow-sm">
                    <p className="text-sm font-bold text-slate-500">Gratitude</p>
                    <p className="text-3xl font-bold mt-2">{safeGratitude.length}</p>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { id: 'family', label: 'Family', color: '#f43f5e' },
                    { id: 'friend', label: 'Friends', color: '#3b82f6' },
                    { id: 'professional', label: 'Work', color: '#f59e0b' },
                    { id: 'favourite', label: 'Favourites', color: '#ec4899' }
                ].map((cat) => {
                    const filtered = safeConnections.filter(c => (c?.type || 'friend').toLowerCase() === cat.id);
                    return (
                        <div key={cat.id} className="bg-white rounded-[2.5rem] p-8 border border-black/[0.05] shadow-sm flex flex-col min-h-[400px]">
                            <h4 className="font-bold text-[#0f172a] mb-4">{cat.label}</h4>
                            <div className="space-y-3">
                                {filtered.length > 0 ? filtered.map((conn, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                        <span className="text-sm font-bold">{conn.name}</span>
                                        <button onClick={() => deleteRelationship(conn._id)} className="text-rose-500"><Trash2 size={14} /></button>
                                    </div>
                                )) : (
                                    <p className="text-xs text-slate-400">Empty</p>
                                )}
                            </div>
                        </div>
                    );
                })}
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
