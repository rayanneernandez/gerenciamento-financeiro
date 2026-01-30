import { useMemo } from 'react';
import { Transaction, Category, CATEGORIES } from '@/types/finance';
import { WishlistItem } from '@/hooks/useWishlist';
import { Lightbulb, TrendingDown, AlertTriangle, Target, Sparkles, Zap, Trophy, PiggyBank, CreditCard, ShoppingBag, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  expensesByCategory: Record<Category, number>;
  wishlistItems?: WishlistItem[];
  currentBalance?: number;
}

interface Insight {
  type: 'warning' | 'tip' | 'success' | 'info';
  title: string;
  description: string;
  icon: any;
}

export function InsightsPanel({ transactions, totalIncome, totalExpenses, expensesByCategory, wishlistItems = [], currentBalance = 0 }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const result: Insight[] = [];
    const monthlySavings = totalIncome - totalExpenses;
    
    // 0. Wishlist Recommendation (Prioridade Alta)
    if (wishlistItems.length > 0) {
      // Ordenar por prioridade (Alta > Média > Baixa) e depois por menor preço
      const priorityMap = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
      const sortedItems = [...wishlistItems].sort((a, b) => {
        const pA = priorityMap[a.priority] || 0;
        const pB = priorityMap[b.priority] || 0;
        if (pA !== pB) return pB - pA; // Maior prioridade primeiro
        return a.price - b.price; // Menor preço primeiro como desempate
      });

      const targetItem = sortedItems[0];
      
      if (currentBalance >= targetItem.price) {
        result.push({
          type: 'success',
          title: 'Hora de realizar um sonho!',
          description: `Você tem saldo suficiente (R$ ${currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) para comprar "${targetItem.description}" (R$ ${targetItem.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Aproveite!`,
          icon: ShoppingBag,
        });
      } else {
        const remaining = targetItem.price - currentBalance;
        
        if (monthlySavings > 0) {
          const monthsToWait = Math.ceil(remaining / monthlySavings);
          const projectedDate = new Date();
          projectedDate.setMonth(projectedDate.getMonth() + monthsToWait);
          const dateString = projectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

          result.push({
            type: 'tip',
            title: `Planejamento: ${targetItem.description}`,
            description: `Faltam R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Com sua economia mensal atual, você poderá comprar este item em ${dateString}.`,
            icon: CalendarClock,
          });
        } else {
          result.push({
            type: 'warning',
            title: `Meta distante: ${targetItem.description}`,
            description: `Para comprar "${targetItem.description}", você precisa começar a economizar. Atualmente suas despesas igualam ou superam suas receitas.`,
            icon: Target,
          });
        }
      }
    }

    // 1. Savings Analysis (Cofrinho)
    if (totalExpenses > totalIncome) {
      result.push({
        type: 'warning',
        title: 'Cuidado com o Cofrinho!',
        description: 'Você gastou mais do que ganhou. Cuidado para não usar suas economias do cofrinho para cobrir gastos do mês!',
        icon: PiggyBank,
      });
    }

    // 2. Best Time to Buy Analysis (Apenas se não tiver recomendação específica de wishlist)
    if (result.length === 0 && monthlySavings > totalIncome * 0.3) {
      result.push({
        type: 'success',
        title: 'Bom momento para compras',
        description: 'Seu saldo está saudável! Se tiver algo na Lista de Desejos, talvez seja um bom momento para comprar à vista.',
        icon: ShoppingBag,
      });
    } else if (monthlySavings < totalIncome * 0.1 && totalIncome > 0) {
      result.push({
        type: 'warning',
        title: 'Evite novas compras',
        description: 'Seu saldo está baixo. Adie compras da Lista de Desejos para o próximo mês.',
        icon: AlertTriangle,
      });
    }

    // 3. Credit Card Usage Warning (Simulated logic based on "Outros" or high expenses)
    // Assuming if expenses are > 80% of income, credit might be involved
    if (totalExpenses > totalIncome * 0.8) {
      result.push({
        type: 'warning',
        title: 'Alerta de Crédito',
        description: 'Seus gastos estão quase atingindo sua renda. Evite usar o cartão de crédito para não comprometer o próximo mês.',
        icon: CreditCard,
      });
    }

    // Existing logic...
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
      // Logic moved to Savings Analysis above
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
  }, [transactions, totalIncome, totalExpenses, expensesByCategory, wishlistItems, currentBalance]);

  const getStyles = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: 'bg-red-500/20 text-red-500',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
        };
      case 'tip':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'bg-blue-500/20 text-blue-500',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]'
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'bg-green-500/20 text-green-500',
          glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]'
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
    <div className="space-y-6">
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
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
