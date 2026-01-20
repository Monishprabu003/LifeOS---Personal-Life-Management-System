import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Plus,
    TrendingUp,
    CreditCard,
    PiggyBank,
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign,
    MoreVertical,
    Trash2
} from 'lucide-react';
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import { AddTransactionModal } from './AddTransactionModal';
import { financeAPI } from '../api';

const CircularProgress = ({ value }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#f1f5f9"
                        strokeWidth="7"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#3b82f6"
                        strokeWidth="9"
                        fill="transparent"
                        strokeDasharray="264"
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (264 * 100) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[3.5rem] font-bold text-[#0f172a] leading-none tracking-tighter">100</span>
                </div>
            </div>
            <p className="mt-8 text-[13px] font-bold text-slate-400 tracking-tight">{value}% savings rate</p>
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
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await financeAPI.deleteTransaction(id);
            fetchTransactions();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    // Dynamic data calculations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0;

    // Chart data generation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeExpenseData = months.map((m, i) => {
        const monthIncome = transactions
            .filter(t => t.type === 'income' && new Date(t.date).getMonth() === i)
            .reduce((sum, t) => sum + t.amount, 0);
        const monthExpense = transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === i)
            .reduce((sum, t) => sum + t.amount, 0);
        return { name: m, income: monthIncome, expense: monthExpense };
    }).slice(Math.max(0, currentMonth - 5), currentMonth + 1);

    const categories = [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))];
    const expenseBreakdownData = categories.map((cat, i) => {
        const value = transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'];
        return { name: cat, value, color: colors[i % colors.length] };
    });

    if (expenseBreakdownData.length === 0) {
        expenseBreakdownData.push({ name: 'No Data', value: 1, color: '#f1f5f9' });
    }

    const stats = [
        { label: 'Monthly Income', value: `₹${monthlyIncome.toLocaleString()}`, icon: TrendingUp, trend: '+0%', color: '#3b82f6', bgColor: '#ebf2ff' },
        { label: 'Monthly Expenses', value: `₹${monthlyExpenses.toLocaleString()}`, icon: CreditCard, trend: '0%', trendDown: true, color: '#3b82f6', bgColor: '#ebf2ff' },
        { label: 'Savings', value: `₹${savings.toLocaleString()}`, icon: PiggyBank, trend: '+0%', color: '#3b82f6', bgColor: '#ebf2ff' },
        { label: 'Savings Rate', value: `${savingsRate}%`, icon: DollarSign, trend: '+0%', color: '#3b82f6', bgColor: '#ebf2ff' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-100">
                        <Wallet size={22} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-[2rem] font-bold text-[#0f172a] tracking-tight">Wealth & Finances</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-tight opacity-70">Track your income, expenses, and savings</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-blue-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Financial Health Gauge */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-8 self-start ml-2">Financial Health</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={savingsRate || 44} />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2rem] p-8 flex flex-col justify-between relative border border-blue-50/50 shadow-sm transition-all hover:shadow-md cursor-default bg-[#eff6ff]">
                        <div className="flex justify-between items-start">
                            <span className="text-[15px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="text-[#3b82f6]">
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-[2.2rem] font-bold text-[#0f172a] tracking-tight leading-none">{stat.value}</p>
                            <div className="flex items-center gap-1.5 mt-3">
                                <span className={`text-[11px] font-black ${stat.trendDown ? 'text-rose-500' : 'text-emerald-500'}`}>{stat.trend}</span>
                                <span className="text-[11px] font-bold text-slate-400">vs last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Monthly Budget Section */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[17px] font-bold text-[#0f172a]">Monthly Budget</h3>
                    <p className="text-[15px] font-bold text-slate-400">$3,250 / $4,000</p>
                </div>
                <div className="relative h-4 w-full bg-[#ebf2ff] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (monthlyExpenses / 4000) * 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
                <p className="text-[13px] font-bold text-slate-400 mt-4 tracking-tight">
                    {Math.round((monthlyExpenses / 4000) * 100)}% of budget used • ${Math.max(0, 4000 - monthlyExpenses)} remaining
                </p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Expense Breakdown */}
                <div className="lg:col-span-5 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-8">Expense Breakdown</h3>
                    <div className="h-[320px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdownData}
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {expenseBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[13px] font-bold text-[#0f172a]">Amount : $1500</p>
                        </div>
                    </div>
                    {/* Legend Custom */}
                    <div className="flex flex-wrap items-center justify-center gap-5 mt-4">
                        {[
                            { name: 'Housing', color: '#3b82f6' },
                            { name: 'Food', color: '#10b981' },
                            { name: 'Transport', color: '#f59e0b' },
                            { name: 'Entertainment', color: '#8b5cf6' },
                            { name: 'Shopping', color: '#f43f5e' },
                            { name: 'Other', color: '#64748b' }
                        ].map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[12px] font-bold text-slate-400 tracking-tight">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Income vs Expenses Chart */}
                <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                    <h3 className="text-[17px] font-bold text-[#0f172a] mb-8">Income vs Expenses</h3>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeExpenseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    ticks={[0, 1500, 3000, 4500, 6000]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={26} />
                                <Bar dataKey="expense" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={26} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[17px] font-bold text-[#0f172a]">Recent Transactions</h3>
                    <button className="text-slate-400 hover:text-[#0f172a] transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
                <div className="space-y-4">
                    {transactions.length > 0 ? transactions.slice(0, 10).map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-[#f8fafc]/50 rounded-2xl transition-all hover:bg-slate-100/80 group">
                            <div className="flex items-center gap-5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white ${tx.type === 'income' ? 'text-emerald-500 bg-[#ecfdf5]' : 'text-blue-500 bg-[#eff6ff]'}`}>
                                    {tx.type === 'income' ? <ArrowUpRight size={18} strokeWidth={3} /> : <ArrowDownLeft size={18} strokeWidth={3} />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[16px] font-bold text-[#0f172a] tracking-tight">{tx.description || tx.name}</p>
                                    <p className="text-[12px] font-medium text-slate-400 tracking-tight">{tx.category}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className={`text-[16px] font-black tracking-tight ${tx.type === 'income' ? 'text-emerald-500' : 'text-[#0f172a]'}`}>
                                    {tx.type === 'income' ? '+' : ''}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[12px] font-bold text-slate-400 tracking-tight">
                                    {typeof tx.date === 'string' ? tx.date.split('-').reverse().join(' ').replace(' 2025', '') : 'Today'}
                                </p>
                            </div>
                            <div className="ml-4 transition-opacity">
                                <button
                                    onClick={() => handleDeleteTransaction(tx._id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-12 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded yet</p>
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
        </div >
    );
}
