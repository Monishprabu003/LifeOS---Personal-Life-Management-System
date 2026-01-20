import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Camera,
    Award,
    Award as Trophy,
    Calendar,
    Star,
    Zap,
    CheckCircle2,
    Rocket,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../api';

export function ProfileModule({ user, totalEvents = 0, habits = [], goals = [], onUpdate, isDarkMode }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            const [first, ...rest] = (user.name || '').split(' ');
            setFormData({
                firstName: first || '',
                lastName: rest.join(' ') || '',
                email: user.email || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await userAPI.updateProfile({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                bio: formData.bio,
                email: formData.email // Note: Usually email change involves more security, but following current schema
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            if (onUpdate) await onUpdate();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    // Real Data Calculations
    const baseXP = (totalEvents * 100) + (Math.round(user?.lifeScore || 0) * 10);
    const xp = baseXP;
    const level = Math.floor(xp / 1000) + 1;
    const progress = ((xp % 1000) / 1000) * 100;

    const getRank = (score) => {
        if (score >= 90) return 'S';
        if (score >= 80) return 'A+';
        if (score >= 70) return 'A';
        if (score >= 50) return 'B';
        if (score >= 30) return 'C';
        return 'D';
    };

    const rank = getRank(user?.lifeScore || 0);
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Jan 2026';

    // Achievement Logic
    const achievements = [
        {
            id: 1,
            name: 'Pioneer',
            desc: 'Reach Level 2 by logging activity',
            icon: Rocket,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            active: level >= 2
        },
        {
            id: 2,
            name: 'Consistency King',
            desc: 'Maintain a habit streak of 3 or more',
            icon: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            active: habits.some(h => h.streak >= 3)
        },
        {
            id: 3,
            name: 'Elite Status',
            desc: 'Achieve an A+ Rank or higher',
            icon: Star,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            active: user?.lifeScore >= 80
        },
        {
            id: 4,
            name: 'Mission Clear',
            desc: 'Successfully complete a major goal',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            active: goals.some(g => g.progress === 100)
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#0f172a] shadow-sm border border-slate-100">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-display font-bold text-[#0f172a] leading-tight">Profile</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your profile and view achievements</p>
                </div>
            </div>

            {/* Profile Information Card - Redesigned for Premium Look */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group"
            >
                {/* 1. Ultra-Premium Animated Banner */}
                <div className="h-48 relative overflow-hidden">
                    {/* Primary Mesh Gradient */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#ecfdf5_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#eff6ff_0%,transparent_50%),radial-gradient(circle_at_50%_50%,#f5f3ff_0%,transparent_70%)]"
                    />

                    {/* Glassmorphic Overlay Layer */}
                    <div className="absolute inset-0 backdrop-blur-[100px] bg-white/40" />

                    {/* Animated Particles/Orbs */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-10 left-1/4 w-24 h-24 bg-[#10b981]/10 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-10 right-1/4 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-3xl"
                    />
                </div>

                {/* 2. Floating Avatar Section */}
                <div className="relative px-12 pb-12">
                    <div className="flex flex-col items-center -mt-24 text-center">
                        <div className="relative group/avatar">
                            {/* Outer Glow Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -inset-4 bg-gradient-to-tr from-[#10b981] via-[#3b82f6] to-[#8b5cf6] rounded-full blur-xl opacity-50 transition-opacity group-hover/avatar:opacity-100"
                            />

                            {/* Avatar Container */}
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative w-40 h-40 rounded-full bg-white border-[6px] border-white flex items-center justify-center text-5xl font-display font-black text-[#0f172a] shadow-2xl z-20 overflow-hidden"
                            >
                                {/* Initials with subtle gradient */}
                                <span className="bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-500">
                                    {user?.name?.split(' ').map((n) => n[0]).join('') || 'JD'}
                                </span>

                                {/* Shimmer Effect */}
                                <motion.div
                                    animate={{ left: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                />
                            </motion.div>

                            {/* Camera Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-2 right-2 p-3 bg-white text-[#10b981] rounded-2xl shadow-xl border-2 border-slate-50 z-30 transition-colors hover:text-[#3b82f6]"
                            >
                                <Camera size={20} />
                            </motion.button>
                        </div>

                        {/* 3. User Identity */}
                        <div className="mt-8 space-y-2">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-4xl font-display font-bold text-[#0f172a] tracking-tight"
                            >
                                {user?.name || 'Human 001'}
                            </motion.h2>
                            <div className="flex items-center justify-center space-x-2 text-slate-500 font-medium bg-slate-100 px-4 py-1.5 rounded-full">
                                <Mail size={14} />
                                <span className="text-sm italic">{user?.email || 'demo@lifeos.com'}</span>
                            </div>
                        </div>

                        {/* 4. Glass Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mt-12 bg-slate-50/50 p-2 rounded-[2.5rem] border border-slate-100">
                            {[
                                { label: 'Level', value: level.toString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { label: 'Rank', value: rank, icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Joined', value: joinedDate, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all bg-white"
                                >
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-3 shadow-inner`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-2xl font-bold text-[#0f172a]">{stat.value}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* 5. High-Fidelity Experience Track */}
                        <div className="w-full max-w-2xl mt-12 bg-white/60 p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                            <div className="flex justify-between items-end mb-6">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#10b981]">Core Experience</h4>
                                    <p className="text-2xl font-display font-bold text-[#0f172a]">Path to Greatness</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-[#0f172a] leading-none">{xp % 1000}</span>
                                    <span className="text-sm font-bold text-slate-400 ml-1">/ 1000 XP</span>
                                </div>
                            </div>

                            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                {/* Glowing Progress Fill */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="relative h-full bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] rounded-full"
                                >
                                    {/* Animated Glow overlay */}
                                    <motion.div
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                                    />
                                </motion.div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Award size={14} className="text-amber-500" />
                                    <span className="text-xs font-bold text-slate-500">{1000 - (xp % 1000)} XP to Level {level + 1}</span>
                                </div>
                                <div className="text-xs font-black uppercase tracking-widest text-slate-300 self-center">
                                    Efficiency: {user?.lifeScore?.toFixed(1) || '0.0'}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Edit Profile */}
                <div className="lg:col-span-7 space-y-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 bg-white border-slate-100 shadow-sm transition-all duration-500"
                    >
                        <h3 className="text-xl font-bold text-[#0f172a] mb-8">Edit Profile</h3>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
                                <textarea
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all resize-none"
                                />
                            </div>

                            {message.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {message.text}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-[#10b981] hover:bg-[#0da271] disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-50 flex items-center justify-center space-x-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Right: Achievements */}
                <div className="lg:col-span-5 space-y-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 bg-white border-slate-100 shadow-sm transition-all duration-500 h-full"
                    >
                        <div className="flex items-center space-x-3 mb-8">
                            <Award className="text-amber-500" size={20} />
                            <h3 className="text-lg font-bold text-[#0f172a]">Achievements</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {achievements.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-center space-x-4 p-5 rounded-3xl border transition-all ${item.active
                                            ? 'bg-amber-50/30 border-amber-100 shadow-sm'
                                            : 'bg-slate-50 border-transparent'}`}
                                    >
                                        <div className={`p-4 rounded-2xl ${item.bg.split(' ')[0]} ${item.color}`}>
                                            <Icon size={24} className={item.active ? 'animate-pulse' : ''} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`font-bold text-sm ${item.active ? 'text-[#0f172a]' : 'text-slate-400'}`}>{item.name}</h4>
                                            <p className={`text-[10px] sm:text-xs font-medium mt-1 leading-relaxed ${item.active ? 'text-slate-500' : 'text-slate-400/60'}`}>{item.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

