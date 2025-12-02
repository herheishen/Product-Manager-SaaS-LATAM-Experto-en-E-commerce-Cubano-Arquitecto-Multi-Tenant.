import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import StoreManager from './pages/StoreManager';
import { UserRole } from './types';

// Simple Router for the single XML constraint
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [role, setRole] = useState<UserRole>(UserRole.RESELLER);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/marketplace':
        return <Marketplace />;
      case '/my-store':
        return <StoreManager />;
      case '/inventory':
        return <div className="p-10 text-center text-slate-500">Módulo de Inventario de Proveedor (Mock)</div>;
      case '/orders':
        return <div className="p-10 text-center text-slate-500">Gestión de Pedidos Completa (Mock)</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      role={role} 
      onRoleChange={setRole}
      currentPath={currentPath}
      onNavigate={setCurrentPath}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;