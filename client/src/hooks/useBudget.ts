import { useState, useEffect } from 'react';
import { storage } from '../lib/localStorage';
import { Budget } from '../types';

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const savedBudget = storage.getBudget();
    if (savedBudget) {
      setBudget(savedBudget);
    }
  }, []);

  const updateBudget = (newBudget: Budget) => {
    if (newBudget.amount <= 0) {
      throw new Error('Budget amount must be greater than 0');
    }
    storage.saveBudget(newBudget);
    setBudget(newBudget);
  };

  const calculateProgress = (totalExpenses: number) => {
    if (!budget) return 0;
    return Math.min((totalExpenses / budget.amount) * 100, 100);
  };

  const getRemainingBudget = (totalExpenses: number) => {
    if (!budget) return 0;
    return Math.max(budget.amount - totalExpenses, 0);
  };

  const clearBudget = () => {
    localStorage.removeItem(storage.STORAGE_KEYS.BUDGET);
    setBudget(null);
  };

  return {
    budget,
    updateBudget,
    calculateProgress,
    getRemainingBudget,
    clearBudget
  };
}