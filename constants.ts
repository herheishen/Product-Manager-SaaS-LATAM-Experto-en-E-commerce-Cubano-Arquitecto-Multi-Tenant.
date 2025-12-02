import { ChartColumn, Package, Users, DollarSign, ShoppingBag, Truck, Settings } from 'lucide-react';

export const APP_NAME = "Kiosko.cu";

export const CURRENCY_RATES = {
  USD_TO_CUP: 320, // Real-time market approximation
  MLC_TO_CUP: 270
};

export const NAVIGATION_ITEMS = {
  RESELLER: [
    { name: 'Dashboard', icon: ChartColumn, path: '/' },
    { name: 'Mercado (Dropshipping)', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Mi Tienda', icon: Settings, path: '/my-store' },
    { name: 'Pedidos', icon: Package, path: '/orders' },
  ],
  SUPPLIER: [
    { name: 'Dashboard', icon: ChartColumn, path: '/' },
    { name: 'Inventario', icon: Package, path: '/inventory' },
    { name: 'Gestores Activos', icon: Users, path: '/resellers' },
    { name: 'Finanzas', icon: DollarSign, path: '/finance' },
  ]
};

export const COLORS = {
  primary: '#0f172a', // Slate 900
  secondary: '#0ea5e9', // Sky 500
  accent: '#22c55e', // Green 500 (Money/Success)
  background: '#f8fafc',
  surface: '#ffffff'
};