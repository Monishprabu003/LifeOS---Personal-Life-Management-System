import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Phone,
    MessageCircle,
    Heart,
    Calendar,
    CheckCircle2,
    MessageSquare
} from 'lucide-react';
import { AddConnectionModal } from './AddConnectionModal';

const connections = [
    { id: 1, name: 'Mom', lastContact: '2 days ago', avatar: '👩‍🦳' },
    { id: 2, name: 'Best Friend - Sarah', lastContact: 'Yesterday', avatar: '👯‍♀️' },
    { id: 3, name: 'Dad', lastContact: '5 days ago', avatar: '👴' },
    { id: 4, name: 'Brother - Mike', lastContact: '1 week ago', avatar: '👦' },
];

const tasks = [
    { id: 1, title: 'Call Mom', due: 'Today', completed: false },
    { id: 2, title: 'Text Dad about weekend plans', due: 'Tomorrow', completed: false },
    { id: 3, title: 'Send birthday wishes to colleague', due: 'In 3 days', completed: false },
];

const gratitudeEntries = [
    { id: 1, text: 'Grateful for the supportive call with Sarah today', date: 'Today' },
    { id: 2, text: "Mom's surprise visit made my week", date: 'Yesterday' },
    { id: 3, text: 'Coffee with colleagues was refreshing', date: '2 days ago' },
];

const CircularProgress = ({ value, label }: { value: number; label: string }) => {
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f43f5e"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-[#0f172a] dark:text-white">{value}</span>
                </div>
            </div>
            {label && <p className="mt-4 text-xs font-bold text-slate-400 text-center">{label}</p>}
        </div>
    );
};

export function SocialModule({ onUpdate }: { onUpdate?: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gratitudeText, setGratitudeText] = useState('');

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#f43f5e] flex items-center justify-center text-white shadow-lg shadow-rose-100">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Relationships</h1>
                        <p className="text-slate-500 font-medium mt-1">Nurture your connections and social wellbeing</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-rose-100 dark:shadow-none"
                >
                    <Plus size={20} />
                    <span>Add Connection</span>
                </button>
            </div>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start border-rose-50 dark:border-rose-900/10">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-10">Relationship Wellness</h3>
                    <div className="w-full flex justify-center">
                        <CircularProgress value={88} label="Strong connections this week" />
                    </div>
                </div>

                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#fff1f2] dark:bg-rose-500/10 rounded-[2.5rem] p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connections</p>
                            <Users size={20} className="text-[#f43f5e]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white">24</h4>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] dark:bg-rose-500/10 rounded-[2.5rem] p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interactions This Week</p>
                            <MessageSquare size={20} className="text-[#f43f5e]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white">12</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+20% vs last week</p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] dark:bg-rose-500/10 rounded-[2.5rem] p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gratitude Entries</p>
                            <Heart size={20} className="text-[#f43f5e]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white">8</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+15% vs last week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Your Connections List */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Your Connections</h3>
                    <div className="space-y-6">
                        {connections.map((conn) => (
                            <div key={conn.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm">
                                        {conn.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">{conn.name}</h4>
                                        <div className="flex items-center space-x-1 mt-1 text-slate-400">
                                            <Calendar size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{conn.lastContact}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-slate-400 hover:text-[#f43f5e] hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                                        <Phone size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-[#f43f5e] hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connection Tasks */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Connection Tasks</h3>
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center space-x-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-colors ${task.completed ? 'bg-[#f43f5e] border-[#f43f5e] text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-transparent group-hover:border-rose-400'}`}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-[#0f172a] dark:text-white font-medium'}`}>{task.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gratitude Journal Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm border-rose-50 dark:border-rose-900/10">
                <div className="flex items-center space-x-3 mb-8">
                    <Heart size={24} className="text-[#f43f5e]" />
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Gratitude Journal</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-500 pl-1">What are you grateful for today?</p>
                        <textarea
                            value={gratitudeText}
                            onChange={(e) => setGratitudeText(e.target.value)}
                            placeholder="Type your gratitude entry here..."
                            className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] p-6 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                        />
                        <button
                            className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-rose-100 dark:shadow-none"
                        >
                            Save Entry
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Entries</p>
                        <div className="space-y-4">
                            {gratitudeEntries.map((entry) => (
                                <div key={entry.id} className="p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl">
                                    <h4 className="text-sm font-bold text-[#0f172a] dark:text-white leading-relaxed">{entry.text}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-2">{entry.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AddConnectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    console.log('Saved Connection:', data);
                    if (onUpdate) onUpdate();
                }}
            />
        </div>
    );
}
