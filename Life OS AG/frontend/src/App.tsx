import { useState } from 'react';
import {
  LayoutDashboard,
  Heart,
  Wallet,
  Zap,
  Target,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-primary' },
    { id: 'health', name: 'Health', icon: Heart, color: 'text-health' },
    { id: 'wealth', name: 'Wealth', icon: Wallet, color: 'text-wealth' },
    { id: 'habits', name: 'Habits', icon: Zap, color: 'text-habits' },
    { id: 'goals', name: 'Goals', icon: Target, color: 'text-goals' },
    { id: 'relationships', name: 'Social', icon: Users, color: 'text-relationships' },
    { id: 'ai', name: 'AI Copilot', icon: MessageSquare, color: 'text-accent' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="font-display font-bold text-white text-xl">L</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LifeOS
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === module.id
                  ? 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon size={20} className={activeTab === module.id ? module.color : 'group-hover:' + module.color} />
                <span className="font-medium">{module.name}</span>
                {activeTab === module.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Human 001</p>
              <p className="text-xs text-slate-500 truncate">V1.0.0 Experimental</p>
            </div>
            <Settings size={18} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center bg-slate-900/50 rounded-full px-4 py-2 border border-slate-800 focus-within:border-primary/50 transition-colors w-96">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search life events, goals, or AI help..."
              className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-relationships rounded-full border border-background"></span>
            </button>
            <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <Plus size={18} />
              <span>Log Event</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardMockup />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* AI Floating Assistant */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-2xl z-50 group"
      >
        <MessageSquare className="text-white group-hover:animate-bounce" />
      </motion.button>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 glass rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-all"></div>
          <div className="relative z-10">
            <h3 className="text-slate-400 font-medium flex items-center">
              Global Life Score
              <Zap size={16} className="ml-2 text-wealth" />
            </h3>
            <div className="mt-4 flex items-end space-x-4">
              <span className="text-7xl font-display font-bold text-white tracking-tighter">
                84 <span className="text-2xl text-slate-500">/ 100</span>
              </span>
              <div className="mb-2 flex items-center text-health text-sm font-semibold bg-health/10 px-2 py-1 rounded-lg">
                +5.2% <Plus size={12} className="ml-1" />
              </div>
            </div>
            <p className="mt-4 text-slate-400 max-w-xs leading-relaxed">
              Your life system is performing optimally. Your focus on <span className="text-health">Health</span> this week is paying off.
            </p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:border-health/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-health/10 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
              <Heart className="text-health" />
            </div>
            <h3 className="text-slate-400 font-medium">Health Status</h3>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">Stable</span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2">
              <div className="w-[78%] h-full bg-health rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:border-wealth/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-wealth/10 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
              <Wallet className="text-wealth" />
            </div>
            <h3 className="text-slate-400 font-medium">Wealth Index</h3>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">$12,450.00</span>
            <p className="text-xs text-slate-500 mt-1">Available Liquidity</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Habits */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Habit Streaks</h2>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Deep Work', streak: '12 days', icon: Zap, color: 'text-habits', bg: 'bg-habits/10' },
                { name: 'Reading', streak: '5 days', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
                { name: 'Meditation', streak: '14 days', icon: Zap, color: 'text-health', bg: 'bg-health/10' },
                { name: 'Cold Shower', streak: '3 days', icon: Zap, color: 'text-accent', bg: 'bg-accent/10' }
              ].map((habit) => (
                <div key={habit.name} className="glass p-5 rounded-2xl flex items-center space-x-4 card-hover">
                  <div className={`${habit.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <habit.icon className={habit.color} size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{habit.name}</h4>
                    <p className="text-xs text-slate-500">{habit.streak}</p>
                  </div>
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-slate-800'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 h-80 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <LayoutDashboard size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500">Timeline and advanced charts will appear here.</p>
          </section>
        </div>

        {/* Right Column - Goal Alignment */}
        <div className="space-y-8">
          <section className="glass rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-6">Mission Alignment</h2>
            <div className="space-y-6">
              {[
                { name: 'Health & Vitality', progress: 85, color: 'bg-health' },
                { name: 'Financial Freedom', progress: 42, color: 'bg-wealth' },
                { name: 'Skill Mastery', progress: 68, color: 'bg-primary' },
                { name: 'Social Connection', progress: 91, color: 'bg-relationships' },
              ].map(goal => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{goal.name}</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className={`h-full ${goal.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors text-sm font-semibold">
              Refine Life Purpose
            </button>
          </section>

          <section className="bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/20 blur-2xl group-hover:bg-accent/40 transition-all rounded-full"></div>
            <h3 className="font-display font-bold text-lg mb-2 flex items-center">
              AI Insight
              <MessageSquare size={16} className="ml-2 text-accent" />
            </h3>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Your productivity peaks between 9 AM and 11 AM. I suggest scheduling your 'Deep Work' habit during this window to accelerate your Skill Mastery goal."
            </p>
            <button className="mt-4 text-xs font-bold text-accent uppercase tracking-wider hover:underline">
              Explore Insight
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
