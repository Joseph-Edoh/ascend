export enum Timeframe {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Biannual = 'Biannual',
  Yearly = 'Yearly',
}

export enum GoalStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: Timeframe;
  status: GoalStatus;
  progress: number; // 0-100
  parentId?: string; // ID of the higher-level goal
  createdAt: number;
  dueDate?: number;
}

export interface UserStats {
  momentumScore: number;
  streakDays: number;
  completedGoals: number;
  totalGoals: number;
}

// Blueprint Types
export interface YearAspirations {
  do: string;
  have: string;
  be: string;
  live: string;
}

export type PlannerStatus = 'In Progress' | 'Done' | 'Suspended';
export type PlannerPriority = 'High' | 'Medium' | 'Low';

export interface PlannerItem {
  id: string;
  item: string;
  category: string;
  startDate: string;
  endDate: string;
  priority: PlannerPriority;
  executioner: string;
  status: PlannerStatus;
}

// Finance Types
export interface MonthlyFinance {
  income: number;
}

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export interface FinanceCategoryConfig {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export const FINANCE_CATEGORIES: FinanceCategoryConfig[] = [
  { id: 'offering', label: 'Offering', percentage: 0.10, color: 'text-purple-400' },
  { id: 'saving', label: 'Saving', percentage: 0.30, color: 'text-blue-400' },
  { id: 'charity', label: 'Charity/Giving', percentage: 0.10, color: 'text-pink-400' },
  { id: 'investment', label: 'Investment', percentage: 0.20, color: 'text-green-400' },
  { id: 'needs', label: 'Needs/Daily', percentage: 0.30, color: 'text-slate-400' },
];

// Daily Planner Types
export interface DailyTask {
  id: string;
  text: string;
  time?: string; // Optional time string (HH:MM)
  completed: boolean;
  order: number;
}

export type DailyTasksMap = Record<string, DailyTask[]>; // Key: YYYY-MM-DD
