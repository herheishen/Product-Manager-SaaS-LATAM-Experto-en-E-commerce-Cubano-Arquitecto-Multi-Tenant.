
import { LayoutDashboard, Package, Users, DollarSign, ShoppingBag, Truck, Settings, ShieldCheck, FileText, Activity, Zap, ClipboardList, Store, Megaphone, HelpCircle, Headphones, Palette, Star, MessageCircle } from 'lucide-react';

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

export const PRODUCT_CATEGORIES = [
  "Alimentos", "Aseo Personal", "Aseo Hogar", "Electrónica", "Hogar", "Automotriz", "Moda", "Construcción", "Otros"
];

export const PAYMENT_METHODS = [ // Used in PublicStore for clarity
  "Efectivo", "Transfermóvil", "Zelle", "USDT"
]

export const NAVIGATION_ITEMS = {
  RESELLER: [
    { name: 'Inicio', icon: LayoutDashboard, path: '/' },
    { name: 'Mercado', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Mi Tienda', icon: Store, path: '/my-store' },
    { name: 'Pedidos', icon: ClipboardList, path: '/orders' },
    { name: 'Marketing', icon: Megaphone, path: '/marketing' }, // New tab in StoreManager
    { name: 'Suscripción', icon: Zap, path: '/subscription' },
    { name: 'Ajustes', icon: Settings, path: '/settings' },
    { name: 'Soporte', icon: HelpCircle, path: '/help' },
  ],
  SUPPLIER: [
    { name: 'Resumen', icon: LayoutDashboard, path: '/' },
    { name: 'Inventario', icon: Package, path: '/inventory' },
    { name: 'Despacho', icon: ClipboardList, path: '/dispatch' },
    { name: 'Finanzas', icon: DollarSign, path: '/finance' },
    { name: 'Mi Perfil', icon: Store, path: '/profile' },
    { name: 'Soporte', icon: HelpCircle, path: '/help' },
  ],
  ADMIN: [
    { name: 'Control', icon: LayoutDashboard, path: '/' },
    { name: 'Proveedores', icon: ShieldCheck, path: '/admin/suppliers' },
    { name: 'Gestores', icon: Users, path: '/admin/resellers' },
    { name: 'Productos', icon: Package, path: '/admin/products' },
    { name: 'Órdenes', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Finanzas', icon: DollarSign, path: '/admin/finance' },
    { name: 'Logística', icon: Truck, path: '/admin/logistics' },
    { name: 'Sistema', icon: Settings, path: '/admin/settings' },
    { name: 'Soporte', icon: Headphones, path: '/admin/tickets' },
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
