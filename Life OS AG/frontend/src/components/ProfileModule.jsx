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
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0f172a] shadow-sm border border-slate-100">
                    <User size={24} />
                </div>
                <div>
                    <h1 className="text-[2rem] font-bold text-[#0f172a] tracking-tight">Profile</h1>
                    <p className="text-slate-400 font-bold text-sm tracking-tight opacity-70">Manage your profile and view achievements</p>
                </div>
            </div>

            {/* Profile Information Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-black/[0.08] shadow-sm overflow-hidden"
            >
                {/* Gradient Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-600" />

                <div className="px-10 pb-10">
                    <div className="flex items-end -mt-12 space-x-8 mb-10">
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full bg-white border-4 border-white flex items-center justify-center text-4xl font-bold text-[#0f172a] shadow-lg overflow-hidden">
                                {user?.name?.split(' ').map((n) => n[0]).join('') || 'JD'}
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-[#10b981] text-white rounded-full shadow-lg border-2 border-white hover:bg-emerald-600 transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="pb-2 space-y-1">
                            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">{user?.name || 'John Doe'}</h2>
                            <p className="text-slate-400 font-medium">{user?.email || 'john.doe@example.com'}</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Award size={14} className="text-amber-500 mr-1.5" />
                                    Level {level}
                                </span>
                                <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Calendar size={14} className="text-blue-500 mr-1.5" />
                                    Joined {joinedDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress Section */}
                    <div className="bg-[#fdf6e9]/50 border border-slate-50 p-8 rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-[#0f172a]">Experience Points</h4>
                            <span className="text-sm font-bold text-slate-400">{xp % 1000} / 1000 XP</span>
                        </div>
                        <div className="relative h-6 w-full bg-[#f3e8d6] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-[#10b981] rounded-full"
                            />
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-3">{1000 - (xp % 1000)} XP to Level {level + 1}</p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-10">
                {/* Edit Profile */}
                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-10">Edit Profile</h3>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-[#0f172a] ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[15px] font-medium text-[#0f172a] focus:ring-2 focus:ring-[#10b981]/20 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-[#0f172a] ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[15px] font-medium text-[#0f172a] focus:ring-2 focus:ring-[#10b981]/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-[#0f172a] ml-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[15px] font-medium text-[#0f172a] focus:ring-2 focus:ring-[#10b981]/20 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-[#0f172a] ml-1">Bio</label>
                            <textarea
                                placeholder="Tell us about yourself..."
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[15px] font-medium text-[#0f172a] focus:ring-2 focus:ring-[#10b981]/20 transition-all outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#10b981] hover:bg-emerald-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-[15px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-10">
                        <Award className="text-amber-500" size={22} />
                        <h3 className="text-[17px] font-bold text-[#0f172a]">Achievements</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {achievements.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center space-x-5 p-6 rounded-2xl border transition-all ${item.active
                                        ? 'bg-[#fdf6e9]/50 border-amber-300'
                                        : 'bg-white border-slate-100 grayscale opacity-60'}`}
                                >
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0">
                                        {item.id === 1 && '🌅'}
                                        {item.id === 2 && '💰'}
                                        {item.id === 3 && '🏆'}
                                        {item.id === 4 && '💪'}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-[16px] text-[#0f172a]">{item.id === 1 ? 'Early Bird' : item.id === 2 ? 'Money Saver' : item.id === 3 ? 'Habit Master' : 'Wellness Warrior'}</h4>
                                        <p className="text-[13px] font-medium text-slate-400 mt-1">{item.id === 1 ? 'Complete morning routine 7 days in a row' : item.id === 2 ? 'Save 20% of income for 3 months' : item.id === 3 ? 'Maintain 5 habits for 30 days' : 'Achieve 90+ health score for a week'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

