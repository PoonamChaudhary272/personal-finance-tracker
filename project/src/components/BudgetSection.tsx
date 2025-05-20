import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/storage';
import { Plus, X, Trash2 } from 'lucide-react';
import { DEFAULT_EXPENSE_CATEGORIES } from '../types';

const BudgetSection: React.FC = () => {
  const { budgets, addBudget, deleteBudget } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');

  // Filter out categories that already have budgets
  const availableCategories = DEFAULT_EXPENSE_CATEGORIES.filter(
    cat => !budgets.some(budget => budget.category === cat)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    addBudget({
      category,
      amount: Number(amount)
    });
    
    // Reset form
    setCategory(availableCategories[0] || DEFAULT_EXPENSE_CATEGORIES[0]);
    setAmount('');
    setShowForm(false);
  };

  const getBudgetProgress = (budget: { amount: number; spent: number }) => {
    const percentage = (budget.spent / budget.amount) * 100;
    return Math.min(percentage, 100).toFixed(0) + '%';
  };

  const getProgressColor = (budget: { amount: number; spent: number }) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Budget Tracker</h3>
        <p className="text-sm text-gray-500">Track your spending against budget</p>
      </div>
      
      <div className="p-4">
        {budgets.length === 0 ? (
          <p className="text-center text-gray-500">No budgets set up yet</p>
        ) : (
          <div className="space-y-4">
            {budgets.map(budget => (
              <div key={budget.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{budget.category}</p>
                  <button 
                    onClick={() => deleteBudget(budget.id)}
                    className="p-1 text-gray-400 rounded hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-500">
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                  </span>
                  <span className="font-medium">
                    {getBudgetProgress(budget)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(budget)} transition-all duration-500 ease-in-out`}
                    style={{ width: getBudgetProgress(budget) }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showForm ? (
          <div className="mt-4 p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Add New Budget</h4>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={availableCategories.length === 0}
                >
                  {availableCategories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Budget Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={availableCategories.length === 0}
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={availableCategories.length === 0}
              >
                Save Budget
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-full gap-2 p-2 mt-4 font-medium text-green-600 transition-all border border-green-600 rounded-lg hover:bg-green-50"
            disabled={availableCategories.length === 0}
          >
            <Plus size={16} />
            <span>Add Budget</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetSection;