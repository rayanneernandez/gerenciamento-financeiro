import { BankDashboard } from '@/components/BankDashboard';
import { TrendingUp, TrendingDown, Wallet, BarChart3, Lightbulb, ListTodo, Sparkles, LogOut, ShoppingBag, PiggyBank, LayoutDashboard, Building2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { SummaryCard } from '@/components/SummaryCard';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { InsightsPanel } from '@/components/InsightsPanel';
import { SavingsGoal } from '@/components/SavingsGoal';
import { Wishlist } from '../components/Wishlist';
import { MonthlyFinancialChart } from '@/components/MonthlyFinancialChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavings } from '@/hooks/useSavings';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { signOut } = useAuth();
  const {
    transactions,
    monthlyTransactions,
    currentDate,
    setCurrentDate,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpenses,
    balance,
    monthIncome,
    monthExpenses,
    expensesByCategory,
    chartData,
  } = useTransactions();
  
  const { savingsCurrent } = useSavings();
  const { items: wishlistItems } = useWishlist();

  const nextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const currentMonthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

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
          <div className="flex items-center gap-2">
            <AddTransactionDialog onAdd={addTransaction} />
            <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Tabs for Transactions, Wishlist, Savings and Insights */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-6 bg-card/50">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Visão Geral</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Transações</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="accounts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Contas</span>
                </TabsTrigger>
                <TabsTrigger value="savings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PiggyBank className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Cofrinho</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Desejos</span>
                </TabsTrigger>
              </TabsList>

              {/* Month Selector */}
              <div className="flex items-center bg-card/50 rounded-lg p-1 border border-white/5">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 px-4 min-w-[160px] justify-center font-semibold capitalize">
                  <Calendar className="h-4 w-4 text-primary" />
                  {currentMonthName}
                </div>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="dashboard" className="space-y-6">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                  title="Receitas (Mês)"
                  value={monthIncome}
                  icon={TrendingUp}
                  variant="income"
                  delay={0}
                />
                <SummaryCard
                  title="Despesas (Mês)"
                  value={monthExpenses}
                  icon={TrendingDown}
                  variant="expense"
                  delay={100}
                />
                <SummaryCard
                  title="Saldo Total"
                  value={balance}
                  icon={Wallet}
                  variant="balance"
                  delay={200}
                />
                <SummaryCard
                  title="Cofrinho"
                  value={savingsCurrent}
                  icon={PiggyBank}
                  variant="savings"
                  delay={300}
                />
              </section>
              
              <MonthlyFinancialChart transactions={transactions} currentDate={currentDate} />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <section className="glass-card rounded-3xl p-6 shadow-card animate-fade-in lg:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--expense))]/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-[hsl(var(--expense))]" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Gastos por Categoria</h2>
                  </div>
                  <ExpenseChart data={chartData} totalExpenses={monthExpenses} />
                </section>

                {/* Transaction List */}
                <section className="glass-card rounded-3xl p-6 shadow-card animate-fade-in lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <ListTodo className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Transações de {currentDate.toLocaleDateString('pt-BR', { month: 'long' })}</h2>
                  </div>
                  <TransactionList 
                    transactions={monthlyTransactions} 
                    onDelete={deleteTransaction} 
                    onUpdate={updateTransaction}
                  />
                </section>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Insights Panel */}
                <section className="glass-card rounded-3xl p-6 shadow-card animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Insights do Mês</h2>
                  </div>
                  <InsightsPanel
                    transactions={monthlyTransactions}
                    totalIncome={monthIncome}
                    totalExpenses={monthExpenses}
                    expensesByCategory={expensesByCategory}
                    wishlistItems={wishlistItems}
                    currentBalance={balance}
                  />
                </section>
              </div>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              {/* BankDashboard mostra saldo total, então usa transactions completo */}
              <BankDashboard transactions={transactions} />
            </TabsContent>

            <TabsContent value="savings" className="space-y-6">
              <div className="w-full">
                <SavingsGoal />
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <div className="w-full">
                <Wishlist />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default Index;
