
import React, { useState } from 'react';
import { Menu, Bell, User, ChevronDown, Search, LogOut, Wifi, WifiOff } from 'lucide-react';
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const getNavItems = () => {
    switch (role) {
      case UserRole.ADMIN: return NAVIGATION_ITEMS.ADMIN;
      case UserRole.SUPPLIER: return NAVIGATION_ITEMS.SUPPLIER;
      default: return NAVIGATION_ITEMS.RESELLER;
    }
  };
  
  const navItems = getNavItems();
  const activeItem = navItems.find(i => i.path === currentPath);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
             <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                  <span className="text-white font-bold text-lg">K</span>
               </div>
               <div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{APP_NAME}</h1>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">SaaS Platform</p>
               </div>
             </div>
          </div>

          {/* User Context */}
          <div className="px-6 py-6">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 relative overflow-hidden group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md ${
                  role === UserRole.ADMIN ? 'bg-rose-500' : role === UserRole.SUPPLIER ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}>
                   {role === UserRole.RESELLER ? 'GS' : role === UserRole.SUPPLIER ? 'PR' : 'AD'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-900 truncate">Usuario {role === UserRole.ADMIN ? 'Root' : 'Demo'}</p>
                   <p className="text-xs text-slate-500 capitalize truncate">{role.toLowerCase()}</p>
                </div>
                {/* Demo Switcher */}
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => onRoleChange(UserRole.RESELLER)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold hover:bg-indigo-100" title="Gestor">G</button>
                   <button onClick={() => onRoleChange(UserRole.SUPPLIER)} className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold hover:bg-emerald-100" title="Proveedor">P</button>
                   <button onClick={() => onRoleChange(UserRole.ADMIN)} className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold hover:bg-rose-100" title="Admin">A</button>
                </div>
             </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menú Principal</p>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-100">
             <button className="flex items-center w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">Cerrar Sesión</span>
             </button>
             <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-300 font-medium">v2.4.0 • La Habana</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Page Title & Breadcrumbs */}
          <div className="hidden lg:block">
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeItem?.name || 'Dashboard'}</h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-6">
             {/* Search Bar - Hidden on mobile */}
             <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all w-64">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400" />
             </div>

             <div className="flex items-center gap-2">
                {/* Connectivity Indicator */}
                <span className={`p-2.5 rounded-full ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`} title={isOnline ? 'Online' : 'Offline'}>
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </span>

                <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                   <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                      <User className="w-full h-full p-1.5 text-slate-400" />
                   </div>
                   <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>
             </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
