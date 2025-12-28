import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Heart,
    Wallet,
    Zap,
    Smile,
    Frown,
    Meh,
    Laugh,
    Activity,
    DollarSign,
    CheckCircle2,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { healthAPI, financeAPI, kernelAPI } from '../api';

interface UnifiedLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UnifiedLogModal({ isOpen, onClose, onSuccess }: UnifiedLogModalProps) {
    const [activeTab, setActiveTab] = useState('health');
    const [loading, setLoading] = useState(false);

    // Health States
    const [sleepDuration, setSleepDuration] = useState(7.5);
    const [sleepQuality] = useState(8);
    const [waterIntake, setWaterIntake] = useState(2.1);
    const [stressLevel, setStressLevel] = useState(3);
    const [mood, setMood] = useState(3);

    // Wealth States
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // System States
    const [eventTitle, setEventTitle] = useState('');
    const [eventImpact, setEventImpact] = useState('positive');

    const handleSave = async () => {
        setLoading(true);
        try {
            if (activeTab === 'health') {
                await healthAPI.createLog({
                    sleepDuration,
                    sleepQuality,
                    waterIntake,
                    stressLevel,
                    mood,
                    notes: `Daily Sync`
                });
            } else if (activeTab === 'wealth') {
                await financeAPI.createTransaction({
                    type: transactionType,
                    amount: parseFloat(amount),
                    category: category || 'General',
                    description: description
                });
            } else {
                await kernelAPI.logGenericEvent({
                    type: 'system_log',
                    title: eventTitle,
                    impact: eventImpact as 'positive' | 'negative',
                    value: 0,
                    description: description
                });
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to log event:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setCategory('');
        setDescription('');
        setEventTitle('');
    };

    const emojis = [
        { icon: Frown, label: 'Poor' },
        { icon: Meh, label: 'Okay' },
        { icon: Smile, label: 'Good' },
        { icon: Laugh, label: 'Great' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-10">
                    <h2 className="text-2xl font-display font-bold text-[#0f172a] dark:text-white mb-8">Log Life Event</h2>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-10">
                        {[
                            { id: 'health', name: 'Health', icon: Heart, color: 'text-rose-500' },
                            { id: 'wealth', name: 'Wealth', icon: Wallet, color: 'text-blue-500' },
                            { id: 'system', name: 'System', icon: Zap, color: 'text-[#10b981]' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 shadow-md text-[#0f172a] dark:text-white'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <tab.icon size={14} className={activeTab === tab.id ? tab.color : ''} />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                        {activeTab === 'health' && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Sleep Duration: {sleepDuration}h</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="12" step="0.5"
                                        value={sleepDuration}
                                        onChange={(e) => setSleepDuration(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Water Intake: {waterIntake}L</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="5" step="0.1"
                                        value={waterIntake}
                                        onChange={(e) => setWaterIntake(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Stress Level: {stressLevel}/10</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10" step="1"
                                        value={stressLevel}
                                        onChange={(e) => setStressLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Daily Mood</p>
                                    <div className="flex justify-between">
                                        {emojis.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setMood(idx)}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${mood === idx
                                                    ? 'bg-rose-50 dark:bg-rose-500/10 ring-2 ring-rose-500 text-rose-500'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                                    }`}
                                            >
                                                <emoji.icon size={24} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wealth' && (
                            <div className="space-y-8">
                                <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-2xl">
                                    <button
                                        onClick={() => setTransactionType('expense')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${transactionType === 'expense' ? 'bg-white dark:bg-slate-800 shadow-sm text-rose-500' : 'text-slate-400'}`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        onClick={() => setTransactionType('income')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${transactionType === 'income' ? 'bg-white dark:bg-slate-800 shadow-sm text-[#10b981]' : 'text-slate-400'}`}
                                    >
                                        Income
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-5 pl-12 text-[#0f172a] dark:text-white font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="What was this for?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-5 text-[#0f172a] dark:text-white font-medium outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Event Name</label>
                                    <input
                                        type="text"
                                        placeholder="Identify life event..."
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-5 text-[#0f172a] dark:text-white font-bold outline-none"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Impact</p>
                                    <div className="flex space-x-4">
                                        {[
                                            { id: 'positive', icon: TrendingUp, color: 'text-[#10b981]', bg: 'bg-green-50' },
                                            { id: 'negative', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50' }
                                        ].map((imp) => (
                                            <button
                                                key={imp.id}
                                                onClick={() => setEventImpact(imp.id)}
                                                className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl border-2 transition-all ${eventImpact === imp.id
                                                    ? `border-current ${imp.color} ${imp.bg} dark:bg-transparent`
                                                    : 'border-slate-100 dark:border-slate-800 text-slate-400'
                                                    }`}
                                            >
                                                <imp.icon size={20} />
                                                <span className="text-xs font-bold uppercase">{imp.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Details</label>
                                    <textarea
                                        placeholder="Record additional context..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-5 text-[#0f172a] dark:text-white font-medium outline-none h-32 resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full mt-10 bg-[#10b981] hover:bg-[#0da271] text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-green-100 dark:shadow-none transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Activity className="animate-spin" size={20} />
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                <span>Save Entry</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
