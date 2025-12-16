import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Goal, GoalStatus, Timeframe, DailyTask } from '../types';
import { GoalCard } from './GoalCard';
import { DailyToDoList } from './DailyToDoList';
import { Zap, Target, ArrowUp } from 'lucide-react';

interface DashboardProps {
  goals: Goal[];
  onToggleStatus: (id: string) => void;
  onGoalClick: (goal: Goal) => void;
  parentMap: Record<string, string>; // id -> title
  
  // Daily Task Props
  dailyTasks: Record<string, DailyTask[]>;
  onAddTask: (dateKey: string, text: string, time?: string) => void;
  onToggleTask: (dateKey: string, taskId: string) => void;
  onDeleteTask: (dateKey: string, taskId: string) => void;
  onReorderTasks: (dateKey: string, startIndex: number, endIndex: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    goals, 
    onToggleStatus, 
    onGoalClick, 
    parentMap,
    dailyTasks,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    onReorderTasks
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter Goals
  const quarterlyGoals = goals.filter(g => g.timeframe === Timeframe.Quarterly && g.status !== GoalStatus.Completed);
  const activeQuarterly = quarterlyGoals.length > 0 ? quarterlyGoals[0] : null;
  
  const weeklyGoals = goals.filter(g => g.timeframe === Timeframe.Weekly);
  const completedCount = goals.filter(g => g.status === GoalStatus.Completed).length;
  const momentumScore = Math.min(100, Math.round((completedCount / (goals.length || 1)) * 100));

  // Chart Data
  const data = [
    { name: 'Mon', progress: 20 },
    { name: 'Tue', progress: 35 },
    { name: 'Wed', progress: 45 },
    { name: 'Thu', progress: 45 },
    { name: 'Fri', progress: 60 },
    { name: 'Sat', progress: 75 },
    { name: 'Sun', progress: 85 },
  ];

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: goals.length - completedCount },
  ];
  const COLORS = ['#2dd4bf', '#1e293b']; // Teal, Slate-800

  // Calculate Progress for Active Quarterly Goal
  const quarterlyProgress = activeQuarterly ? activeQuarterly.progress : 0;
  
  // Today's Date Key
  const todayKey = new Date().toISOString().split('T')[0];

  if (!mounted) return <div className="p-8 text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Momentum Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">Momentum Score</span>
                </div>
                <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                    {momentumScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
                </div>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${momentumScore}%` }}></div>
            </div>
        </div>

        {/* Focus Card (Quarterly) */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col justify-between md:col-span-2 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
             <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="text-blue-400" size={20} />
                        <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">Current Quarter Focus</span>
                    </div>
                    {activeQuarterly ? (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-1">{activeQuarterly.title}</h2>
                            <p className="text-slate-400 text-sm max-w-lg truncate">{activeQuarterly.description}</p>
                        </>
                    ) : (
                        <h2 className="text-xl font-bold text-slate-500">No active quarterly goal set.</h2>
                    )}
                </div>
                {activeQuarterly && (
                    <div className="text-right">
                         <span className="text-3xl font-bold text-blue-400">{quarterlyProgress}%</span>
                         <div className="text-xs text-slate-500">Completion</div>
                    </div>
                )}
             </div>
             {activeQuarterly && (
                 <div className="mt-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Start</span>
                        <span>Target</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${quarterlyProgress}%` }}></div>
                    </div>
                 </div>
             )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Weekly Focus & Tasks */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Today's To-Do List Widget */}
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <Target className="text-accent-500" /> Today's Action Plan
                </h3>
                <DailyToDoList 
                    dateLabel="Today's Priorities"
                    dateKey={todayKey}
                    tasks={dailyTasks[todayKey] || []}
                    onAddTask={onAddTask}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onReorderTasks={onReorderTasks}
                    isCollapsible={false}
                />
            </div>

            {/* Weekly Targets */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ArrowUp className="text-primary-500" /> Weekly Targets
                    </h3>
                    <span className="text-sm text-slate-500">{weeklyGoals.filter(g => g.status === GoalStatus.Completed).length}/{weeklyGoals.length} Done</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weeklyGoals.length > 0 ? (
                        weeklyGoals.map(goal => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onToggleStatus={onToggleStatus} 
                                onClick={onGoalClick} 
                                parentTitle={goal.parentId ? parentMap[goal.parentId] : undefined}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 p-8 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500">
                            <p>No weekly targets set.</p>
                            <button className="text-primary-400 mt-2 hover:underline">Add one now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Visualization & Stats */}
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-slate-300 font-medium mb-4">Activity Trend</h4>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                itemStyle={{ color: '#22d3ee' }}
                            />
                            <Area type="monotone" dataKey="progress" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-slate-300 font-medium mb-4">Overall Completion</h4>
                <div className="h-48 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-bold text-white">{completedCount}</span>
                        <span className="text-xs text-slate-500">Done</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};