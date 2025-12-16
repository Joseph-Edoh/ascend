import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GoalCard } from './components/GoalCard';
import { AddGoalModal } from './components/AddGoalModal';
import { Blueprint } from './components/Blueprint';
import { FinanceModule } from './components/FinanceModule';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { AuthPage } from './components/AuthPage';
import { Goal, GoalStatus, Timeframe, YearAspirations, PlannerItem, DailyTask, DailyTasksMap, User } from './types';
import { getMotivationalQuote } from './services/geminiService';
import { getCurrentUser, logout } from './services/authService';
import { Search, Filter } from 'lucide-react';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Achieve Financial Independence',
    description: 'Build a robust investment portfolio and multiple income streams.',
    timeframe: Timeframe.Yearly,
    status: GoalStatus.InProgress,
    progress: 45,
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Launch SaaS Product',
    description: 'Develop and market the MVP for the new project.',
    timeframe: Timeframe.Quarterly,
    parentId: '1',
    status: GoalStatus.InProgress,
    progress: 30,
    createdAt: Date.now(),
  },
  {
    id: '3',
    title: 'Complete Backend API',
    description: 'Finish all endpoints for the user authentication and data service.',
    timeframe: Timeframe.Weekly,
    parentId: '2',
    status: GoalStatus.NotStarted,
    progress: 0,
    createdAt: Date.now(),
  }
];

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [currentView, setCurrentView] = useState<'dashboard' | 'goals' | 'blueprint' | 'finance' | 'weekly'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quote, setQuote] = useState<string>("Ascend to your highest potential.");
  
  // Goals View State
  const [filterTimeframe, setFilterTimeframe] = useState<Timeframe | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Blueprint State
  const [aspirations, setAspirations] = useState<YearAspirations>({
    do: '',
    have: '',
    be: '',
    live: ''
  });

  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([
    {
        id: '1',
        item: 'Read "Deep Work"',
        category: 'Books to Read',
        startDate: '2026-01-01',
        endDate: '2026-01-15',
        priority: 'High',
        executioner: 'Me',
        status: 'Done'
    },
    {
        id: '2',
        item: 'Learn Rust Programming',
        category: 'Skills to Learn/Sharpen',
        startDate: '2026-02-01',
        endDate: '2026-06-30',
        priority: 'High',
        executioner: 'Me',
        status: 'In Progress'
    }
  ]);

  // Finance State: Array of 12 numbers (Jan-Dec)
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>(new Array(12).fill(0));

  // Weekly Planner State
  const [dailyTasks, setDailyTasks] = useState<DailyTasksMap>({
    // Initial dummy data for "today"
    [new Date().toISOString().split('T')[0]]: [
        { id: '101', text: 'Morning Meditation', time: '07:00', completed: true, order: 0 },
        { id: '102', text: 'Review Project Roadmap', time: '09:00', completed: false, order: 1 }
    ]
  });

  useEffect(() => {
    // Check for user session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setAuthLoading(false);

    // Simulate AI Quote fetch on load
    getMotivationalQuote().then(setQuote);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView('dashboard'); // Reset view on logout
  };

  const addGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'status' | 'progress'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: GoalStatus.NotStarted,
      progress: 0,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const toggleGoalStatus = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newStatus = g.status === GoalStatus.Completed ? GoalStatus.InProgress : GoalStatus.Completed;
        const newProgress = newStatus === GoalStatus.Completed ? 100 : 50; // Simple toggle logic
        return { ...g, status: newStatus, progress: newProgress };
      }
      return g;
    }));
  };

  const handleGoalClick = (goal: Goal) => {
    console.log("Clicked goal:", goal);
  };

  // Blueprint Handlers
  const handleAspirationChange = (field: keyof YearAspirations, value: string) => {
    setAspirations(prev => ({ ...prev, [field]: value }));
  };

  const addPlannerItem = (item: Omit<PlannerItem, 'id'>) => {
    const newItem: PlannerItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9)
    };
    setPlannerItems(prev => [...prev, newItem]);
  };

  const updatePlannerItem = (id: string, updates: Partial<PlannerItem>) => {
    setPlannerItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deletePlannerItem = (id: string) => {
    setPlannerItems(prev => prev.filter(item => item.id !== id));
  };

  // Finance Handler
  const handleIncomeChange = (monthIndex: number, value: number) => {
    const newIncomes = [...monthlyIncome];
    newIncomes[monthIndex] = value;
    setMonthlyIncome(newIncomes);
  };

  // Weekly Planner Handlers
  const addTask = (dateKey: string, text: string, time?: string) => {
    setDailyTasks(prev => {
        const currentTasks = prev[dateKey] || [];
        const newTask: DailyTask = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            time,
            completed: false,
            order: currentTasks.length
        };
        // Sort by time if available, otherwise by order/added time
        const newTaskList = [...currentTasks, newTask].sort((a, b) => {
            if (a.time && b.time) return a.time.localeCompare(b.time);
            if (a.time) return -1;
            if (b.time) return 1;
            return a.order - b.order;
        });

        return { ...prev, [dateKey]: newTaskList };
    });
  };

  const toggleTask = (dateKey: string, taskId: string) => {
    setDailyTasks(prev => {
        const tasks = prev[dateKey] || [];
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...prev, [dateKey]: updatedTasks };
    });
  };

  const deleteTask = (dateKey: string, taskId: string) => {
    setDailyTasks(prev => {
        const tasks = prev[dateKey] || [];
        return { ...prev, [dateKey]: tasks.filter(t => t.id !== taskId) };
    });
  };

  const reorderTasks = (dateKey: string, startIndex: number, endIndex: number) => {
    setDailyTasks(prev => {
        const tasks = [...(prev[dateKey] || [])];
        const [removed] = tasks.splice(startIndex, 1);
        tasks.splice(endIndex, 0, removed);
        // Update order property
        const updatedTasks = tasks.map((t, idx) => ({ ...t, order: idx }));
        return { ...prev, [dateKey]: updatedTasks };
    });
  };

  // Helper for mapping parent IDs to titles
  const parentMap = goals.reduce((acc, g) => ({ ...acc, [g.id]: g.title }), {} as Record<string, string>);

  const filteredGoals = goals.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTimeframe === 'All' || g.timeframe === filterTimeframe;
    return matchesSearch && matchesFilter;
  });

  const getPageTitle = () => {
    switch(currentView) {
        case 'dashboard': return 'Command Center';
        case 'goals': return 'Target Matrix';
        case 'blueprint': return '2026 Strategic Blueprint';
        case 'finance': return 'Wealth Architecture';
        case 'weekly': return 'Weekly Execution';
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Ascend...</div>;
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onAddGoal={() => setIsModalOpen(true)}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
        
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden md:block">
                    {getPageTitle()}
                </h1>
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Daily Motivation</p>
                <p className="text-sm text-primary-400 italic">"{quote}"</p>
            </div>
        </div>

        {/* Content */}
        <div className="pb-20">
            {currentView === 'dashboard' && (
                <Dashboard 
                    goals={goals} 
                    onToggleStatus={toggleGoalStatus} 
                    onGoalClick={handleGoalClick}
                    parentMap={parentMap}
                    dailyTasks={dailyTasks}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onReorderTasks={reorderTasks}
                />
            )}

            {currentView === 'goals' && (
                <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search targets..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['All', ...Object.values(Timeframe)].map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setFilterTimeframe(tf as Timeframe | 'All')}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors border ${
                                        filterTimeframe === tf 
                                        ? 'bg-slate-800 text-white border-slate-600' 
                                        : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-900'
                                    }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGoals.map(goal => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onToggleStatus={toggleGoalStatus}
                                onClick={handleGoalClick}
                                parentTitle={goal.parentId ? parentMap[goal.parentId] : undefined}
                            />
                        ))}
                    </div>
                    
                    {filteredGoals.length === 0 && (
                        <div className="text-center py-20">
                            <Filter className="mx-auto text-slate-700 mb-4" size={48} />
                            <h3 className="text-xl text-slate-400">No targets found</h3>
                            <p className="text-slate-600">Adjust filters or create a new goal.</p>
                        </div>
                    )}
                </div>
            )}

            {currentView === 'blueprint' && (
                <Blueprint 
                    aspirations={aspirations}
                    onAspirationChange={handleAspirationChange}
                    items={plannerItems}
                    onAddItem={addPlannerItem}
                    onUpdateItem={updatePlannerItem}
                    onDeleteItem={deletePlannerItem}
                />
            )}

            {currentView === 'finance' && (
                <FinanceModule 
                    monthlyIncome={monthlyIncome}
                    onIncomeChange={handleIncomeChange}
                />
            )}

            {currentView === 'weekly' && (
                <WeeklyPlanner 
                    dailyTasks={dailyTasks}
                    plannerItems={plannerItems}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onReorderTasks={reorderTasks}
                />
            )}
        </div>
      </main>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddGoal={addGoal}
        potentialParents={goals}
      />

    </div>
  );
}
