import { TrendingUp, TrendingDown, Wallet, BarChart3, Lightbulb, ListTodo, Sparkles } from 'lucide-react';
import { SummaryCard } from '@/components/SummaryCard';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { InsightsPanel } from '@/components/InsightsPanel';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory,
    chartData,
  } = useTransactions();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--expense))]/20 rounded-full blur-[150px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary animate-glow">
              <Wallet className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                FinanceFlow
                <Sparkles className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">Controle financeiro inteligente</p>
            </div>
          </div>
          <AddTransactionDialog onAdd={addTransaction} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center py-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Suas finanças em <span className="text-gradient-primary">um só lugar</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acompanhe seus gastos, receba insights personalizados e tome decisões mais inteligentes
          </p>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Receitas"
            value={totalIncome}
            icon={TrendingUp}
            variant="income"
            delay={0}
          />
          <SummaryCard
            title="Despesas"
            value={totalExpenses}
            icon={TrendingDown}
            variant="expense"
            delay={100}
          />
          <SummaryCard
            title="Saldo"
            value={balance}
            icon={Wallet}
            variant="balance"
            delay={200}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions List */}
          <section className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-card animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Transações Recentes</h2>
            </div>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          </section>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Chart */}
            <section className="glass-card rounded-3xl p-6 shadow-card animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--expense))]/20 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-[hsl(var(--expense))]" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Gastos por Categoria</h2>
              </div>
              <ExpenseChart data={chartData} totalExpenses={totalExpenses} />
            </section>

            {/* Insights */}
            <section className="glass-card rounded-3xl p-6 shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Insights</h2>
              </div>
              <InsightsPanel
                transactions={transactions}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                expensesByCategory={expensesByCategory}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/5 glass relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Feito com <span className="text-primary">💚</span> para suas finanças
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
