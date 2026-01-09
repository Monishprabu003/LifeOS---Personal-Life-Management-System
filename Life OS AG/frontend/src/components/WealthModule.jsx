import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Plus,
    TrendingUp,
    CreditCard,
    PiggyBank,
    IndianRupee,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Trash2
} from 'lucide-react';
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { AddTransactionModal } from './AddTransactionModal';
import { financeAPI } from '../api';

const CircularProgress = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    {/* Background Glow Well */}
                    <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="currentColor"
                        className="text-white/20 dark:text-slate-800/20"
                    />
                    {/* Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    {/* Blue Progress Arc */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.3"
                        initial={{ strokeDashoffset: 251.3 }}
                        animate={{ strokeDashoffset: 251.3 - (251.3 * value) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-none tracking-tight">{value}</span>
                </div>
            </div>
            {label && <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center max-w-[200px] leading-relaxed">{label}</p>}
        </div>
    );
};

export function WealthModule({ onUpdate, user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await financeAPI.getTransactions();
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await financeAPI.deleteTransaction(id);
            fetchTransactions();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Failed to delete transaction', err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    // Derived stats
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

    // Chart data (mock logic for grouping by category)
    const categoryTotals = transactions.reduce((acc, t) => {
        if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
    }, {});

    const expenseBreakdownData = Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#94a3b8'][index % 6]
    }));

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-[#0f172a] dark:text-white leading-tight">Wealth & Finances</h1>
                        <p className="text-slate-500 font-medium mt-1">Track your income, expenses, and savings</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="lg:col-span-3 glass-card p-10 flex flex-col items-center justify-center text-center transition-all duration-500 border-blue-50 dark:border-blue-900/10"
                >
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-10">Financial Health</h3>
                    <CircularProgress value={savingsRate} label={`${savingsRate}% savings rate`} />
                </motion.div>

                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass p-8 flex flex-col justify-between interactive-hover rounded-[2.5rem] bg-blue-50/20 dark:bg-blue-500/5 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Income</p>
                            <TrendingUp size={20} className="text-[#3b82f6] opacity-60" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">₹{totalIncome.toLocaleString()}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">All time cumulative</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass p-8 flex flex-col justify-between interactive-hover rounded-[2.5rem] bg-blue-50/20 dark:bg-blue-500/5 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</p>
                            <CreditCard size={20} className="text-[#3b82f6] opacity-60" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">₹{totalExpense.toLocaleString()}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">All time cumulative</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass p-8 flex flex-col justify-between interactive-hover rounded-[2.5rem] bg-blue-50/20 dark:bg-blue-500/5 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Savings</p>
                            <PiggyBank size={20} className="text-[#3b82f6] opacity-60" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">₹{savings.toLocaleString()}</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2 font-display">Net growth</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass p-8 flex flex-col justify-between interactive-hover rounded-[2.5rem] bg-blue-50/20 dark:bg-blue-500/5 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Savings Rate</p>
                            <IndianRupee size={20} className="text-[#3b82f6] opacity-60" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">{savingsRate}%</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2 font-display">Efficiency</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 glass-card p-10 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Expense Breakdown</h3>
                    <div className="h-[300px] w-full relative">
                        {expenseBreakdownData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdownData}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <CreditCard size={40} className="mb-4 text-slate-300" />
                                <p className="text-slate-500 font-medium">Add expense transactions to see breakdown</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7 glass-card p-10 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Recent Transactions</h3>
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Loading...</div>
                    ) : transactions.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {transactions.map((tx) => (
                                <motion.div
                                    key={tx._id}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center justify-between p-5 glass rounded-2xl group interactive-hover"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors duration-300 ${tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-[#10b981]' : 'bg-blue-50 dark:bg-blue-500/10 text-[#3b82f6]'}`}>
                                            {tx.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">{tx.description}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <h4 className={`text-sm font-bold font-display ${tx.type === 'income' ? 'text-[#10b981]' : 'text-[#0f172a] dark:text-white'}`}>
                                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </h4>
                                        </div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTransaction(tx._id); }}
                                            className="p-2.5 bg-white/80 dark:bg-slate-900/80 text-red-500 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 rounded-xl transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer relative z-20"
                                            title="Delete Transaction"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] opacity-40">
                            <Search size={40} className="mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-400 font-medium text-sm">No transactions yet. Start logging to track your wealth.</p>
                        </div>
                    )}
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (data) => {
                    await financeAPI.createTransaction(data);
                    fetchTransactions();
                    if (onUpdate) onUpdate();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
