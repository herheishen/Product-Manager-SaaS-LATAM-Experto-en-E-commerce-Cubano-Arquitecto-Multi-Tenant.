
import { ChartColumn, Package, Users, DollarSign, ShoppingBag, Truck, Settings, ShieldCheck, FileText, Activity, Zap } from 'lucide-react';

export const APP_NAME = "Kiosko.cu";

export const CURRENCY_RATES = {
  USD_TO_CUP: 320, // Real-time market approximation
  MLC_TO_CUP: 270
};

export const MUNICIPIOS_HABANA = [
  "Playa", "Plaza de la Revolución", "Centro Habana", "La Habana Vieja", "Regla", "La Habana del Este", 
  "Guanabacoa", "San Miguel del Padrón", "Diez de Octubre", "Cerro", "Marianao", "La Lisa", 
  "Boyeros", "Arroyo Naranjo", "Cotorro"
];

export const NAVIGATION_ITEMS = {
  RESELLER: [
    { name: 'Dashboard', icon: ChartColumn, path: '/' },
    { name: 'Mercado (Dropshipping)', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Mi Tienda', icon: Settings, path: '/my-store' },
    { name: 'Pedidos', icon: Package, path: '/orders' },
    { name: 'Planes y Facturación', icon: Zap, path: '/subscription' },
  ],
  SUPPLIER: [
    { name: 'Dashboard', icon: ChartColumn, path: '/' },
    { name: 'Inventario', icon: Package, path: '/inventory' },
    { name: 'Gestores Activos', icon: Users, path: '/resellers' },
    { name: 'Finanzas', icon: DollarSign, path: '/finance' },
  ],
  ADMIN: [
    { name: 'Control Maestro', icon: Activity, path: '/' },
    { name: 'Proveedores (KYC)', icon: ShieldCheck, path: '/admin/suppliers' },
    { name: 'Logística Global', icon: Truck, path: '/admin/logistics' },
    { name: 'Finanzas SaaS', icon: DollarSign, path: '/admin/finance' },
  ]
};

export const COLORS = {
  primary: '#0f172a', // Slate 900
  secondary: '#0ea5e9', // Sky 500
  accent: '#22c55e', // Green 500 (Money/Success)
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  background: '#f8fafc',
  surface: '#ffffff'
};
