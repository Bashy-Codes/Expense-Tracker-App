import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense } from '../types';
import { DollarSign, TrendingUp, Calendar, ChartPieIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e'];

interface ExpenseStatsProps {
  expenses: Expense[];
  dailyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
}

export function ExpenseStats({
  expenses,
  dailyTotal,
  monthlyTotal,
  yearlyTotal
}: ExpenseStatsProps) {
  const getCategoryData = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const statsCards = [
    {
      title: "Daily Total",
      value: dailyTotal,
      icon: DollarSign,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50"
    },
    {
      title: "Monthly Total",
      value: monthlyTotal,
      icon: Calendar,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/50"
    },
    {
      title: "Yearly Total",
      value: yearlyTotal,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${card.bgColor}`}>
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${card.value.toFixed(2)}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div
        className="md:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <ChartPieIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-medium">Expense Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell 
                        key={entry.name} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${(value as number).toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}