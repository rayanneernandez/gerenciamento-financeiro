import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/types/finance';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface MonthlyFinancialChartProps {
  transactions: Transaction[];
  currentDate?: Date;
}

export function MonthlyFinancialChart({ transactions, currentDate }: MonthlyFinancialChartProps) {
  const data = useMemo(() => {
    const targetYear = currentDate ? currentDate.getFullYear() : new Date().getFullYear();
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    return months.map((month, index) => {
      const monthlyTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === index && tDate.getFullYear() === targetYear;
      });

      const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

      const expense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

      return {
        name: month,
        income,
        expense
      };
    });
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0 // Simplificar visualização no eixo
    }).format(value);
  };

  return (
    <Card className="glass-card w-full border-white/10 mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Balanço Anual ({currentDate ? currentDate.getFullYear() : new Date().getFullYear()})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
               <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }}
                dy={10}
               />
               <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888888', fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
               />
               <Tooltip 
                 cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                 contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff'
                 }}
                 formatter={(value: number, name: string) => [
                   new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                   name === 'income' ? 'Receitas' : 'Despesas'
                 ]}
                 labelStyle={{ color: '#fff', marginBottom: '0.5rem' }}
               />
               <Legend 
                 verticalAlign="top" 
                 height={36}
                 formatter={(value) => <span style={{ color: '#888888' }}>{value === 'income' ? 'Receitas' : 'Despesas'}</span>}
               />
               <Bar 
                 dataKey="income" 
                 name="income"
                 fill="#10b981" 
                 radius={[4, 4, 0, 0]} 
                 maxBarSize={50}
               />
               <Bar 
                 dataKey="expense" 
                 name="expense"
                 fill="#ef4444" 
                 radius={[4, 4, 0, 0]} 
                 maxBarSize={50}
               />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}