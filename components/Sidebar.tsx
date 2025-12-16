import React from 'react';
import { LayoutDashboard, Target, Settings, PlusCircle, Mountain, BookOpen, CircleDollarSign, CalendarDays, LogOut } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: 'dashboard' | 'goals' | 'blueprint' | 'finance' | 'weekly';
  setCurrentView: (view: 'dashboard' | 'goals' | 'blueprint' | 'finance' | 'weekly') => void;
  onAddGoal: () => void;
  onLogout: () => void;
  user?: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onAddGoal, onLogout, user }) => {
  return (
    <div className="w-20 lg:w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-6 sticky top-0">
      <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-12">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Mountain className="text-white w-6 h-6" />
        </div>
        <span className="hidden lg:block ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Ascend
        </span>
      </div>

      <nav className="flex-1 w-full space-y-4 px-2 lg:px-4">
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')}
        />
        <SidebarItem 
          icon={<CalendarDays size={20} />} 
          label="Weekly Plan" 
          active={currentView === 'weekly'} 
          onClick={() => setCurrentView('weekly')}
        />
        <SidebarItem 
          icon={<Target size={20} />} 
          label="Goal Matrix" 
          active={currentView === 'goals'} 
          onClick={() => setCurrentView('goals')}
        />
        <SidebarItem 
          icon={<BookOpen size={20} />} 
          label="Blueprint" 
          active={currentView === 'blueprint'} 
          onClick={() => setCurrentView('blueprint')}
        />
        <SidebarItem 
          icon={<CircleDollarSign size={20} />} 
          label="Financial Plan" 
          active={currentView === 'finance'} 
          onClick={() => setCurrentView('finance')}
        />
      </nav>

      <div className="p-4">
        <button 
          onClick={onAddGoal}
          className="w-full flex items-center justify-center lg:justify-start gap-3 bg-primary-600 hover:bg-primary-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95 group"
        >
          <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden lg:block font-semibold">New Target</span>
        </button>
      </div>

      <div className="mt-auto px-4 pb-4 w-full space-y-2">
         {/* User Info (Desktop only) */}
         {user && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-2 text-slate-400 text-xs border-t border-slate-900 pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 truncate">
                    <p className="font-medium text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
            </div>
         )}

         <div className="flex items-center justify-center lg:justify-start text-slate-500 hover:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
            <Settings size={20} />
            <span className="hidden lg:block ml-3">Settings</span>
         </div>
         
         <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center lg:justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer p-2 rounded-lg transition-colors"
         >
            <LogOut size={20} />
            <span className="hidden lg:block ml-3">Log Out</span>
         </button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${
      active 
        ? 'bg-slate-800 text-primary-400 border border-slate-700/50 shadow-inner' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    }`}
  >
    <span className={active ? 'text-primary-400' : ''}>{icon}</span>
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);
