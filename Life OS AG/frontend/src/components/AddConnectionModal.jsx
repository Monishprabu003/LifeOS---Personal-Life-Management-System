import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';


export function AddConnectionModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('friend');
    const [frequency, setFrequency] = useState('weekly');

    const handleSave = () => {
        onSave({ name, type, frequencyGoal: frequency === 'daily' ? 1 : 7 });
        onClose();
        setName('');
        setType('friend');
        setFrequency('weekly');
    };

    if (!isOpen) return null;

    const categories = [
        { id: 'family', label: 'Family', color: 'rose' },
        { id: 'friend', label: 'Friend', color: 'blue' },
        { id: 'professional', label: 'Work', color: 'amber' },
        { id: 'favourite', label: 'Favourite', color: 'pink' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-display font-bold text-[#0f172a] dark:text-white mb-10">Add New Connection</h2>

                <div className="space-y-8">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
                        <input
                            type="text"
                            placeholder="Person's name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-rose-500 rounded-2xl p-4 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setType(cat.id)}
                                    className={`py-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-2 ${type === cat.id ? 'bg-rose-500 text-white border-rose-500 shadow-lg scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-rose-200'}`}
                                >
                                    {cat.id === 'favourite' && <span>⭐</span>}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frequency Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contact Frequency</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-700 dark:text-slate-200 outline-none font-medium appearance-none"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!name}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-rose-100 dark:shadow-none transition-all transform hover:-translate-y-0.5 mt-4"
                    >
                        Add Connection
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
