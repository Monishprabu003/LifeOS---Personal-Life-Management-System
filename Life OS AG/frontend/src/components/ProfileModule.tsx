import { User, Mail, Camera } from 'lucide-react';

export function ProfileModule({ user }: { user: any }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-[#10b981] flex items-center justify-center text-white shadow-lg">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Your Profile</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your personal information</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-8 mb-12">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-slate-300" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-3 bg-[#10b981] text-white rounded-2xl shadow-lg transform translate-x-2 translate-y-2 hover:scale-110 transition-transform">
                            <Camera size={18} />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white">{user?.name || 'John Doe'}</h2>
                        <p className="text-slate-500 font-medium">LifeOS Explorer</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                        <div className="flex items-center space-x-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus-within:border-[#10b981]/20 transition-all">
                            <User size={20} className="text-slate-400" />
                            <input
                                type="text"
                                defaultValue={user?.name}
                                className="bg-transparent border-none outline-none font-bold text-[#0f172a] dark:text-white w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="flex items-center space-x-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus-within:border-[#10b981]/20 transition-all opacity-70">
                            <Mail size={20} className="text-slate-400" />
                            <input
                                type="email"
                                defaultValue={user?.email}
                                disabled
                                className="bg-transparent border-none outline-none font-bold text-[#0f172a] dark:text-white w-full cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <button className="bg-[#10b981] hover:bg-[#0da271] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-100">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
