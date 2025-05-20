import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';
import { formatCurrency, formatDate, filterTransactionsByMonth } from '../utils/storage';
import { Trash2, Search, IndianRupee, ArrowDownUp } from 'lucide-react';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, currentMonth } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const filteredTransactions = filterTransactionsByMonth(transactions, currentMonth)
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.amount - a.amount;
      case 'lowest':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const getTransactionColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const handleSortChange = (newOrder: typeof sortOrder) => {
    setSortOrder(newOrder);
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="p-4 mt-4 text-center bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No transactions found for {currentMonth}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex items-center mt-3 text-sm">
          <span className="mr-2 font-medium flex items-center">
            <ArrowDownUp size={14} className="mr-1" /> Sort:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('newest')}
              className={`px-2 py-1 rounded ${
                sortOrder === 'newest' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => handleSortChange('oldest')}
              className={`px-2 py-1 rounded ${
                sortOrder === 'oldest' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Oldest
            </button>
            <button
              onClick={() => handleSortChange('highest')}
              className={`px-2 py-1 rounded ${
                sortOrder === 'highest' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Highest
            </button>
            <button
              onClick={() => handleSortChange('lowest')}
              className={`px-2 py-1 rounded ${
                sortOrder === 'lowest' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Lowest
            </button>
          </div>
        </div>
      </div>
      
      <div className="divide-y max-h-[400px] overflow-y-auto">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <IndianRupee size={16} className={
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                } />
              </div>
              <div>
                <p className="font-medium">{transaction.category}</p>
                <p className="text-sm text-gray-500">{transaction.description}</p>
                <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                {transaction.type === 'income' ? '+' : '-'} 
                {formatCurrency(transaction.amount)}
              </p>
              <button 
                onClick={() => deleteTransaction(transaction.id)}
                className="p-1 text-gray-400 rounded hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;