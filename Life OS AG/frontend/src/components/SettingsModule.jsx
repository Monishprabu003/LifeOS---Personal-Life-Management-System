import { useState } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Download,
    Trash2,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../api';

export function SettingsModule() {
    const [settings, setSettings] = useState({
        dailyReminders: true,
        weeklyReview: true,
        streakAlerts: true
    });

    const [passwords, setPasswords] = useState({
        current: '********',
        newPassword: '********'
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        // Simulate API call as per design mockup focus
        setTimeout(() => {
            setIsUpdatingPassword(false);
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
        }, 1000);
    };

    const Toggle = ({ active, onToggle }) => (
        <button
            onClick={onToggle}
            className={`w-[52px] h-[31px] rounded-full transition-all duration-300 relative ${active ? 'bg-[#10b981]' : 'bg-slate-200'}`}
        >
            <motion.div
                animate={{ x: active ? 24 : 4 }}
                className="w-[23px] h-[23px] bg-white rounded-full absolute top-[4px] shadow-sm"
            />
        </button>
    );

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#0f172a]">
                        <SettingsIcon size={28} />
                    </div>
                    <h1 className="text-[2.8rem] font-bold text-[#0f172a] tracking-tight leading-none">Settings</h1>
                </div>
                <p className="text-slate-500 font-bold text-[17px] ml-1">Manage your preferences and account</p>
            </div>

            <div className="space-y-8">
                {/* Notifications Section */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-black/[0.08] shadow-sm transition-all duration-500">
                    <div className="flex items-center gap-4 mb-12">
                        <Bell size={24} className="text-[#0f172a]" strokeWidth={2.5} />
                        <h3 className="text-[22px] font-bold text-[#0f172a]">Notifications</h3>
                    </div>

                    <div className="space-y-0">
                        {[
                            { id: 'dailyReminders', label: 'Daily Reminders', desc: 'Get reminded to log your daily data' },
                            { id: 'weeklyReview', label: 'Weekly Review', desc: 'Receive AI insights every Sunday' },
                            { id: 'streakAlerts', label: 'Streak Alerts', desc: 'Get notified when streaks are at risk' }
                        ].map((item, idx, arr) => (
                            <div key={item.id}>
                                <div className="flex items-center justify-between py-8 transition-colors">
                                    <div className="space-y-1.5">
                                        <p className="text-[17px] font-bold text-[#0f172a]">{item.label}</p>
                                        <p className="text-[15px] text-slate-400 font-bold">{item.desc}</p>
                                    </div>
                                    <Toggle
                                        active={settings[item.id]}
                                        onToggle={() => handleToggle(item.id)}
                                    />
                                </div>
                                {idx < arr.length - 1 && <div className="h-[1px] bg-slate-50 w-full" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-black/[0.08] shadow-sm transition-all duration-500">
                    <div className="flex items-center gap-4 mb-12">
                        <Lock size={24} className="text-[#0f172a]" strokeWidth={2.5} />
                        <h3 className="text-[22px] font-bold text-[#0f172a]">Security</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[15px] font-bold text-[#0f172a] ml-1">Current Password</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl p-6 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#10b981]/10 transition-all font-bold text-slate-600"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[15px] font-bold text-[#0f172a] ml-1">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl p-6 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#10b981]/10 transition-all font-bold text-slate-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="bg-white border border-slate-200 text-[#0f172a] px-10 py-5 rounded-2xl text-[15px] font-bold hover:bg-slate-50 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 shadow-sm mt-4"
                        >
                            {isUpdatingPassword ? <Loader2 size={18} className="animate-spin text-[#10b981]" /> : null}
                            <span>Update Password</span>
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-red-100/60 shadow-sm transition-all duration-500">
                    <h3 className="text-[22px] font-bold text-[#f43f5e] mb-12">Danger Zone</h3>

                    <div className="space-y-0">
                        {/* Export row */}
                        <div className="flex items-center justify-between py-8">
                            <div className="space-y-1.5">
                                <p className="text-[17px] font-bold text-[#0f172a]">Export Data</p>
                                <p className="text-[15px] text-slate-400 font-bold">Download all your data as JSON</p>
                            </div>
                            <button className="bg-[#f8fafc] border border-slate-100 text-[#0f172a] px-10 py-4 rounded-xl text-[15px] font-bold hover:bg-slate-100 transition-all active:scale-95">
                                Export
                            </button>
                        </div>

                        <div className="h-[1px] bg-slate-50 w-full" />

                        {/* Delete row */}
                        <div className="flex items-center justify-between py-8">
                            <div className="space-y-1.5">
                                <p className="text-[17px] font-bold text-[#0f172a]">Delete Account</p>
                                <p className="text-[15px] text-slate-400 font-bold">Permanently delete your account and data</p>
                            </div>
                            <button className="bg-[#ef4444] text-white px-10 py-4 rounded-xl text-[15px] font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100/50">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
