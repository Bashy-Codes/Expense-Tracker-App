import { useState, useEffect } from 'react';
import { storage } from '../lib/localStorage';
import { Expense } from '../types';
import { format, isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setExpenses(storage.getExpenses());
  }, []);

  const addExpense = (expense: Expense) => {
    storage.saveExpense(expense);
    setExpenses(storage.getExpenses());
  };

  const updateExpense = (expense: Expense) => {
    storage.updateExpense(expense);
    setExpenses(storage.getExpenses());
  };

  const deleteExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpenses(storage.getExpenses());
  };

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      
      const matchesDateRange = !dateRange[0] || !dateRange[1] || 
        isWithinInterval(new Date(expense.date), {
          start: dateRange[0],
          end: dateRange[1]
        });

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  };

  const getTotalExpenses = (period: 'daily' | 'monthly' | 'yearly' = 'monthly') => {
    const now = new Date();
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (period) {
        case 'daily':
          return format(expenseDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        case 'monthly':
          return isWithinInterval(expenseDate, {
            start: startOfMonth(now),
            end: endOfMonth(now)
          });
        case 'yearly':
          return isWithinInterval(expenseDate, {
            start: startOfYear(now),
            end: endOfYear(now)
          });
      }
    });
    
    return filtered.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return {
    expenses: getFilteredExpenses(),
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    selectedCategory,
    setSelectedCategory
  };
}
