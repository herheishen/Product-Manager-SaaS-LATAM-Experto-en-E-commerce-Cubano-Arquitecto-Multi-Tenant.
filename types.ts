
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

export enum NotificationType {
  STOCK_ALERT = 'STOCK_ALERT', // Critical: Stock bajo o agotado
  PRICE_CHANGE = 'PRICE_CHANGE', // Important: Margen afectado
  SYSTEM = 'SYSTEM', // Mantenimiento, etc.
  COMPLIANCE_WARNING = 'COMPLIANCE_WARNING' // Producto eliminado por ilegal
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  relatedProductId?: string;
}

export interface PlanLimits {
  maxStores: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  commissionRate: number; // Tasa de comisión de la plataforma
  features: {
    customDomain: boolean;
    removeBranding: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    automatedPricing: boolean;
    prioritySupport: boolean;
    localDropshipping: boolean;
  };
}

export interface PlanDetails {
  id: PlanTier;
  name: string;
  priceUSD: number;
  priceCUP: number; // Aproximado fijo
  description: string;
  limits: PlanLimits;
}

export interface SupplierReputation {
  fulfillmentRate: number; // 0-100%
  dispatchTimeHours: number;
  verified: boolean;
  trustScore: number; // 0-100 calculated
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
  qualityScore?: number; // 0-100 internal score for anti-spam
  supplierReputation?: SupplierReputation;
}

export interface StoreProduct extends Product {
  customRetailPrice: number; // Precio definido por el gestor
  isActive: boolean;
  addedAt: string;
  profitMargin: number; // Calculated (Retail - Wholesale)
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

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  currency: 'USD' | 'CUP' | 'MLC';
  supplierId: string;
}

export interface CheckoutDetails {
  customerName: string;
  phone: string;
  address: string;
  municipality: string;
  paymentMethod: string;
  notes?: string;
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
export interface VerificationResult {
  validCI: boolean;
  validPhone: boolean;
  backgroundCheck: 'CLEAN' | 'FLAGGED';
  notes?: string;
}

export interface SupplierRequest {
  id: string;
  businessName: string;
  legalType: 'TCP' | 'MIPYME' | 'NATURAL';
  address: string;
  ownerName: string;
  phone: string;
  documentId: string; // CI
  status: SupplierStatus;
  registeredDate: string;
  inventoryCount: number;
  verificationData?: VerificationResult;
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

// Interfaces IA
export interface AIPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  burnRatePerDay: number; // Ventas diarias promedio
  daysUntilStockout: number;
  recommendation: 'RESTOCK_NOW' | 'NORMAL' | 'OVERSTOCK';
}

export interface AIPriceSuggestion {
  productId: string;
  suggestedPrice: number;
  reasoning: string;
  zoneMultiplier: number;
}

export interface FraudAnalysis {
  orderId: string;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

// Gamification & Marketing
export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  deadline: string;
  type: 'SALES' | 'SHARES' | 'REVIEWS';
  icon: 'FIRE' | 'TROPHY' | 'STAR' | 'ROCKET';
}
