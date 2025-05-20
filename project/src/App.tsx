import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <FinanceProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </FinanceProvider>
  );
}

export default App;