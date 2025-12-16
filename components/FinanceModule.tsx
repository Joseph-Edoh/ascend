import React from 'react';
import { FINANCE_CATEGORIES, MONTH_NAMES } from '../types';
import { Wallet, TrendingUp, PieChart, Info } from 'lucide-react';

interface FinanceModuleProps {
  monthlyIncome: number[];
  onIncomeChange: (monthIndex: number, value: number) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ monthlyIncome, onIncomeChange }) => {
  
  // Calculate Totals
  const totalIncomeYTD = monthlyIncome.reduce((sum, val) => sum + val, 0);
  
  const categoryTotals = FINANCE_CATEGORIES.map(cat => ({
    ...cat,
    total: totalIncomeYTD * cat.percentage
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-full space-y-12 animate-in fade-in duration-500">
      
      {/* SECTION 1: YTD Summary */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Wallet className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
            <p className="text-slate-400 text-sm">Year-to-Date Allocation Summary</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Income Card */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} /></div>
             <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Income</p>
             <p className="text-2xl font-bold text-white">{formatCurrency(totalIncomeYTD)}</p>
             <p className="text-xs text-slate-500 mt-2">12 Month Projection</p>
          </div>

          {/* Category Cards */}
          {categoryTotals.map((cat) => (
             <div key={cat.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-900 transition-colors">
                 <div>
                    <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs font-bold uppercase tracking-wider ${cat.color}`}>{cat.label}</p>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                            {cat.percentage * 100}%
                        </span>
                    </div>
                    <p className="text-xl font-bold text-slate-200">{formatCurrency(cat.total)}</p>
                 </div>
                 <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                     <div className={`h-full ${cat.color.replace('text-', 'bg-')}`} style={{ width: '100%' }}></div>
                 </div>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: 12-Month Ledger */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <PieChart className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Monthly Allocation Ledger</h2>
            <p className="text-slate-400 text-sm">Input your total monthly income to see the automatic breakdown.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
          <div className="overflow-x-auto pb-2 custom-scrollbar">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950 text-slate-200">
                   <tr>
                      <th className="sticky left-0 z-10 bg-slate-950 p-4 border-b border-r border-slate-800 min-w-[200px] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.5)]">
                          Category / Month
                      </th>
                      {MONTH_NAMES.map((month) => (
                          <th key={month} className="p-4 border-b border-slate-800 font-medium text-center min-w-[120px]">
                              {month}
                          </th>
                      ))}
                      <th className="p-4 border-b border-l border-slate-800 font-bold text-center min-w-[140px] bg-slate-950/50">
                          Total
                      </th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                   {/* Income Input Row */}
                   <tr className="bg-slate-800/30">
                      <td className="sticky left-0 z-10 bg-slate-900 p-4 border-r border-slate-800 font-bold text-white shadow-[4px_0_12px_-4px_rgba(0,0,0,0.5)]">
                          Total Income
                      </td>
                      {monthlyIncome.map((income, idx) => (
                          <td key={idx} className="p-2 text-center">
                              <div className="relative group">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500">₦</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={income || ''}
                                    onChange={(e) => onIncomeChange(idx, parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-6 pr-2 text-right text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono"
                                    placeholder="0"
                                />
                              </div>
                          </td>
                      ))}
                      <td className="p-4 text-center font-bold text-white border-l border-slate-800 bg-slate-900/30 font-mono">
                          {formatCurrency(totalIncomeYTD)}
                      </td>
                   </tr>

                   {/* Calculated Category Rows */}
                   {FINANCE_CATEGORIES.map((cat) => (
                       <tr key={cat.id} className="hover:bg-slate-800/20 transition-colors">
                           <td className="sticky left-0 z-10 bg-slate-950 p-4 border-r border-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.5)]">
                               <div className="flex flex-col">
                                   <span className={`font-medium ${cat.color}`}>{cat.label}</span>
                                   <span className="text-[10px] text-slate-500">Fixed Allocation: {cat.percentage * 100}%</span>
                               </div>
                           </td>
                           {monthlyIncome.map((income, idx) => (
                               <td key={`${cat.id}-${idx}`} className="p-4 text-right text-slate-300 font-mono text-xs">
                                   {income > 0 ? formatCurrency(income * cat.percentage) : '-'}
                               </td>
                           ))}
                           <td className={`p-4 text-right font-bold border-l border-slate-800 bg-slate-900/30 font-mono ${cat.color}`}>
                               {formatCurrency(totalIncomeYTD * cat.percentage)}
                           </td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-slate-500 bg-slate-950/80 px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-20">
              <Info size={12} />
              <span>Scroll horizontally to view all months</span>
          </div>
        </div>
      </section>
    </div>
  );
};