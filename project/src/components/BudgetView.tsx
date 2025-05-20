import React from 'react';
import BudgetSection from './BudgetSection';

const BudgetView: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Budget Management</h2>
        <p className="text-gray-600">Manage your monthly budget and track your spending limits</p>
      </div>
      
      <BudgetSection />
    </div>
  );
};

export default BudgetView;