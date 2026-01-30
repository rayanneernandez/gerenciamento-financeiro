import { useState, useEffect } from 'react';
import { Transaction, Category, CATEGORIES } from '@/types/finance';

const STORAGE_KEY = 'finance-transactions';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransactions(parsed.map((t: Transaction) => ({
        ...t,
        date: new Date(t.date),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
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
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory,
    chartData,
  };
}
