
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import StoreManager from './pages/StoreManager';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import SupplierDispatch from './pages/SupplierDispatch';
import PublicStore from './pages/PublicStore';
import Subscription from './pages/Subscription';
import AIChatbot from './components/AIChatbot';
import { UserRole } from './types';

// Simple Router for the single XML constraint
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [role, setRole] = useState<UserRole>(UserRole.RESELLER);

  // Check URL for "public store" simulation mode
  const [isPublicStoreMode, setIsPublicStoreMode] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/store/')) {
      setIsPublicStoreMode(true);
    }
  }, []);

  // When role changes, reset path to root to avoid 404s
  useEffect(() => {
    setCurrentPath('/');
  }, [role]);

  // Handle fake navigation to public store
  useEffect(() => {
    if (currentPath === '/store/preview') {
      setIsPublicStoreMode(true);
    }
  }, [currentPath]);

  if (isPublicStoreMode) {
    return <PublicStore />;
  }

  const renderPage = () => {
    // Admin Routes
    if (role === UserRole.ADMIN) {
      switch (currentPath) {
        case '/':
          return <AdminDashboard />;
        case '/admin/suppliers':
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
          return <Orders />;
        case '/subscription':
          return <Subscription />;
        default:
          return <Dashboard />;
      }
    }

    // Supplier Routes
    if (role === UserRole.SUPPLIER) {
      switch (currentPath) {
        case '/':
           return <SupplierDashboard />;
        case '/inventory':
           return <SupplierDashboard />;
        case '/dispatch':
           return <SupplierDispatch />;
        case '/finance':
           return <div className="p-10 text-center text-slate-500">Finanzas Proveedor (Liquidaciones Pendientes)</div>;
        default:
           return <SupplierDashboard />;
      }
    }

    return <Dashboard />;
  };

  return (
    <>
      <Layout 
        role={role} 
        onRoleChange={setRole}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      >
        {renderPage()}
      </Layout>
      {role === UserRole.RESELLER && <AIChatbot />}
    </>
  );
};

export default App;
