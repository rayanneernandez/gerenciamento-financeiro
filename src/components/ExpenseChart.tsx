import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ChartData {
  category: string;
  amount: number;
  color: string;
  icon: string;
}

interface ExpenseChartProps {
  data: ChartData[];
  totalExpenses: number;
}

export function ExpenseChart({ data, totalExpenses }: ExpenseChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4 animate-float">
          <PieChartIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Sem dados</h3>
        <p className="text-sm text-muted-foreground">
          Adicione despesas para ver o gráfico
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="amount"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}50)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(220, 20%, 12%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                color: 'white',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
          <span className="text-2xl font-bold text-gradient-expense">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => {
          const percentage = ((item.amount / totalExpenses) * 100).toFixed(1);
          return (
            <div 
              key={item.category} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="w-4 h-4 rounded-full shrink-0"
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}50`
                }}
              />
              <span className="flex-1 text-sm text-foreground font-medium truncate">
                {item.icon} {item.category}
              </span>
              <div className="flex items-center gap-4">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
