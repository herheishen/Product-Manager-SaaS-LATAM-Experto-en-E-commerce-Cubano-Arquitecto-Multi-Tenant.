

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
  const [activePublicStoreId, setActivePublicStoreId] = useState<string | null>(null);

  // When role changes, reset path to root to avoid 404s
  useEffect(() => {
    setCurrentPath('/');
    setActivePublicStoreId(null); // Ensure public store mode is exited
  }, [role]);

  const handleViewPublicStore = (storeId: string) => {
    setActivePublicStoreId(storeId);
  };

  const handleExitPublicStore = () => {
    setActivePublicStoreId(null);
    setCurrentPath('/my-store'); // Return to store manager after exiting public store
  };

  if (activePublicStoreId) {
    return <PublicStore storeId={activePublicStoreId} onExitPublicStore={handleExitPublicStore} />;
  }

  const renderPage = () => {
    // Admin Routes
    if (role === UserRole.ADMIN) {
      switch (currentPath) {
        case '/':
        case '/admin/suppliers': // Default tab for Admin
           return <AdminDashboard />;
        case '/admin/resellers': // Placeholder
           return <div className="p-10 text-center text-slate-500">Gestión de Gestores (En Desarrollo)</div>;
        case '/admin/products': // Placeholder
           return <div className="p-10 text-center text-slate-500">Auditoría de Productos Global (En Desarrollo)</div>;
        case '/admin/orders': // Placeholder
           return <div className="p-10 text-center text-slate-500">Monitor de Órdenes Global (En Desarrollo)</div>;
        case '/admin/finance': // Already implemented in AdminDashboard as tab
           return <AdminDashboard />; // Tab is handled inside AdminDashboard
        case '/admin/logistics': // Already implemented in AdminDashboard as tab
           return <AdminDashboard />; // Tab is handled inside AdminDashboard
        case '/admin/settings': // Placeholder
           return <div className="p-10 text-center text-slate-500">Configuración del Sistema (En Desarrollo)</div>;
        case '/admin/tickets': // Placeholder
           return <div className="p-10 text-center text-slate-500">Sistema de Tickets de Soporte (En Desarrollo)</div>;
        default:
          return <AdminDashboard />;
      }
    }

    // Reseller Routes
    if (role === UserRole.RESELLER) {
      switch (currentPath) {
        case '/':
          return <Dashboard onNavigate={setCurrentPath} />;
        case '/marketplace':
          return <Marketplace />;
        case '/my-store':
          return <StoreManager onViewPublicStore={handleViewPublicStore} />;
        case '/orders':
          return <Orders />;
        case '/marketing': // Placeholder
           return <StoreManager />; // Marketing tab is inside StoreManager
        case '/subscription':
          return <Subscription />;
        case '/settings': // Placeholder
           return <div className="p-10 text-center text-slate-500">Ajustes de Cuenta (En Desarrollo)</div>;
        case '/help': // Placeholder
           return <div className="p-10 text-center text-slate-500">Centro de Ayuda y FAQ (En Desarrollo)</div>;
        default:
          return <Dashboard onNavigate={setCurrentPath} />;
      }
    }

    // Supplier Routes
    if (role === UserRole.SUPPLIER) {
      switch (currentPath) {
        case '/':
        case '/inventory': // Default tab for Supplier
           return <SupplierDashboard />;
        case '/dispatch':
           return <SupplierDispatch />;
        case '/resellers': // Placeholder
           return <div className="p-10 text-center text-slate-500">Mis Gestores (En Desarrollo)</div>;
        case '/finance': // Placeholder
           return <div className="p-10 text-center text-slate-500">Finanzas Proveedor (En Desarrollo)</div>;
        case '/profile': // Placeholder
           return <div className="p-10 text-center text-slate-500">Mi Perfil de Negocio (En Desarrollo)</div>;
        case '/help': // Placeholder
           return <div className="p-10 text-center text-slate-500">Centro de Ayuda y FAQ (En Desarrollo)</div>;
        default:
           return <SupplierDashboard />;
      }
    }

    return <Dashboard onNavigate={setCurrentPath} />;
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
      {(role === UserRole.RESELLER || role === UserRole.SUPPLIER) && <AIChatbot />}
    </>
  );
};

export default App;
