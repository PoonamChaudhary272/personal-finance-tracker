import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, UserData } from '../types';
import { getInitialData, saveData } from '../utils/storage';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<UserData>(getInitialData);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  );

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    
    setData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    
    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      const relatedBudget = data.budgets.find(b => b.category === transaction.category);
      if (relatedBudget) {
        updateBudget({
          ...relatedBudget,
          spent: relatedBudget.spent + transaction.amount
        });
      }
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = data.transactions.find(t => t.id === id);
    
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
    
    // Update budget if it was an expense
    if (transaction && transaction.type === 'expense') {
      const relatedBudget = data.budgets.find(b => b.category === transaction.category);
      if (relatedBudget) {
        updateBudget({
          ...relatedBudget,
          spent: relatedBudget.spent - transaction.amount
        });
      }
    }
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = {
      ...budget,
      id: crypto.randomUUID(),
      spent: 0
    };
    
    setData(prev => ({
      ...prev,
      budgets: [...prev.budgets, newBudget]
    }));
  };

  const updateBudget = (budget: Budget) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.map(b => 
        b.id === budget.id ? budget : b
      )
    }));
  };

  const deleteBudget = (id: string) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions: data.transactions,
        budgets: data.budgets,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        currentMonth,
        setCurrentMonth
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};