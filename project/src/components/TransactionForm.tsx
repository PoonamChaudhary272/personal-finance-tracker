import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '../types';
import { IndianRupee, Plus, X } from 'lucide-react';

const TransactionForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    addTransaction({
      amount: Number(amount),
      type,
      category,
      description,
      date
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    
    if (onClose) {
      onClose();
    } else {
      setShowForm(false);
    }
  };

  const categories = type === 'income' 
    ? DEFAULT_INCOME_CATEGORIES 
    : DEFAULT_EXPENSE_CATEGORIES;

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div className="w-full">
      {!showForm && !onClose ? (
        <button 
          onClick={toggleForm}
          className="flex items-center justify-center w-full gap-2 p-3 font-medium text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Add New Transaction</h3>
            {!onClose && (
              <button onClick={toggleForm} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg ${
                  type === 'expense' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg ${
                  type === 'income' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IndianRupee size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Transaction
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;