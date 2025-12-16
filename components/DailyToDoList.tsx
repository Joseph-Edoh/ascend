import React, { useState } from 'react';
import { DailyTask } from '../types';
import { Plus, GripVertical, Check, Trash2, ChevronDown, ChevronRight, Clock } from 'lucide-react';

interface DailyToDoListProps {
  dateLabel: string; // e.g., "Monday, Jan 01"
  dateKey: string;   // YYYY-MM-DD
  tasks: DailyTask[];
  onAddTask: (dateKey: string, text: string, time?: string) => void;
  onToggleTask: (dateKey: string, taskId: string) => void;
  onDeleteTask: (dateKey: string, taskId: string) => void;
  onReorderTasks: (dateKey: string, startIndex: number, endIndex: number) => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  droppableId?: string;
}

export const DailyToDoList: React.FC<DailyToDoListProps> = ({
  dateLabel,
  dateKey,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onReorderTasks,
  isCollapsible = true,
  defaultExpanded = true,
  droppableId,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(dateKey, newTaskText.trim(), newTaskTime);
      setNewTaskText('');
      setNewTaskTime('');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Optional: Add visual cue logic here
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    if (draggedItemIndex !== dropIndex) {
      onReorderTasks(dateKey, draggedItemIndex, dropIndex);
    }
    setDraggedItemIndex(null);
  };

  return (
    <div 
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full"
      data-droppable-id={droppableId || dateKey} // For external identification
    >
      <div 
        className="p-3 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center cursor-pointer select-none"
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-slate-200 text-sm">{dateLabel}</h3>
        {isCollapsible && (
          <button className="text-slate-500 hover:text-slate-300">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="flex-1 flex flex-col min-h-[200px]">
          {/* Task List */}
          <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[400px] custom-scrollbar">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`group flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  task.completed 
                    ? 'bg-slate-900/30 border-slate-800 opacity-60' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                } ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-primary-500/50' : ''}`}
              >
                <div className="cursor-grab text-slate-600 hover:text-slate-400 active:cursor-grabbing">
                  <GripVertical size={14} />
                </div>
                
                <button
                  onClick={() => onToggleTask(dateKey, task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'border-slate-600 hover:border-primary-400'
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        {task.time && (
                            <span className="flex-shrink-0 text-[10px] font-mono font-medium text-primary-400 bg-primary-950/50 border border-primary-900/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Clock size={10} /> {task.time}
                            </span>
                        )}
                        <span className={`text-sm break-words ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.text}
                        </span>
                    </div>
                </div>

                <button
                  onClick={() => onDeleteTask(dateKey, task.id)}
                  className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-6 text-slate-600 text-xs italic">
                No tasks yet. Drag items here or add below.
              </div>
            )}
          </div>

          {/* Add Task Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/30">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-primary-500 focus:text-white"
                aria-label="Task Time"
              />
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add task..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500 min-w-0"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="bg-primary-600 hover:bg-primary-500 text-white p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};