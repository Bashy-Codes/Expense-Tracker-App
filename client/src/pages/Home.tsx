import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseStats } from '../components/ExpenseStats';
import { BudgetProgress } from '../components/BudgetProgress';
import { SearchBar } from '../components/SearchBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { useState } from 'react';
import { ExpenseCategory } from '../types';
import { storage } from '../lib/localStorage';
import { Wallet, ChartPieIcon, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const {
    expenses,
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
  } = useExpenses();

  const {
    budget,
    updateBudget,
    calculateProgress,
    getRemainingBudget
  } = useBudget();

  const [categories, setCategories] = useState<ExpenseCategory[]>(
    storage.getCategories()
  );

  const handleAddCategory = (category: ExpenseCategory) => {
    storage.saveCategory(category);
    setCategories(storage.getCategories());
  };

  const monthlyTotal = getTotalExpenses('monthly');
  const progress = calculateProgress(monthlyTotal);
  const remaining = getRemainingBudget(monthlyTotal);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary/90 via-primary to-primary/90 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/15 [mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4 py-12">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Wallet className="h-12 w-12 text-white" />
              <h1 className="text-4xl font-bold text-white">
                Bashy Expense Tracker
              </h1>
            </motion.div>
            <motion.p 
              className="text-white/90 max-w-xl text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Track your expenses effortlessly with beautiful visualizations and smart budgeting tools
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="grid gap-8">
          <BudgetProgress
            budget={budget}
            onUpdateBudget={updateBudget}
            progress={progress}
            remaining={remaining}
          />

          <ExpenseStats
            expenses={expenses}
            dailyTotal={getTotalExpenses('daily')}
            monthlyTotal={monthlyTotal}
            yearlyTotal={getTotalExpenses('yearly')}
          />

          <motion.div 
            className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="w-full md:w-auto space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Receipt className="h-6 w-6 text-primary" />
                  Add New Expense
                </h2>
                <ExpenseForm
                  onSubmit={addExpense}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                />
              </div>
              <div className="w-full md:w-auto flex-1">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <ChartPieIcon className="h-6 w-6 text-primary" />
                  Filter Expenses
                </h2>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  categories={categories}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ExpenseList
              expenses={expenses}
              onUpdateExpense={updateExpense}
              onDeleteExpense={deleteExpense}
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}