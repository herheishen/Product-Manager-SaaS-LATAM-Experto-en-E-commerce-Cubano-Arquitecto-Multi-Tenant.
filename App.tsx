
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import StoreManager from './pages/StoreManager';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

// Simple Router for the single XML constraint
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [role, setRole] = useState<UserRole>(UserRole.RESELLER);

  // When role changes, reset path to root to avoid 404s
  useEffect(() => {
    setCurrentPath('/');
  }, [role]);

  const renderPage = () => {
    // Admin Routes
    if (role === UserRole.ADMIN) {
      switch (currentPath) {
        case '/':
          return <AdminDashboard />;
        case '/admin/suppliers':
           // Reuse AdminDashboard with forced tab via prop would be ideal, 
           // but for MVP we render the dashboard which defaults to overview
           // Real app would parse URL params
           return <AdminDashboard />;
        case '/admin/finance':
           return <div className="p-10 text-center text-slate-500">Módulo Financiero Detallado (En Desarrollo)</div>;
        default:
          return <AdminDashboard />;
      }
    }

    // Reseller Routes
    if (role === UserRole.RESELLER) {
      switch (currentPath) {
        case '/':
          return <Dashboard />;
        case '/marketplace':
          return <Marketplace />;
        case '/my-store':
          return <StoreManager />;
        case '/orders':
          return <div className="p-10 text-center text-slate-500">Gestión de Pedidos Completa (Mock)</div>;
        default:
          return <Dashboard />;
      }
    }

    // Supplier Routes
    if (role === UserRole.SUPPLIER) {
      switch (currentPath) {
        case '/':
           return <div className="p-10 text-center text-slate-500">Dashboard Proveedor (En Desarrollo)</div>;
        case '/inventory':
           return <div className="p-10 text-center text-slate-500">Inventario y Stock (Mock)</div>;
        default:
           return <div className="p-10 text-center text-slate-500">Dashboard Proveedor (En Desarrollo)</div>;
      }
    }

    return <Dashboard />;
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
