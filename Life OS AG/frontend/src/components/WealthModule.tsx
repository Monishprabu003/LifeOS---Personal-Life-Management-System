import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Plus,
    TrendingUp,
    CreditCard,
    PiggyBank,
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { AddTransactionModal } from './AddTransactionModal';

const incomeVsExpenseData = [
    { name: 'Jul', income: 5000, expense: 3200 },
    { name: 'Aug', income: 5200, expense: 3400 },
    { name: 'Sep', income: 5100, expense: 3100 },
    { name: 'Oct', income: 5500, expense: 3800 },
    { name: 'Nov', income: 5300, expense: 3300 },
    { name: 'Dec', income: 5800, expense: 3250 },
];

const expenseBreakdownData = [
    { name: 'Housing', value: 1200, color: '#3b82f6' },
    { name: 'Food', value: 600, color: '#10b981' },
    { name: 'Transport', value: 400, color: '#f59e0b' },
    { name: 'Entertainment', value: 300, color: '#8b5cf6' },
    { name: 'Shopping', value: 500, color: '#f43f5e' },
    { name: 'Other', value: 250, color: '#94a3b8' },
];

const transactions = [
    { id: 1, title: 'Grocery Store', category: 'Food', amount: 85.50, type: 'expense', date: 'Today' },
    { id: 2, title: 'Salary Deposit', category: 'Income', amount: 5800.00, type: 'income', date: 'Dec 1' },
    { id: 3, title: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', date: 'Dec 1' },
    { id: 4, title: 'Gas Station', category: 'Transport', amount: 45.00, type: 'expense', date: 'Nov 30' },
    { id: 5, title: 'Coffee Shop', category: 'Food', amount: 6.50, type: 'expense', date: 'Nov 30' },
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
                        stroke="#3b82f6"
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

export function WealthModule({ onUpdate }: { onUpdate?: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-10">Financial Health</h3>
                    <div className="w-full flex justify-center">
                        <CircularProgress value={100} label="44% savings rate" />
                    </div>
                </div>

                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#eff6ff] dark:bg-blue-500/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Income</p>
                            <TrendingUp size={20} className="text-[#3b82f6]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">$5,800</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+10% vs last week</p>
                        </div>
                    </div>

                    <div className="bg-[#eff6ff] dark:bg-blue-500/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Expenses</p>
                            <CreditCard size={20} className="text-[#3b82f6]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">$3,250</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">5% vs last week</p>
                        </div>
                    </div>

                    <div className="bg-[#eff6ff] dark:bg-blue-500/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Savings</p>
                            <PiggyBank size={20} className="text-[#3b82f6]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">$2,550</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+15% vs last week</p>
                        </div>
                    </div>

                    <div className="bg-[#eff6ff] dark:bg-blue-500/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Savings Rate</p>
                            <DollarSign size={20} className="text-[#3b82f6]" />
                        </div>
                        <div className="mt-6">
                            <h4 className="text-3xl font-display font-bold text-[#0f172a] dark:text-white">44%</h4>
                            <p className="text-[10px] font-bold text-[#10b981] mt-2">+8% vs last week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">Monthly Budget</h3>
                    <span className="text-sm font-bold text-slate-500">$3,250 / $4,000</span>
                </div>
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '81%' }}
                        className="h-full bg-[#10b981] rounded-full"
                    />
                </div>
                <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>81% of budget used • $750 remaining</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Expense Breakdown</h3>
                    <div className="h-[300px] w-full relative">
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
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    formatter={(value: string) => <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-8">Income vs Expenses</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeVsExpenseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    ticks={[0, 1500, 3000, 4500, 6000]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 4, 4]} barSize={30} />
                                <Bar dataKey="expense" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">Recent Transactions</h3>
                    <div className="flex items-center space-x-2 text-[#3b82f6] font-bold text-sm cursor-pointer hover:underline">
                        <span>View all</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group hover:bg-slate-100 transition-colors">
                            <div className="flex items-center space-x-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-[#ecfdf5] text-[#10b981]' : 'bg-[#eff6ff] text-[#3b82f6]'}`}>
                                    {tx.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">{tx.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{tx.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h4 className={`text-sm font-bold ${tx.type === 'income' ? 'text-[#10b981]' : 'text-[#0f172a] dark:text-white'}`}>
                                    {tx.type === 'income' ? '+' : ''}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{tx.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    console.log('Saved Transaction:', data);
                    if (onUpdate) onUpdate();
                }}
            />
        </div>
    );
}
