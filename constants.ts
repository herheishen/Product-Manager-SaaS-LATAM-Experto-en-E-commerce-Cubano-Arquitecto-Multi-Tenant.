import { ChartColumn, Package, Users, DollarSign, ShoppingBag, Truck, Settings, ShieldCheck, FileText, Activity, Zap, ClipboardList } from 'lucide-react';

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
    { name: 'Mercado', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Mi Tienda', icon: Settings, path: '/my-store' },
    { name: 'Pedidos', icon: Package, path: '/orders' },
    { name: 'Suscripción', icon: Zap, path: '/subscription' },
  ],
  SUPPLIER: [
    { name: 'Dashboard', icon: ChartColumn, path: '/' },
    { name: 'Inventario', icon: Package, path: '/inventory' },
    { name: 'Despacho', icon: ClipboardList, path: '/dispatch' },
    { name: 'Gestores', icon: Users, path: '/resellers' },
    { name: 'Finanzas', icon: DollarSign, path: '/finance' },
  ],
  ADMIN: [
    { name: 'Control', icon: Activity, path: '/' },
    { name: 'Proveedores', icon: ShieldCheck, path: '/admin/suppliers' },
    { name: 'Logística', icon: Truck, path: '/admin/logistics' },
    { name: 'Finanzas', icon: DollarSign, path: '/admin/finance' },
  ]
};

export const COLORS = {
  primary: '#0f172a', // Slate 900
  secondary: '#64748b', // Slate 500
  accent: '#4f46e5', // Indigo 600
  success: '#059669', // Emerald 600
  warning: '#d97706', // Amber 600
  error: '#e11d48', // Rose 600
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0'
};