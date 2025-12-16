import React, { useState } from 'react';
import { Timeframe, Goal, GoalStatus } from '../types';
import { generateGoalBreakdown } from '../services/geminiService';
import { X, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status' | 'progress'>) => void;
  potentialParents: Goal[];
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onAddGoal, potentialParents }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.Weekly);
  const [parentId, setParentId] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal({
      title,
      description,
      timeframe,
      parentId: parentId || undefined,
    });
    // Reset
    setTitle('');
    setDescription('');
    setTimeframe(Timeframe.Weekly);
    setParentId('');
    setAiSuggestion(null);
    onClose();
  };

  const handleAiAssist = async () => {
    if (!title) return;
    setIsGenerating(true);
    const result = await generateGoalBreakdown(title, timeframe);
    setIsGenerating(false);

    if (result) {
        setTitle(result.title);
        setDescription(result.description);
        setAiSuggestion(`AI Suggestion: I've refined your goal and prepared ${result.subGoals.length} sub-goals. (For this demo, we'll just update the current form, but in a full app, we'd batch create sub-goals).`);
    }
  };

  // Filter parents to only allow linking to higher timeframes
  const allowedParents = potentialParents.filter(p => {
    const order = [Timeframe.Weekly, Timeframe.Monthly, Timeframe.Quarterly, Timeframe.Biannual, Timeframe.Yearly];
    return order.indexOf(p.timeframe) > order.indexOf(timeframe);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <h2 className="text-xl font-bold text-white">Set New Target</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Title & AI Input */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Goal Title</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Run a Marathon"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                        required
                    />
                    <button 
                        type="button"
                        onClick={handleAiAssist}
                        disabled={!title || isGenerating}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/50 p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enhance with AI"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    </button>
                </div>
                {aiSuggestion && <p className="text-xs text-green-400 mt-2">{aiSuggestion}</p>}
            </div>

            {/* Timeframe */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Time Horizon</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {Object.values(Timeframe).map((tf) => (
                        <button
                            key={tf}
                            type="button"
                            onClick={() => setTimeframe(tf)}
                            className={`px-2 py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                                timeframe === tf 
                                ? 'bg-primary-600 text-white border-primary-500' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Parent Goal Linking */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <LinkIcon size={14} /> Link to Higher Goal (Optional)
                </label>
                <select 
                    value={parentId}
                    onChange={e => setParentId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 appearance-none"
                    disabled={allowedParents.length === 0}
                >
                    <option value="">-- No Parent Goal --</option>
                    {allowedParents.map(p => (
                        <option key={p.id} value={p.id}>
                            [{p.timeframe}] {p.title}
                        </option>
                    ))}
                </select>
                {allowedParents.length === 0 && (
                    <p className="text-xs text-slate-600 mt-1">Create higher-level goals first to enable linking.</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Why is this important? How will you achieve it?"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 h-24 resize-none"
                />
            </div>

            <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]"
            >
                Commit to Target
            </button>
        </form>
      </div>
    </div>
  );
};
