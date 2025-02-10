import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Expense, ExpenseCategory } from '../types';
import { CalendarIcon, Plus, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expenseSchema = z.object({
  id: z.string(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Description is required'),
  date: z.string()
});

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  expense?: Expense;
  categories: ExpenseCategory[];
  onAddCategory: (category: ExpenseCategory) => void;
}

export function ExpenseForm({
  onSubmit,
  expense,
  categories,
  onAddCategory
}: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const defaultCategory = categories[0]?.name || '';

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense || {
      id: crypto.randomUUID(),
      amount: 0,
      category: defaultCategory,
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const handleSubmit = (data: Expense) => {
    onSubmit(data);
    if (!expense) {
      form.reset({
        id: crypto.randomUUID(),
        amount: 0,
        category: defaultCategory,
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    }
    setOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const category = {
        id: crypto.randomUUID(),
        name: newCategory.trim(),
        isCustom: true
      };
      onAddCategory(category);
      setNewCategory('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          {expense ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {expense ? 'Edit' : 'Add'} Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit' : 'Add'} Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Input
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddCategory}>Add</Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(field.value), 'PP')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => field.onChange(format(date!, 'yyyy-MM-dd'))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {expense ? 'Update' : 'Add'} Expense
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}