import React, { useState } from 'react';
import { DailyToDoList } from './DailyToDoList';
import { DailyTask, PlannerItem } from '../types';
import { ChevronLeft, ChevronRight, CalendarDays, GripHorizontal } from 'lucide-react';

interface WeeklyPlannerProps {
  dailyTasks: Record<string, DailyTask[]>;
  plannerItems: PlannerItem[];
  onAddTask: (dateKey: string, text: string, time?: string) => void;
  onToggleTask: (dateKey: string, taskId: string) => void;
  onDeleteTask: (dateKey: string, taskId: string) => void;
  onReorderTasks: (dateKey: string, startIndex: number, endIndex: number) => void;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  dailyTasks,
  plannerItems,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onReorderTasks,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Helper to get dates for current week
  const getWeekDates = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    // Adjust to make Monday first day (optional, let's stick to Monday start)
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    const monday = new Date(today.setDate(diff + (offset * 7)));
    
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  const formatDateLabel = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  };

  const weekDates = getWeekDates(weekOffset);
  const activePlannerItems = plannerItems.filter(item => item.status === 'In Progress');

  const handleDragStart = (e: React.DragEvent, text: string) => {
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropOnDay = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      onAddTask(dateKey, text);
    }
  };

  const handleDragOverDay = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-full h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <CalendarDays className="text-orange-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Weekly Planner</h2>
            <p className="text-slate-400 text-sm">Allocate action items to specific days.</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 font-medium text-slate-200 min-w-[150px] text-center select-none">
            {formatDateLabel(weekDates[0])} - {formatDateLabel(weekDates[6])}
          </span>
          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Calendar Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20 lg:pb-0">
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date);
            const isToday = formatDateKey(new Date()) === dateKey;
            
            return (
              <div 
                key={dateKey} 
                className={`flex flex-col rounded-xl transition-colors ${isToday ? 'ring-2 ring-primary-500/50' : ''}`}
                onDragOver={handleDragOverDay}
                onDrop={(e) => handleDropOnDay(e, dateKey)}
              >
                <DailyToDoList
                  dateLabel={isToday ? "Today" : formatDateLabel(date)}
                  dateKey={dateKey}
                  tasks={dailyTasks[dateKey] || []}
                  onAddTask={onAddTask}
                  onToggleTask={onToggleTask}
                  onDeleteTask={onDeleteTask}
                  onReorderTasks={onReorderTasks}
                  droppableId={dateKey}
                  defaultExpanded={true}
                />
              </div>
            );
          })}
        </div>

        {/* Blueprint Side Panel */}
        <div className="w-full lg:w-80 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-fit lg:h-full lg:sticky lg:top-4 max-h-[500px] lg:max-h-[calc(100vh-100px)]">
          <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
            <GripHorizontal size={18} /> Action Items Pool
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Drag these items onto a day to schedule them.
          </p>
          
          <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
            {activePlannerItems.length > 0 ? (
                activePlannerItems.map(item => (
                <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.item)}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors group"
                >
                    <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{item.category}</span>
                    <span className={`text-[10px] uppercase font-bold ${
                        item.priority === 'High' ? 'text-orange-400' : 
                        item.priority === 'Medium' ? 'text-yellow-400' : 'text-slate-500'
                    }`}>{item.priority}</span>
                    </div>
                    <p className="text-sm text-slate-200">{item.item}</p>
                    <p className="text-[10px] text-slate-500 mt-2">Due: {item.endDate || 'N/A'}</p>
                </div>
                ))
            ) : (
                <div className="text-center py-8 text-slate-600 italic text-sm">
                    No active action items found in Blueprint.
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};