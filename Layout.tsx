
import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS, APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onRoleChange, currentPath, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const getNavItems = () => {
    switch (role) {
      case UserRole.ADMIN: return NAVIGATION_ITEMS.ADMIN;
      case UserRole.SUPPLIER: return NAVIGATION_ITEMS.SUPPLIER;
      default: return NAVIGATION_ITEMS.RESELLER;
    }
  };
  
  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-slate-950 shadow-md border-b border-slate-800">
          <h1 className="text-xl font-bold text-sky-400 tracking-wider flex items-center gap-2">
            {role === UserRole.ADMIN && <span className="bg-red-600 text-[10px] px-1.5 rounded text-white font-mono">ROOT</span>}
            {APP_NAME}
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                currentPath === item.path 
                  ? role === UserRole.ADMIN ? 'bg-indigo-700 text-white' : 'bg-sky-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center p-2 rounded bg-slate-800">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              role === UserRole.ADMIN ? 'bg-indigo-500' : 'bg-sky-500'
            }`}>
              {role === UserRole.RESELLER ? 'GS' : role === UserRole.SUPPLIER ? 'PR' : 'AD'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Usuario {role === UserRole.ADMIN ? 'Super' : 'Demo'}</p>
              <p className="text-xs text-slate-400 capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
          {/* Role Switcher for Demo Purposes */}
          <div className="mt-3 flex gap-2 justify-center">
            <button 
              onClick={() => onRoleChange(UserRole.RESELLER)}
              className={`w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px] ${role === UserRole.RESELLER ? 'bg-sky-500 text-white border-sky-500' : 'text-slate-500'}`}
              title="Ver como Gestor"
            >
              G
            </button>
            <button 
              onClick={() => onRoleChange(UserRole.SUPPLIER)}
              className={`w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px] ${role === UserRole.SUPPLIER ? 'bg-green-500 text-white border-green-500' : 'text-slate-500'}`}
               title="Ver como Proveedor"
            >
              P
            </button>
            <button 
              onClick={() => onRoleChange(UserRole.ADMIN)}
              className={`w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px] ${role === UserRole.ADMIN ? 'bg-indigo-500 text-white border-indigo-500' : 'text-slate-500'}`}
               title="Ver como Admin"
            >
              A
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 rounded-md lg:hidden hover:text-slate-700 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 px-4 lg:px-8">
             <h2 className="text-lg font-semibold text-slate-800">
                {navItems.find(i => i.path === currentPath)?.name || 'Panel'}
             </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
               <User className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
