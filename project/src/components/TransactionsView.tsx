import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { Plus, X } from 'lucide-react';

const TransactionsView: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors md:hidden"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <TransactionList />
        </div>
        
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Add Transaction</h3>
            </div>
            <div className="p-4">
              <TransactionForm />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Transaction Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 md:hidden">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add Transaction</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <TransactionForm onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsView;