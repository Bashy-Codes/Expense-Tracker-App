import { Expense, Budget, ExpenseCategory, DEFAULT_CATEGORIES } from '../types';

export const STORAGE_KEYS = {
  EXPENSES: 'bashy-expenses',
  BUDGET: 'bashy-budget',
  CATEGORIES: 'bashy-categories',
  THEME: 'bashy-theme'
} as const;

export const storage = {
  STORAGE_KEYS,

  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  saveExpense: (expense: Expense) => {
    const expenses = storage.getExpenses();
    expenses.push(expense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  updateExpense: (expense: Expense) => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      expenses[index] = expense;
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  },

  deleteExpense: (id: string) => {
    const expenses = storage.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  },

  getBudget: (): Budget | null => {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return data ? JSON.parse(data) : null;
  },

  saveBudget: (budget: Budget) => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  },

  getCategories: (): ExpenseCategory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },

  saveCategory: (category: ExpenseCategory) => {
    const categories = storage.getCategories();
    categories.push(category);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  deleteCategory: (id: string) => {
    const categories = storage.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  }
};