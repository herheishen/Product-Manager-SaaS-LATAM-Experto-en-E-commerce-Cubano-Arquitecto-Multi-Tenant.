
export enum UserRole {
  RESELLER = 'RESELLER', // "Gestor"
  SUPPLIER = 'SUPPLIER', // "Proveedor"
  ADMIN = 'ADMIN' // "Super Admin SaaS"
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING', // En preparación
  READY_FOR_PICKUP = 'READY_FOR_PICKUP', // Listo para mensajero
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED' // Problema reportado
}

export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ULTRA = 'ULTRA'
}

export enum SupplierStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum PayoutStatus {
  UNPAID = 'UNPAID', // Plataforma debe pagar al proveedor
  PROCESSING = 'PROCESSING',
  PAID = 'PAID'
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
  deliveryMethod?: 'PICKUP' | 'DELIVERY';
  deliveryAddress?: string;
  supplierId?: string; // Para tracking admin
}

export interface KPI {
  label: string;
  value: string | number;
  trend: number; 
  isPositive: boolean;
  subtext?: string;
}

// Interfaces Admin
export interface SupplierRequest {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  documentId: string; // CI
  status: SupplierStatus;
  registeredDate: string;
  inventoryCount: number;
}

export interface Payout {
  id: string;
  supplierName: string;
  amount: number;
  currency: 'CUP' | 'USD';
  period: string; // Ej: "Semana 42 - Oct"
  status: PayoutStatus;
  pendingOrders: number;
}
