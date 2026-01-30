import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'income' | 'expense' | 'balance';
  delay?: number;
}

export function SummaryCard({ title, value, icon: Icon, variant, delay = 0 }: SummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 animate-slide-up hover-lift",
        "glass-card shadow-card",
        variant === 'income' && "hover:shadow-glow-income",
        variant === 'expense' && "hover:shadow-glow-expense",
        variant === 'balance' && "hover:shadow-glow-primary"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-2xl",
        variant === 'income' && "gradient-income",
        variant === 'expense' && "gradient-expense",
        variant === 'balance' && "gradient-balance"
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            variant === 'income' && "text-gradient-income",
            variant === 'expense' && "text-gradient-expense",
            variant === 'balance' && "text-foreground"
          )}>
            {formatCurrency(value)}
          </p>
        </div>
        <div className={cn(
          "rounded-2xl p-4",
          variant === 'income' && "gradient-income shadow-glow-income",
          variant === 'expense' && "gradient-expense shadow-glow-expense",
          variant === 'balance' && "gradient-balance"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'balance' ? "text-white" : "text-background"
          )} />
        </div>
      </div>
      
      {/* Background glow effect */}
      <div className={cn(
        "absolute -bottom-20 -right-20 h-40 w-40 rounded-full opacity-20 blur-3xl",
        variant === 'income' && "bg-[hsl(var(--income))]",
        variant === 'expense' && "bg-[hsl(var(--expense))]",
        variant === 'balance' && "bg-primary"
      )} />

      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none" />
    </div>
  );
}
