import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    ArrowRight,
    Brain,
    Zap,
    Users,
    Activity,
    RefreshCw
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

export function AIInsightsModule({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    const radarData = React.useMemo(() => [
        { subject: 'Health', A: user?.healthScore || 0, fullMark: 100 },
        { subject: 'Wealth', A: user?.wealthScore || 0, fullMark: 100 },
        { subject: 'Relationships', A: user?.relationshipScore || 0, fullMark: 100 },
        { subject: 'Habits', A: user?.habitScore || 0, fullMark: 100 },
        { subject: 'Purpose', A: user?.goalScore || 0, fullMark: 100 },
    ], [user]);

    const lifeScore = user?.lifeScore || 0;
    const hasData = lifeScore > 0;

    const refreshAnalysis = async () => {
        setLoading(true);
        // Simulate API call or call real setup
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Realistic Dark Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-3xl animate-pulse" />
                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#0A0C14] border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl relative">
                            <Sparkles size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[34px] font-bold text-white leading-tight tracking-tight">AI Insights</h1>
                        <div className="flex items-center mt-2 space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-400">Neural Link Active</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={refreshAnalysis}
                    disabled={loading}
                    className="group flex items-center space-x-3 bg-blue-600 border border-blue-400/50 px-8 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-[0.98]"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    <span>Sync Intelligence</span>
                </button>
            </div>

            {/* Top Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Weekly Life Score Card */}
                <div className="lg:col-span-4 bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl flex flex-col items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-12 self-start relative">Matrix Score</h3>

                    <div className="relative flex items-center justify-center mb-10">
                        {/* Circular Progress */}
                        <div className="w-56 h-56 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 relative">
                                <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                                <motion.circle
                                    cx="100" cy="100" r="85" stroke="#3b82f6" strokeWidth="10" fill="transparent"
                                    strokeDasharray={534}
                                    initial={{ strokeDashoffset: 534 }}
                                    animate={{ strokeDashoffset: 534 - (534 * lifeScore) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-7xl font-bold text-white leading-none tracking-tighter">
                                    {lifeScore}
                                </span>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-4">Level</span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-[10px] relative transition-all ${hasData ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-white/20'
                        }`}>
                        {hasData ? <TrendingUp size={14} /> : <Activity size={14} />}
                        <span className="uppercase tracking-[0.2em]">{hasData ? '+8 Optimized' : 'Pending Intake'}</span>
                    </div>
                </div>

                {/* Radar Chart Card */}
                <div className="lg:col-span-8 bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-8 relative">Life Balance Radar</h3>
                    <div className="h-[340px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800, style: { textTransform: 'uppercase', letterSpacing: '0.2em' } }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Current Score"
                                    dataKey="A"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.1}
                                    strokeWidth={3}
                                    className="drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Neural Insights Section */}
            <div className="space-y-10">
                <div className="flex items-center space-x-4 pl-2">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <h2 className="text-[28px] font-bold text-white tracking-tight">Neural Analysis</h2>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sleep Insight */}
                        <div className="bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:text-blue-300 transition-colors">
                                    <Activity size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-bold text-[18px] text-white">Circadian Optimization</h4>
                            </div>
                            <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                                Biological systems reporting sub-optimal recovery. When you sleep 7+ hours, your habit completion rate increases by <span className="text-blue-400 font-black decoration-blue-400/30 underline underline-offset-8">23%</span>.
                            </p>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center space-x-4 text-[14px] font-bold text-blue-400/80 group-hover:text-blue-400 transition-colors">
                                <ArrowRight size={20} />
                                <span className="uppercase tracking-widest text-[11px]">Action: maintain 7-8 hours</span>
                            </div>
                        </div>

                        {/* Finance Insight */}
                        <div className="bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:text-blue-300 transition-colors">
                                    <TrendingUp size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-bold text-[18px] text-white">Capital Flow Analysis</h4>
                            </div>
                            <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                                Expenses increase by <span className="text-blue-400 font-black decoration-blue-400/30 underline underline-offset-8">40%</span> on cycles 6 & 7 (weekends). Optimization suggested for allocation balance.
                            </p>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center space-x-4 text-[14px] font-bold text-blue-400/80 group-hover:text-blue-400 transition-colors">
                                <ArrowRight size={20} />
                                <span className="uppercase tracking-widest text-[11px]">Action: Set weekend limits</span>
                            </div>
                        </div>

                        {/* Habits Insight */}
                        <div className="bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:text-blue-300 transition-colors">
                                    <Zap size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-bold text-[18px] text-white">Atomic Momentum</h4>
                            </div>
                            <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                                3 core habits maintained for 10+ cycles. This consistency is building positive momentum across all life modules.
                            </p>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center space-x-4 text-[14px] font-bold text-blue-400/80 group-hover:text-blue-400 transition-colors">
                                <ArrowRight size={20} />
                                <span className="uppercase tracking-widest text-[11px]">Status: Neural pathway active</span>
                            </div>
                        </div>

                        {/* Social Insight */}
                        <div className="bg-[#0A0C14] rounded-[2.5rem] p-10 border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:text-blue-300 transition-colors">
                                    <Users size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-bold text-[18px] text-white">Relationship Integrity</h4>
                            </div>
                            <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                                Relationship Integrity score trending low on 'Family' nodes. Regular contact correlates with higher mood scores.
                            </p>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center space-x-4 text-[14px] font-bold text-blue-400/80 group-hover:text-blue-400 transition-colors">
                                <ArrowRight size={20} />
                                <span className="uppercase tracking-widest text-[11px]">Action: Initiate connection</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#0A0C14] rounded-[2.5rem] p-24 border border-white/5 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-blue-400/20 relative">
                            <Brain size={48} className="animate-pulse" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-6 tracking-tight relative">Aggregating Matrix</h3>
                        <p className="text-white/30 max-w-md mx-auto leading-relaxed font-bold uppercase tracking-[0.3em] text-[10px] relative">
                            Neural pathways will form as biological data intake increases.
                            Maintain logging protocols to enable analysis.
                        </p>
                        <div className="mt-12 flex items-center justify-center space-x-6 relative">
                            <div className="text-blue-400/40 text-[10px] font-black uppercase tracking-[0.4em]">
                                Level 0 Intake
                            </div>
                            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: "5%" }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
