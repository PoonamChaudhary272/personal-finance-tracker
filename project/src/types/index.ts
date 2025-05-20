export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export interface UserData {
  transactions: Transaction[];
  budgets: Budget[];
}

export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Rental',
  'Dividend',
  'Gift',
  'Interest',
  'Other'
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Groceries',
  'Transportation',
  'Utilities',
  'Rent',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Insurance',
  'EMI',
  'Travel',
  'Other'
];