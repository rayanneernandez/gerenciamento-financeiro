import { useState, useEffect } from 'react';
import { Transaction, Category, CATEGORIES } from '@/types/finance';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        setTransactions(data.map((t: any) => {
          // Parse date parts manually to avoid timezone issues
          // We force the time to be 12:00 local time to ensure it stays on the correct day
          const dateStr = t.date.split('T')[0];
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day, 12, 0, 0);

          return {
            ...t,
            date: date,
          };
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar transações', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'> | Omit<Transaction, 'id'>[]) => {
    if (!user) return;
    try {
      const transactionsToAdd = Array.isArray(transaction) ? transaction : [transaction];
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsToAdd.map(t => ({
          ...t,
          user_id: user.id,
          date: t.date.toISOString(),
          bank: t.bank,
          paid: t.paid ?? (t.date <= new Date()) // Se não especificado, assume pago se data <= hoje
        })))
        .select();

      if (error) throw error;

      if (data) {
        const newTrans = data.map((t: any) => {
          // Parse date parts manually to avoid timezone issues
          const dateStr = t.date.split('T')[0];
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day, 12, 0, 0);
          return { ...t, date };
        });
        setTransactions(prev => [...newTrans, ...prev]);
        toast.success(transactionsToAdd.length > 1 ? 'Transações adicionadas!' : 'Transação adicionada!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar transação');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação removida!');
    } catch (error) {
      toast.error('Erro ao remover transação');
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          ...(updates.date ? { date: updates.date.toISOString() } : {}),
          ...(updates.bank ? { bank: updates.bank } : {}),
          ...(updates.paid !== undefined ? { paid: updates.paid } : {})
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const updatedTrans = { ...data, date: new Date(data.date) };
        setTransactions(prev => prev.map(t => t.id === id ? updatedTrans : t));
        toast.success('Transação atualizada!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar transação');
    }
  };

  const isTransactionActive = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  };

  const isTransactionPaid = (t: Transaction) => {
    if (t.paid !== undefined && t.paid !== null) return t.paid;
    return isTransactionActive(t.date); // Fallback para transações antigas
  };

  // Filtra transações do mês selecionado para exibição nas listas e cards mensais
  const monthlyTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentDate.getMonth() && 
           tDate.getFullYear() === currentDate.getFullYear();
  });

  // Totais do mês selecionado (Previsão do mês)
  const monthIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Saldo do mês (Receita do mês - Despesa do mês)
  const monthBalance = monthIncome - monthExpenses;

  // Saldo Atual Real (Todas as transações EFETIVADAS/PAGAS)
  // Isso garante que dinheiro futuro ou não pago não conte no saldo atual
  
  const totalIncome = transactions
    .filter(t => t.type === 'income' && isTransactionPaid(t))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && isTransactionPaid(t))
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Gráfico de despesas por categoria (baseado no mês selecionado)
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<Category, number>);

  const chartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category: CATEGORIES[category as Category].name,
      amount,
      color: CATEGORIES[category as Category].color,
      icon: CATEGORIES[category as Category].icon,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    transactions,
    monthlyTransactions,
    currentDate,
    setCurrentDate,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome, // Acumulado Real (até hoje)
    totalExpenses, // Acumulado Real (até hoje)
    balance, // Saldo Atual Real (até hoje)
    monthIncome, // Mês Selecionado (pode incluir futuro)
    monthExpenses, // Mês Selecionado (pode incluir futuro)
    monthBalance, // Mês Selecionado
    expensesByCategory,
    chartData,
  };
}
