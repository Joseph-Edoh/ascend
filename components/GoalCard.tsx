import React from 'react';
import { Goal, GoalStatus, Timeframe } from '../types';
import { CheckCircle2, Circle, Clock, ArrowUpRight, ChevronRight } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onToggleStatus: (id: string) => void;
  onClick: (goal: Goal) => void;
  parentTitle?: string;
}

const timeframeColors: Record<Timeframe, string> = {
  [Timeframe.Weekly]: 'border-l-primary-400',
  [Timeframe.Monthly]: 'border-l-accent-400',
  [Timeframe.Quarterly]: 'border-l-blue-500',
  [Timeframe.Biannual]: 'border-l-indigo-500',
  [Timeframe.Yearly]: 'border-l-purple-500',
};

const timeframeBadgeColors: Record<Timeframe, string> = {
  [Timeframe.Weekly]: 'bg-primary-500/10 text-primary-400',
  [Timeframe.Monthly]: 'bg-accent-500/10 text-accent-400',
  [Timeframe.Quarterly]: 'bg-blue-500/10 text-blue-400',
  [Timeframe.Biannual]: 'bg-indigo-500/10 text-indigo-400',
  [Timeframe.Yearly]: 'bg-purple-500/10 text-purple-400',
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onToggleStatus, onClick, parentTitle }) => {
  const isCompleted = goal.status === GoalStatus.Completed;

  return (
    <div 
      className={`group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-slate-900/50 cursor-pointer ${timeframeColors[goal.timeframe]} border-l-4`}
      onClick={() => onClick(goal)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${timeframeBadgeColors[goal.timeframe]}`}>
                {goal.timeframe}
            </span>
            {parentTitle && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <ArrowUpRight size={12} /> linked to {parentTitle.substring(0, 15)}...
                </span>
            )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(goal.id);
          }}
          className={`transition-colors ${isCompleted ? 'text-accent-400' : 'text-slate-600 hover:text-slate-400'}`}
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
      </div>

      <h3 className={`text-lg font-semibold mb-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
        {goal.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
        {goal.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${isCompleted ? 'bg-accent-500' : 'bg-primary-500'}`} 
                    style={{ width: `${goal.progress}%` }}
                />
            </div>
            <span className="text-xs text-slate-400">{goal.progress}%</span>
        </div>
        
        {goal.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {new Date(goal.dueDate).toLocaleDateString()}
            </div>
        )}
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="text-slate-500" />
      </div>
    </div>
  );
};
