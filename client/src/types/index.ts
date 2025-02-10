export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  amount: number;
  period: 'monthly' | 'yearly';
}

export type ExpenseCategory = {
  id: string;
  name: string;
  isCustom?: boolean;
};

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Transportation' },
  { id: '3', name: 'Entertainment' },
  { id: '4', name: 'Shopping' },
  { id: '5', name: 'Bills' },
  { id: '6', name: 'Healthcare' },
  { id: '7', name: 'Travel' }
];
