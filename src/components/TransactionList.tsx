import { Transaction, CATEGORIES } from '@/types/finance';
import { Trash2, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
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
        <div
          key={transaction.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-2xl",
            "glass-card hover:bg-white/5 transition-all duration-300 animate-fade-in group cursor-pointer"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${CATEGORIES[transaction.category].color}30, ${CATEGORIES[transaction.category].color}10)`,
                boxShadow: `0 0 20px ${CATEGORIES[transaction.category].color}20`
              }}
            >
              {CATEGORIES[transaction.category].icon}
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs">
                  {CATEGORIES[transaction.category].name}
                </span>
                <span>•</span>
                <span>{format(transaction.date, "d 'de' MMM", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={cn(
              "font-bold text-xl",
              transaction.type === 'income' ? 'text-gradient-income' : 'text-gradient-expense'
            )}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }}
              className="opacity-0 group-hover:opacity-100 p-3 rounded-xl hover:bg-[hsl(var(--expense))]/20 text-muted-foreground hover:text-[hsl(var(--expense))] transition-all duration-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
