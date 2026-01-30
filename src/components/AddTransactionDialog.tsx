import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, TrendingUp, TrendingDown, Sparkles, Building2 } from 'lucide-react';
import { Transaction, TransactionType, Category, CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, Bank, BANKS } from '@/types/finance';
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
  const [bank, setBank] = useState<Bank | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<'single' | 'monthly' | 'installment'>('single');
  const [installments, setInstallments] = useState('2');
  const [isPaid, setIsPaid] = useState(true);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Atualiza o status padrão baseado na data
  useEffect(() => {
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Se data futura, padrão é não pago. Se hoje ou passado, padrão é pago.
    if (selectedDate > today) {
        setIsPaid(false);
    } else {
        setIsPaid(true);
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !date || !bank) return;

    // Fix: Criar data com horário meio-dia para evitar problemas de timezone
    const [year, month, day] = date.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day, 12, 0, 0);
    
    const numAmount = parseFloat(amount);
    const transactionsToAdd: Omit<Transaction, 'id'>[] = [];

    if (frequency === 'single') {
      transactionsToAdd.push({
        description,
        amount: numAmount,
        type,
        category: category as Category,
        bank: bank as Bank,
        date: baseDate,
        paid: isPaid
      });
    } else if (frequency === 'installment') {
      const numInstallments = parseInt(installments);
      // Valor da parcela é o valor total dividido ou o valor inserido?
      // Geralmente o usuário insere o valor da parcela. Vou assumir valor da parcela.
      
      for (let i = 0; i < numInstallments; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setMonth(baseDate.getMonth() + i);
        
        transactionsToAdd.push({
          description: `${description} (${i + 1}/${numInstallments})`,
          amount: numAmount,
          type,
          category: category as Category,
          bank: bank as Bank,
          date: nextDate,
          // Apenas a primeira parcela segue o switch (se data permitir), as futuras nascem pendentes
          paid: i === 0 ? isPaid : false
        });
      }
    } else if (frequency === 'monthly') {
      // Gera para 12 meses como "recorrente" fixa
      for (let i = 0; i < 12; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setMonth(baseDate.getMonth() + i);
        
        transactionsToAdd.push({
          description: i === 0 ? description : `${description} (Mensal)`,
          amount: numAmount,
          type,
          category: category as Category,
          bank: bank as Bank,
          date: nextDate,
          // Apenas o primeiro mês segue o switch
          paid: i === 0 ? isPaid : false
        });
      }
    }

    onAdd(transactionsToAdd as any);

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setBank('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setFrequency('single');
    setInstallments('2');
    setIsPaid(true);
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
      <DialogContent className="sm:max-w-md glass-card border-white/10 shadow-elevated max-h-[90vh] overflow-y-auto">
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
            <div className="flex items-center justify-between space-x-2 bg-secondary/30 p-4 rounded-xl border border-white/5">
              <Label htmlFor="paid-mode" className="text-foreground font-medium cursor-pointer">
                {type === 'expense' ? 'Já foi pago?' : 'Já foi recebido?'}
              </Label>
              <Switch
                id="paid-mode"
                checked={isPaid}
                onCheckedChange={setIsPaid}
              />
            </div>

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
              <Label htmlFor="frequency" className="text-muted-foreground">Frequência</Label>
              <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                <SelectTrigger className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="single" className="focus:bg-white/10">Única (Apenas esta)</SelectItem>
                  <SelectItem value="monthly" className="focus:bg-white/10">Mensal (Repetir por 12 meses)</SelectItem>
                  <SelectItem value="installment" className="focus:bg-white/10">Parcelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === 'installment' && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="installments" className="text-muted-foreground">Número de Parcelas</Label>
                <Input
                  id="installments"
                  type="number"
                  min="2"
                  max="48"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground">
                {frequency === 'installment' ? 'Valor da Parcela' : 'Valor'}
              </Label>
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
              <Label htmlFor="date" className="text-muted-foreground">
                {type === 'expense' ? 'Vencimento' : 'Data de Recebimento'}
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank" className="text-muted-foreground">Banco / Instituição</Label>
              <Select value={bank} onValueChange={(val) => setBank(val as Bank)}>
                <SelectTrigger className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 max-h-[300px]">
                  {BANKS.map((b) => (
                    <SelectItem key={b} value={b} className="focus:bg-white/10">
                      <span className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{b}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            disabled={!description || !amount || !category || !bank}
          >
            Adicionar {type === 'expense' ? 'Despesa' : 'Receita'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
