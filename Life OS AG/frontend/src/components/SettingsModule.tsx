import { Settings, Bell, Moon, Shield, Globe } from 'lucide-react';

export function SettingsModule() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-[#64748b] flex items-center justify-center text-white shadow-lg">
                    <Settings size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure your LifeOS experience</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">System Preferences</h3>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <Moon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] dark:text-white">Appearance</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Manage dark mode and theme colors</p>
                                </div>
                            </div>
                            <div className="w-14 h-8 bg-[#10b981] rounded-full relative p-1 flex items-center justify-end">
                                <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] dark:text-white">Notifications</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Configure alerts and daily reminders</p>
                                </div>
                            </div>
                            <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full relative p-1 flex items-center">
                                <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Data & Privacy</h3>

                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-all text-left">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-2xl">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] dark:text-white">Security</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Two-factor authentication and passwords</p>
                                </div>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-red-50/50 dark:bg-red-500/10 hover:bg-red-100/50 transition-all text-left group">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-600 dark:text-red-400">Export All Data</h4>
                                    <p className="text-xs text-red-400/80 font-medium mt-1">Download a JSON copy of your LifeOS records</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
