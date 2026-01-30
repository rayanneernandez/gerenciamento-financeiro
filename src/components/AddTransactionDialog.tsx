import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Transaction, TransactionType, Category, CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

interface AddTransactionDialogProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export function AddTransactionDialog({ onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | ''>('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category: category as Category,
      date: new Date(),
    });

    setDescription('');
    setAmount('');
    setCategory('');
    setOpen(false);
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary text-background font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 rounded-xl px-6">
          <Plus className="h-5 w-5" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-white/10 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Nova Transação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-2xl">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300",
                type === 'expense' 
                  ? "gradient-expense text-white shadow-lg shadow-[hsl(var(--expense))]/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <TrendingDown className="h-5 w-5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300",
                type === 'income' 
                  ? "gradient-income text-background shadow-lg shadow-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <TrendingUp className="h-5 w-5" />
              Receita
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-muted-foreground">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Almoço no restaurante"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground">Valor</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pl-12 bg-secondary/50 border-white/10 rounded-xl text-foreground text-lg font-semibold placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">Categoria</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="focus:bg-white/10">
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{CATEGORIES[cat].icon}</span>
                        <span>{CATEGORIES[cat].name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className={cn(
              "w-full h-14 font-bold text-lg rounded-xl transition-all duration-300",
              type === 'expense' 
                ? "gradient-expense text-white shadow-lg shadow-[hsl(var(--expense))]/30 hover:shadow-[hsl(var(--expense))]/50" 
                : "gradient-income text-background shadow-lg shadow-primary/30 hover:shadow-primary/50"
            )}
            disabled={!description || !amount || !category}
          >
            Adicionar {type === 'expense' ? 'Despesa' : 'Receita'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
