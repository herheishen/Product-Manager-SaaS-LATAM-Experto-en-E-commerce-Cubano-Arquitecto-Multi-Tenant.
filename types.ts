
export enum UserRole {
  RESELLER = 'RESELLER', // "Gestor"
  SUPPLIER = 'SUPPLIER', // "Proveedor"
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ULTRA = 'ULTRA'
}

export interface PlanLimits {
  maxStores: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  hasCustomDomain: boolean;
  hasAdvancedStats: boolean;
  commissionRate: number; // Tasa de comisión de la plataforma
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceRetail: number; // Precio venta público (Sugerido)
  priceWholesale: number; // Precio mayorista (Costo para gestor)
  currency: 'USD' | 'CUP' | 'MLC';
  stock: number;
  supplierId: string;
  supplierName: string;
  category: string;
  imageUrl: string;
  isHot?: boolean; // Producto en tendencia
  minQuantity?: number; // Venta mínima (común en mayoristas)
}

export interface StoreConfig {
  name: string;
  subdomain: string; 
  themeColor: string;
  whatsappNumber: string;
  products: string[];
  planTier: PlanTier;
  acceptedPayments: {
    cash: boolean;
    transfermovil: boolean;
    zelle: boolean;
    usdt: boolean;
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  currency: string;
  status: OrderStatus;
  date: string;
  items: { productId: string; quantity: number; productName: string; price: number }[];
  commission: number; 
}

export interface KPI {
  label: string;
  value: string | number;
  trend: number; 
  isPositive: boolean;
  subtext?: string;
}
