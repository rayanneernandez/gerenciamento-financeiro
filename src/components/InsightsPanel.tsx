import { useMemo } from 'react';
import { Transaction, Category, CATEGORIES } from '@/types/finance';
import { Lightbulb, TrendingDown, AlertTriangle, Target, Sparkles, Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  expensesByCategory: Record<Category, number>;
}

interface Insight {
  type: 'warning' | 'tip' | 'success' | 'info';
  title: string;
  description: string;
  icon: typeof Lightbulb;
}

export function InsightsPanel({ transactions, totalIncome, totalExpenses, expensesByCategory }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const result: Insight[] = [];
    
    if (transactions.length === 0) {
      result.push({
        type: 'info',
        title: 'Comece sua jornada',
        description: 'Adicione suas transações para receber insights personalizados e dicas inteligentes.',
        icon: Sparkles,
      });
      return result;
    }

    // Analyze savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    if (savingsRate < 0) {
      result.push({
        type: 'warning',
        title: 'Atenção: Gastos elevados',
        description: 'Você está gastando mais do que ganha. Revise suas despesas urgentemente.',
        icon: AlertTriangle,
      });
    } else if (savingsRate < 10 && totalIncome > 0) {
      result.push({
        type: 'tip',
        title: 'Oportunidade de economia',
        description: 'Tente economizar pelo menos 20% da renda. Pequenos cortes fazem grande diferença!',
        icon: Target,
      });
    } else if (savingsRate >= 20) {
      result.push({
        type: 'success',
        title: 'Excelente trabalho!',
        description: `Você está economizando ${savingsRate.toFixed(0)}% da sua renda. Continue assim!`,
        icon: Trophy,
      });
    }

    // Find biggest expense category
    const sortedCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a);

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const categoryInfo = CATEGORIES[topCategory as Category];
      const percentage = totalExpenses > 0 ? ((topAmount / totalExpenses) * 100).toFixed(0) : 0;

      if (Number(percentage) > 40) {
        result.push({
          type: 'warning',
          title: `${categoryInfo.icon} Alto gasto em ${categoryInfo.name}`,
          description: `${percentage}% do total vai para ${categoryInfo.name.toLowerCase()}. Defina um limite mensal.`,
          icon: TrendingDown,
        });
      }
    }

    // Check if no income recorded
    if (totalIncome === 0 && transactions.length > 0) {
      result.push({
        type: 'tip',
        title: 'Registre sua renda',
        description: 'Adicione suas receitas para ter uma visão completa da sua saúde financeira.',
        icon: Lightbulb,
      });
    }

    // Suggest specific savings
    if (expensesByCategory.alimentacao && expensesByCategory.alimentacao > totalIncome * 0.15) {
      result.push({
        type: 'tip',
        title: '🍔 Dica de economia',
        description: 'Cozinhar em casa pode reduzir seus gastos com alimentação em até 50%.',
        icon: Zap,
      });
    }

    if (expensesByCategory.lazer && expensesByCategory.lazer > totalIncome * 0.1) {
      result.push({
        type: 'tip',
        title: '🎮 Otimize seu lazer',
        description: 'Busque alternativas gratuitas e defina um orçamento fixo para diversão.',
        icon: Zap,
      });
    }

    // Generic tip if no specific insights
    if (result.length === 0) {
      result.push({
        type: 'info',
        title: 'Finanças saudáveis',
        description: 'Seus gastos estão equilibrados. Continue monitorando para manter o controle.',
        icon: Sparkles,
      });
    }

    return result;
  }, [transactions, totalIncome, totalExpenses, expensesByCategory]);

  const getStyles = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-[hsl(var(--expense))]/10',
          border: 'border-[hsl(var(--expense))]/30',
          icon: 'bg-[hsl(var(--expense))]/20 text-[hsl(var(--expense))]',
          glow: 'shadow-[0_0_30px_hsl(var(--expense)/0.15)]'
        };
      case 'tip':
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          icon: 'bg-primary/20 text-primary',
          glow: 'shadow-[0_0_30px_hsl(var(--primary)/0.15)]'
        };
      case 'success':
        return {
          bg: 'bg-[hsl(var(--income))]/10',
          border: 'border-[hsl(var(--income))]/30',
          icon: 'bg-[hsl(var(--income))]/20 text-[hsl(var(--income))]',
          glow: 'shadow-[0_0_30px_hsl(var(--income)/0.15)]'
        };
      default:
        return {
          bg: 'bg-secondary/50',
          border: 'border-white/10',
          icon: 'bg-white/10 text-muted-foreground',
          glow: ''
        };
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const styles = getStyles(insight.type);
        return (
          <div
            key={index}
            className={cn(
              "p-5 rounded-2xl border animate-fade-in transition-all duration-300 hover:scale-[1.02]",
              styles.bg, styles.border, styles.glow
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-4">
              <div className={cn(
                "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                styles.icon
              )}>
                <insight.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
