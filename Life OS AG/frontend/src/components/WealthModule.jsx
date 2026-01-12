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
    TrendingDown,
    DollarSign,
    MoreVertical
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

const CircularProgress = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray="251"
                        initial={{ strokeDashoffset: 251 }}
                        animate={{ strokeDashoffset: 251 - (251 * value) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[3.5rem] font-bold text-[#0f172a] leading-none tracking-tighter">{value}</span>
                </div>
            </div>
            {label && <p className="mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>}
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

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    // Mock data for charts to match mockup perfectly
    const incomeExpenseData = [
        { name: 'Jul', income: 5000, expense: 3200 },
        { name: 'Aug', income: 5200, expense: 3400 },
        { name: 'Sep', income: 5100, expense: 3100 },
        { name: 'Oct', income: 5600, expense: 3600 },
        { name: 'Nov', income: 5400, expense: 3200 },
        { name: 'Dec', income: 5800, expense: 3500 },
    ];

    const expenseBreakdownData = [
        { name: 'Housing', value: 35, color: '#3b82f6' },
        { name: 'Food', value: 25, color: '#10b981' },
        { name: 'Transport', value: 15, color: '#f59e0b' },
        { name: 'Entertainment', value: 10, color: '#8b5cf6' },
        { name: 'Shopping', value: 10, color: '#f43f5e' },
        { name: 'Other', value: 5, color: '#64748b' },
    ];

    // Stats matching mockup
    const stats = [
        { label: 'Monthly Income', value: '$5,800', icon: TrendingUp, trend: '+10%', color: '#3b82f6', bgColor: '#eff6ff' },
        { label: 'Monthly Expenses', value: '$3,250', icon: CreditCard, trend: '5%', trendDown: true, color: '#3b82f6', bgColor: '#eff6ff' },
        { label: 'Savings', value: '$2,550', icon: PiggyBank, trend: '+15%', color: '#3b82f6', bgColor: '#eff6ff' },
        { label: 'Savings Rate', value: '44%', icon: DollarSign, trend: '+8%', color: '#3b82f6', bgColor: '#eff6ff' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-100">
                        <Wallet size={24} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Wealth & Finances</h1>
                        <p className="text-slate-400 font-semibold text-sm mt-0.5">Track your income, expenses, and savings</p>
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
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 self-start">Financial Health</h3>
                    <div className="relative mb-4">
                        <CircularProgress value={100} label="44% savings rate" />
                    </div>
                </div>

                {/* Metric Cards */}
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden border border-slate-50/50 shadow-sm transition-all hover:shadow-md cursor-default" style={{ backgroundColor: stat.bgColor }}>
                        <div className="flex justify-between items-start">
                            <span className="text-[13px] font-bold text-slate-500 opacity-80">{stat.label}</span>
                            <div className="p-2 rounded-xl bg-white shadow-sm">
                                <stat.icon size={18} className="text-[#3b82f6]" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="text-3xl font-bold text-[#0f172a] tracking-tight">{stat.value}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className={`text-[11px] font-black ${stat.trendDown ? 'text-rose-500' : 'text-emerald-500'}`}>{stat.trend}</span>
                                <span className="text-[11px] font-bold text-slate-400">vs last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Monthly Budget Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-[#0f172a]">Monthly Budget</h3>
                    <p className="text-sm font-bold text-slate-400">$3,250 / $4,000</p>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '81%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-4 tracking-tight">81% of budget used • $750 remaining</p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Expense Breakdown */}
                <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-[#0f172a] mb-8">Expense Breakdown</h3>
                    <div className="h-[320px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdownData}
                                    innerRadius={80}
                                    outerRadius={110}
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
                        <div className="absolute right-0 bottom-12 bg-white border border-slate-50 py-2 px-4 rounded-xl shadow-sm text-center">
                            <span className="text-[11px] font-bold text-slate-400">Amount : </span>
                            <span className="text-[13px] font-bold text-[#0f172a]">$250</span>
                        </div>
                    </div>
                    {/* Legend Custom */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        {expenseBreakdownData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Income vs Expenses */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0f172a] mb-8">Income vs Expenses</h3>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeExpenseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    ticks={[0, 1500, 3000, 4500, 6000]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                                <Bar dataKey="expense" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-[#0f172a]">Recent Transactions</h3>
                    <button className="text-slate-400 hover:text-[#0f172a] transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Grocery Store', category: 'Food', amount: '$85.50', type: 'expense', date: 'Today' },
                        { name: 'Salary Deposit', category: 'Income', amount: '+$5800.00', type: 'income', date: 'Dec 1' },
                        { name: 'Netflix', category: 'Entertainment', amount: '$15.99', type: 'expense', date: 'Dec 1' },
                        { name: 'Gas Station', category: 'Transport', amount: '$45.00', type: 'expense', date: 'Nov 30' },
                        { name: 'Coffee Shop', category: 'Food', amount: '$6.50', type: 'expense', date: 'Nov 30' },
                    ].map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] transition-all hover:bg-slate-100/50 group">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-white ${tx.type === 'income' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                    {tx.type === 'income' ? <ArrowUpRight size={20} strokeWidth={3} /> : <ArrowDownLeft size={20} strokeWidth={3} />}
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-[#0f172a] tracking-tight">{tx.name}</p>
                                    <p className="text-[11px] font-bold text-slate-400 tracking-tight">{tx.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-[15px] font-black tracking-tight ${tx.type === 'income' ? 'text-emerald-500' : 'text-[#0f172a]'}`}>{tx.amount}</p>
                                <p className="text-[11px] font-bold text-slate-400 tracking-tight">{tx.date}</p>
                            </div>
                        </div>
                    ))}
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
