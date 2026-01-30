import { Transaction, CATEGORIES, TransactionType, Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { Trash2, Receipt, Pencil, Sparkles, TrendingUp, TrendingDown, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
}

export function TransactionList({ transactions, onDelete, onUpdate }: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<TransactionType>('expense');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<Category | ''>('');
  const [editDate, setEditDate] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditType(transaction.type);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount.toString());
    setEditCategory(transaction.category);
    setEditDate(transaction.date.toISOString().split('T')[0]);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editDescription || !editAmount || !editCategory || !editDate) return;

    onUpdate(editingId, {
      description: editDescription,
      amount: parseFloat(editAmount),
      type: editType,
      category: editCategory as Category,
      date: new Date(editDate + 'T12:00:00'),
    });

    setEditingId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center mb-6 animate-float">
          <Receipt className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma transação</h3>
        <p className="text-muted-foreground max-w-[250px]">
          Adicione sua primeira transação para começar a controlar suas finanças
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.slice(0, 10).map((transaction, index) => (
        <Dialog key={transaction.id} open={editingId === transaction.id} onOpenChange={(open) => !open && setEditingId(null)}>
          <div
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl gap-4 sm:gap-0",
              "glass-card hover:bg-white/5 transition-all duration-300 animate-fade-in group cursor-pointer relative"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl relative overflow-hidden flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${CATEGORIES[transaction.category].color}30, ${CATEGORIES[transaction.category].color}10)`,
                  boxShadow: `0 0 20px ${CATEGORIES[transaction.category].color}20`
                }}
              >
                {CATEGORIES[transaction.category].icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-base sm:text-lg truncate">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs whitespace-nowrap">
                    {CATEGORIES[transaction.category].name}
                  </span>
                  <span>•</span>
                  <span className="whitespace-nowrap">{format(transaction.date, "d 'de' MMM", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const isPaid = transaction.paid ?? (transaction.date <= new Date());
                  onUpdate(transaction.id, { paid: !isPaid });
                }}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  (transaction.paid ?? (transaction.date <= new Date()))
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
                title={(transaction.paid ?? (transaction.date <= new Date())) ? "Marcar como não pago" : "Marcar como pago"}
              >
                {(transaction.paid ?? (transaction.date <= new Date())) ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>

              <span className={cn(
                "font-bold text-lg sm:text-xl whitespace-nowrap",
                transaction.type === 'income' ? 'text-gradient-income' : 'text-gradient-expense',
                !(transaction.paid ?? (transaction.date <= new Date())) && "opacity-50"
              )}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DialogTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditClick(transaction); }}
                    className="p-3 rounded-xl hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }}
                  className="p-3 rounded-xl hover:bg-[hsl(var(--expense))]/20 text-muted-foreground hover:text-[hsl(var(--expense))] transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <DialogContent className="sm:max-w-md glass-card border-white/10 shadow-elevated">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Editar Transação
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleUpdate} className="space-y-6 pt-4">
              <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setEditType('expense'); setEditCategory(''); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300",
                    editType === 'expense' 
                      ? "gradient-expense text-white shadow-lg shadow-[hsl(var(--expense))]/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <TrendingDown className="h-5 w-5" />
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => { setEditType('income'); setEditCategory(''); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300",
                    editType === 'income' 
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
                  <Label htmlFor="edit-description" className="text-muted-foreground">Descrição</Label>
                  <Input
                    id="edit-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-amount" className="text-muted-foreground">Valor</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R$</span>
                    <Input
                      id="edit-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="h-14 pl-12 bg-secondary/50 border-white/10 rounded-xl text-foreground text-lg font-semibold placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date" className="text-muted-foreground">
                    {editType === 'expense' ? 'Vencimento' : 'Data de Recebimento'}
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-muted-foreground">Categoria</Label>
                  <Select value={editCategory} onValueChange={(val) => setEditCategory(val as Category)}>
                    <SelectTrigger className="h-14 bg-secondary/50 border-white/10 rounded-xl text-foreground focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {(editType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
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
                  editType === 'expense' 
                    ? "gradient-expense text-white shadow-lg shadow-[hsl(var(--expense))]/30 hover:shadow-[hsl(var(--expense))]/50" 
                    : "gradient-income text-background shadow-lg shadow-primary/30 hover:shadow-primary/50"
                )}
              >
                Salvar Alterações
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
