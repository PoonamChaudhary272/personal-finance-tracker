import { Transaction, Budget, UserData } from '../types';

const STORAGE_KEY = 'finance_tracker_data';

export const getInitialData = (): UserData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  return {
    transactions: [],
    budgets: []
  };
};

export const saveData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getCurrentMonth = (): string => {
  return new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

export const getMonthYear = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });
};

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  monthYear?: string
): Transaction[] => {
  if (!monthYear) {
    monthYear = getCurrentMonth();
  }
  
  return transactions.filter(transaction => 
    getMonthYear(transaction.date) === monthYear
  );
};