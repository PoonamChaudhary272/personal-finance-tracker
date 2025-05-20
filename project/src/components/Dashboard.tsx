import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { filterTransactionsByMonth, formatCurrency, getMonthYear } from '../utils/storage';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import SpendingChart from './SpendingChart';
import TransactionList from './TransactionList';
import MonthlyTrendChart from './MonthlyTrendChart';
import CategoryDistributionChart from './CategoryDistributionChart';

const Dashboard: React.FC = () => {
  const { transactions, currentMonth, setCurrentMonth } = useFinance();
  
  const filteredTransactions = filterTransactionsByMonth(transactions, currentMonth);
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  const getMonthOptions = () => {
    const months = new Set<string>();
    const today = new Date();
    months.add(getMonthYear(today.toISOString()));
    
    for (let i = 1; i <= 11; i++) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      months.add(getMonthYear(d.toISOString()));
    }
    
    transactions.forEach(t => {
      months.add(getMonthYear(t.date));
    });
    
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  };
  
  const monthOptions = getMonthOptions();
  const currentMonthIndex = monthOptions.indexOf(currentMonth);
  
  const goToPreviousMonth = () => {
    if (currentMonthIndex < monthOptions.length - 1) {
      setCurrentMonth(monthOptions[currentMonthIndex + 1]);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonth(monthOptions[currentMonthIndex - 1]);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
        <div className="flex items-center">
          <button
            onClick={goToPreviousMonth}
            className="p-1 mr-2 text-gray-500 rounded hover:bg-gray-100"
            disabled={currentMonthIndex >= monthOptions.length - 1}
          >
            <ChevronLeft size={20} />
          </button>
          
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          
          <button
            onClick={goToNextMonth}
            className="p-1 ml-2 text-gray-500 rounded hover:bg-gray-100"
            disabled={currentMonthIndex <= 0}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Income</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="p-4 transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expenses</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="p-4 transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <TrendingUp className={balance >= 0 ? 'text-blue-600' : 'text-orange-600'} size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Monthly Trend</h3>
            <p className="text-sm text-gray-500">Income vs Expenses over time</p>
          </div>
          <div className="p-4">
            <MonthlyTrendChart transactions={transactions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Category Distribution</h3>
            <p className="text-sm text-gray-500">Expenses by category</p>
          </div>
          <div className="p-4">
            <CategoryDistributionChart transactions={filteredTransactions} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <TransactionList />
      </div>
    </div>
  );
};

export default Dashboard;