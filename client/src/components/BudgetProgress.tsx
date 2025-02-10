import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Budget } from "../types";
import { motion } from "framer-motion";
import { Wallet, TrendingDown, AlertTriangle, Edit2 } from "lucide-react";

interface BudgetProgressProps {
  budget: Budget | null;
  onUpdateBudget: (budget: Budget) => void;
  progress: number;
  remaining: number;
}

export function BudgetProgress({
  budget,
  onUpdateBudget,
  progress,
  remaining,
}: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(budget?.amount.toString() || "");
  const [period, setPeriod] = useState<"monthly" | "yearly">(
    budget?.period || "monthly"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    try {
      onUpdateBudget({
        amount: parsedAmount,
        period,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update budget");
    }
  };

  const handleEdit = () => {
    setAmount(budget?.amount.toString() || "");
    setPeriod(budget?.period || "monthly");
    setIsEditing(true);
    setError(null);
  };

  const getProgressColor = () => {
    if (progress >= 90) return "bg-destructive";
    if (progress >= 75) return "bg-orange-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const BudgetForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Budget Amount
            </label>
            <Input
              ref={inputRef}
              autoFocus
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
              className="flex-1"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Period</label>
            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as "monthly" | "yearly")
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit">{budget ? "Update" : "Set"} Budget</Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border border-primary/10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Budget Overview</CardTitle>
          </div>
          {budget && !isEditing && (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {budget && !isEditing ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {budget.period === "yearly" ? "Yearly" : "Monthly"} Budget:
                    ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown
                    className={`h-4 w-4 ${
                      remaining > 0 ? "text-emerald-500" : "text-destructive"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      remaining > 0 ? "text-emerald-500" : "text-destructive"
                    }`}
                  >
                    Remaining: ${remaining.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Progress
                  value={progress}
                  className={`h-3 ${getProgressColor()}`}
                />
                <div className="flex justify-between text-sm">
                  <p
                    className={`font-medium ${
                      progress >= 90
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {progress >= 90 && (
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                    )}
                    {progress >= 100
                      ? "You've exceeded your budget!"
                      : `${progress.toFixed(1)}% of budget used`}
                  </p>
                  <span className="text-muted-foreground">
                    ${(budget.amount * (progress / 100)).toFixed(2)} spent
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <BudgetForm />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
