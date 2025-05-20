import React, { useState } from 'react';
import { IndianRupee, Menu, X } from 'lucide-react';
import TransactionForm from './TransactionForm';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top navbar */}
        <header className="z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm md:px-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">FinTrack</h1>
            </div>
          </div>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Transaction
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto md:p-6">
          {children}
        </main>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Add Transaction</h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <TransactionForm onClose={() => setShowTransactionModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;