export type TransactionType = 'income' | 'expense';

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
  | 'outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: Date;
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
  'outros',
];

export const INCOME_CATEGORIES: Category[] = [
  'salario',
  'investimentos',
  'outros',
];
