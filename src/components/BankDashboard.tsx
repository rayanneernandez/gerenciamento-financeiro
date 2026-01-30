import { useMemo } from 'react';
import { Transaction, Bank, BANKS } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BankDashboardProps {
  transactions: Transaction[];
}

export function BankDashboard({ transactions }: BankDashboardProps) {
  const bankStats = useMemo(() => {
    const stats: Record<string, { income: number; expense: number; balance: number }> = {};
    
    // Initialize all banks with 0
    BANKS.forEach(bank => {
      stats[bank] = { income: 0, expense: 0, balance: 0 };
    });

    // Calculate totals
    transactions.forEach(t => {
      // Verifica se a transação está efetivada (paga ou data passada)
      const isEffective = t.paid ?? (new Date(t.date) <= new Date());
      
      if (t.bank && stats[t.bank] && isEffective) {
        if (t.type === 'income') {
          stats[t.bank].income += t.amount;
          stats[t.bank].balance += t.amount;
        } else {
          stats[t.bank].expense += t.amount;
          stats[t.bank].balance -= t.amount;
        }
      }
    });

    // Filter out banks with no activity, but keep at least one if all empty
    const activeBanks = Object.entries(stats)
      .filter(([_, data]) => data.income > 0 || data.expense > 0 || data.balance !== 0)
      .sort((a, b) => b[1].balance - a[1].balance);

    return activeBanks;
  }, [transactions]);

  const totalBalance = bankStats.reduce((acc, [_, data]) => acc + data.balance, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Total Balance Card */}
      <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Total em Contas
          </CardTitle>
          <Wallet className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalBalance)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Soma de todos os saldos bancários
          </p>
        </CardContent>
      </Card>

      {/* Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bankStats.map(([bankName, data]) => (
          <Card key={bankName} className="glass-card hover:bg-white/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">{bankName}</CardTitle>
              </div>
              {data.balance >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-4 ${data.balance < 0 ? 'text-rose-500' : ''}`}>
                {formatCurrency(data.balance)}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entradas</span>
                  <span className="text-emerald-500 font-medium">+{formatCurrency(data.income)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Saídas</span>
                  <span className="text-rose-500 font-medium">-{formatCurrency(data.expense)}</span>
                </div>
                
                {/* Visual bar for income vs expense ratio */}
                {(data.income > 0 || data.expense > 0) && (
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${(data.income / (data.income + data.expense)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-rose-500" 
                      style={{ width: `${(data.expense / (data.income + data.expense)) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {bankStats.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma movimentação bancária registrada.</p>
            <p className="text-sm">Adicione transações vinculadas a um banco para ver o resumo aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}