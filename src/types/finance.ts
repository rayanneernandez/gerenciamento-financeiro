export type TransactionType = 'income' | 'expense';

export type Bank = 
  | 'Nubank'
  | 'Inter'
  | 'Itaú'
  | 'Bradesco'
  | 'Santander'
  | 'Caixa'
  | 'Banco do Brasil'
  | 'Mercado Pago'
  | 'PicPay'
  | 'C6 Bank'
  | 'XP'
  | 'BTG'
  | 'Dinheiro'
  | 'Outros';

export const BANKS: Bank[] = [
  'Nubank',
  'Inter',
  'Itaú',
  'Bradesco',
  'Santander',
  'Caixa',
  'Banco do Brasil',
  'Mercado Pago',
  'PicPay',
  'C6 Bank',
  'XP',
  'BTG',
  'Dinheiro',
  'Outros'
];

export type Category = 
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'lazer'
  | 'saude'
  | 'educacao'
  | 'compras'
  | 'servicos'
  | 'salario'
  | 'investimentos'
  | 'investimento_cofrinho'
  | 'outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  bank?: Bank;
  date: Date;
  paid?: boolean;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  alimentacao: { name: 'Alimentação', icon: '🍔', color: 'hsl(24, 95%, 53%)' },
  transporte: { name: 'Transporte', icon: '🚗', color: 'hsl(221, 83%, 53%)' },
  moradia: { name: 'Moradia', icon: '🏠', color: 'hsl(262, 83%, 58%)' },
  lazer: { name: 'Lazer', icon: '🎮', color: 'hsl(339, 90%, 51%)' },
  saude: { name: 'Saúde', icon: '💊', color: 'hsl(142, 76%, 36%)' },
  educacao: { name: 'Educação', icon: '📚', color: 'hsl(199, 89%, 48%)' },
  compras: { name: 'Compras', icon: '🛒', color: 'hsl(280, 87%, 65%)' },
  servicos: { name: 'Serviços', icon: '⚡', color: 'hsl(38, 92%, 50%)' },
  salario: { name: 'Salário', icon: '💰', color: 'hsl(158, 64%, 40%)' },
  investimentos: { name: 'Investimentos', icon: '📈', color: 'hsl(173, 80%, 40%)' },
  investimento_cofrinho: { name: 'Investimento Cofrinho', icon: '🐷', color: 'hsl(326, 100%, 74%)' },
  outros: { name: 'Outros', icon: '📦', color: 'hsl(215, 14%, 45%)' },
};

export const EXPENSE_CATEGORIES: Category[] = [
  'alimentacao',
  'transporte', 
  'moradia',
  'lazer',
  'saude',
  'educacao',
  'compras',
  'servicos',
  'investimento_cofrinho',
  'outros',
];

export const INCOME_CATEGORIES: Category[] = [
  'salario',
  'investimentos',
  'outros',
];