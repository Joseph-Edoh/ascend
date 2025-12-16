import React, { useState } from 'react';
import { YearAspirations, PlannerItem, PlannerPriority, PlannerStatus } from '../types';
import { Plus, Trash2, ArrowUpDown, Calendar, User, AlignLeft, CheckCircle2, Clock, AlertOctagon } from 'lucide-react';

interface BlueprintProps {
  aspirations: YearAspirations;
  onAspirationChange: (field: keyof YearAspirations, value: string) => void;
  items: PlannerItem[];
  onAddItem: (item: Omit<PlannerItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<PlannerItem>) => void;
  onDeleteItem: (id: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Books to Read',
  'Skills to Learn/Sharpen',
  'Retreats to Observe',
  'Other'
];

export const Blueprint: React.FC<BlueprintProps> = ({
  aspirations,
  onAspirationChange,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [sortField, setSortField] = useState<keyof PlannerItem>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // New Item Form State
  const [newItem, setNewItem] = useState({
    item: '',
    category: DEFAULT_CATEGORIES[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 'Medium' as PlannerPriority,
    executioner: 'Me',
    status: 'In Progress' as PlannerStatus
  });

  const handleSort = (field: keyof PlannerItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.item) return;
    onAddItem(newItem);
    setNewItem(prev => ({ ...prev, item: '' })); // Reset item name only
  };

  const statusColor = (status: PlannerStatus) => {
    switch (status) {
      case 'Done': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Suspended': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  const priorityColor = (priority: PlannerPriority) => {
    switch (priority) {
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-slate-400';
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* SECTION A: General Year Planner */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Calendar className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">2026 Blueprint</h2>
            <p className="text-slate-400 text-sm">Define your north star for the year.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AspirationCard 
            title="What I want to Do" 
            placeholder="Travel to Japan, Run a Marathon..." 
            value={aspirations.do}
            onChange={(v) => onAspirationChange('do', v)}
            gradient="from-blue-500/10 to-cyan-500/5"
            borderColor="focus-within:border-blue-500/50"
          />
          <AspirationCard 
            title="What I want to Have" 
            placeholder="Financial freedom, A new home studio..." 
            value={aspirations.have}
            onChange={(v) => onAspirationChange('have', v)}
            gradient="from-purple-500/10 to-pink-500/5"
            borderColor="focus-within:border-purple-500/50"
          />
          <AspirationCard 
            title="What I want to Be" 
            placeholder="A compassionate leader, A master architect..." 
            value={aspirations.be}
            onChange={(v) => onAspirationChange('be', v)}
            gradient="from-amber-500/10 to-orange-500/5"
            borderColor="focus-within:border-amber-500/50"
          />
          <AspirationCard 
            title="How I want to Live" 
            placeholder="With intention, Surrounded by nature..." 
            value={aspirations.live}
            onChange={(v) => onAspirationChange('live', v)}
            gradient="from-emerald-500/10 to-teal-500/5"
            borderColor="focus-within:border-emerald-500/50"
          />
        </div>
      </section>

      {/* SECTION B: Core Development Table */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <AlignLeft className="text-primary-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Core Development Action Plan</h2>
            <p className="text-slate-400 text-sm">Track key initiatives, books, skills, and retreats.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-200 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <SortableHeader label="Item" field="item" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Category" field="category" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Start" field="startDate" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="End" field="endDate" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Priority" field="priority" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-6 py-4">Exec.</th>
                  <SortableHeader label="Status" field="status" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{item.item}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.startDate}</td>
                    <td className="px-6 py-4">{item.endDate || '-'}</td>
                    <td className={`px-6 py-4 font-bold ${priorityColor(item.priority)}`}>{item.priority}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                         <User size={14} /> {item.executioner}
                    </td>
                    <td className="px-6 py-4">
                        <select 
                            value={item.status}
                            onChange={(e) => onUpdateItem(item.id, { status: e.target.value as PlannerStatus })}
                            className={`bg-transparent border rounded px-2 py-1 text-xs font-medium cursor-pointer focus:outline-none ${statusColor(item.status)}`}
                        >
                            <option value="In Progress" className="bg-slate-900 text-blue-400">In Progress</option>
                            <option value="Done" className="bg-slate-900 text-green-400">Done</option>
                            <option value="Suspended" className="bg-slate-900 text-red-400">Suspended</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteItem(item.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedItems.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500 italic">
                            No items added yet. Start planning below.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Item Row */}
          <div className="bg-slate-950 p-4 border-t border-slate-800">
             <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-3">
                    <label className="block text-xs text-slate-500 mb-1">Item to execute</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Read 'Atomic Habits'" 
                        value={newItem.item}
                        onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none text-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Category</label>
                    <select 
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none text-white"
                    >
                        {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Start / End</label>
                    <div className="flex gap-1">
                        <input 
                            type="date" 
                            required
                            value={newItem.startDate}
                            onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-1 py-2 text-xs focus:border-primary-500 focus:outline-none text-white"
                        />
                        <input 
                            type="date" 
                            value={newItem.endDate}
                            onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-1 py-2 text-xs focus:border-primary-500 focus:outline-none text-white"
                        />
                    </div>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs text-slate-500 mb-1">Priority</label>
                    <select 
                        value={newItem.priority}
                        onChange={(e) => setNewItem({...newItem, priority: e.target.value as PlannerPriority})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm focus:border-primary-500 focus:outline-none text-white"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Executioner</label>
                    <input 
                        type="text" 
                        value={newItem.executioner}
                        onChange={(e) => setNewItem({...newItem, executioner: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:outline-none text-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <button 
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
};

const AspirationCard = ({ title, placeholder, value, onChange, gradient, borderColor }: any) => (
  <div className={`group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 transition-all hover:shadow-lg ${borderColor} border-transparent bg-gradient-to-br ${gradient}`}>
    <h3 className="text-lg font-bold text-slate-200 mb-3">{title}</h3>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 resize-none transition-all"
    />
  </div>
);

const SortableHeader = ({ label, field, currentSort, sortDirection, onSort }: any) => (
  <th 
    className="px-6 py-4 cursor-pointer hover:text-white transition-colors group select-none"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {label}
      <ArrowUpDown size={12} className={`transition-opacity ${currentSort === field ? 'opacity-100 text-primary-400' : 'opacity-20 group-hover:opacity-50'}`} />
    </div>
  </th>
);
