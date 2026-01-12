import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Heart,
  Wallet,
  Users,
  LogOut,
  Settings,
  Bell,
  CheckSquare,
  Target,
  Sparkles,
  User as ProfileIcon,
  Activity,
  Mail,
  Lock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, habitsAPI, goalsAPI, kernelAPI } from './api';
import { HealthModule } from './components/HealthModule';
import { WealthModule } from './components/WealthModule';
import { GoalsModule } from './components/GoalsModule';
import { SocialModule } from './components/SocialModule';
import { HabitsModule } from './components/HabitsModule';
import { UnifiedLogModal } from './components/UnifiedLogModal';
import { DashboardModule } from './components/DashboardModule';
import { ProfileModule } from './components/ProfileModule';
import { SettingsModule } from './components/SettingsModule';
import { NotificationPanel } from './components/NotificationPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('lifeos_token'));
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isDarkMode] = useState(false); // Locked to light mode

  // Auth Flow State
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const fetchAppData = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, habitsRes, goalsRes, eventsRes] = await Promise.all([
        authAPI.getMe(),
        habitsAPI.getHabits(),
        goalsAPI.getGoals(),
        kernelAPI.getEvents()
      ]);
      setUser(userRes.data);
      setHabits(habitsRes.data);
      setGoals(goalsRes.data);
      setNotifications(eventsRes.data.slice(0, 10));
      setTotalEvents(eventsRes.data.length);
    } catch (err) {
      console.error('Failed to fetch data', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAppData();
    } else {
      setLoading(false);
    }
  }, [token, fetchAppData]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signin') {
        const res = await authAPI.login({ email, password });
        const newToken = res.data.token;
        localStorage.setItem('lifeos_token', newToken);
        setToken(newToken);
      } else {
        const res = await authAPI.register({ name, email, password });
        const newToken = res.data.token;
        localStorage.setItem('lifeos_token', newToken);
        setToken(newToken);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lifeos_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-white text-[#1e293b]">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-2xl font-black italic text-white">L</span>
          </div>
          <span className="text-3xl font-display font-bold tracking-tight text-[#0f172a]">LifeOS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] rounded-[2rem] p-10 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold mb-3 text-[#0f172a]">Welcome</h1>
            <p className="text-slate-500 text-sm">Sign in to your account or create a new one to get started</p>
          </div>

          <div className="flex p-1.5 rounded-2xl mb-8 bg-slate-100/80">
            <button
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${authMode === 'signin' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${authMode === 'signup' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1 text-[#1e293b]">Full Name</label>
                <div className="relative">
                  <ProfileIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full border-none rounded-2xl p-4 pl-12 text-sm bg-slate-50 focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold ml-1 text-[#1e293b]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border-none rounded-2xl p-4 pl-12 text-sm bg-slate-50 focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold ml-1 text-[#1e293b]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border-none rounded-2xl p-4 pl-12 text-sm bg-slate-50 focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.99] shadow-blue-100"
            >
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (loading && !user) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <RefreshCw className="text-[#3b82f6] animate-spin" size={40} />
      </div>
    )
  }

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'wealth', name: 'Wealth', icon: Wallet },
    { id: 'relationships', name: 'Relationships', icon: Users },
    { id: 'habits', name: 'Habits', icon: CheckSquare },
    { id: 'goals', name: 'Purpose', icon: Target },
    { id: 'ai', name: 'AI Insights', icon: Sparkles },
  ];

  const accountItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'profile', name: 'Profile', icon: ProfileIcon },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden text-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#f1f5f9] flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="text-xl font-black italic">L</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl tracking-tight leading-none text-[#0f172a]">LifeOS</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none opacity-60">Life Management</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <div className="mb-8">
            <p className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Modules</p>
            <div className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeTab === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? 'bg-[#f1f5f9] text-[#0f172a]' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Icon size={18} className={`${isActive ? 'text-[#0f172a]' : 'text-slate-400'}`} />
                    <span className={`font-bold text-[14px] tracking-tight ${isActive ? 'text-[#0f172a]' : 'text-slate-500'}`}>{module.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Account</p>
            <div className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? 'bg-[#f1f5f9] text-[#0f172a]' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Icon size={18} className={`${isActive ? 'text-[#0f172a]' : 'text-slate-400'}`} />
                    <span className={`font-bold text-[14px] tracking-tight ${isActive ? 'text-[#0f172a]' : 'text-slate-500'}`}>{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto border-t border-[#f1f5f9]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 min-w-[40px] rounded-full bg-[#14b8a6] flex items-center justify-center text-white font-bold text-sm">
              NI
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-bold text-[#0f172a] truncate leading-none mb-1">nitin</p>
              <p className="text-[11px] font-medium text-slate-400 truncate leading-none">monishprabu39200...</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-[#0f172a] transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto bg-white">
        <header className="px-10 py-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">{user?.name || 'John Doe'}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsNotificationOpen(true)} className="p-2 text-slate-400 hover:text-[#0f172a] transition-all relative">
              <Bell size={22} className="stroke-[2px]" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardModule user={user} habits={habits} goals={goals} onUpdate={fetchAppData} setActiveTab={setActiveTab} />}
              {activeTab === 'health' && <HealthModule onUpdate={fetchAppData} user={user} />}
              {activeTab === 'wealth' && <WealthModule onUpdate={fetchAppData} user={user} />}
              {activeTab === 'habits' && <HabitsModule onUpdate={fetchAppData} user={user} />}
              {activeTab === 'goals' && <GoalsModule onUpdate={fetchAppData} user={user} />}
              {activeTab === 'relationships' && <SocialModule onUpdate={fetchAppData} user={user} />}
              {activeTab === 'profile' && <ProfileModule user={user} totalEvents={totalEvents} habits={habits} goals={goals} onUpdate={fetchAppData} />}
              {activeTab === 'settings' && <SettingsModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <UnifiedLogModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onSuccess={fetchAppData} />
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} notifications={notifications} />
    </div>
  );
}

export default App;
