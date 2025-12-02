
import { Product, Order, OrderStatus, KPI, PlanTier, PlanLimits, SupplierRequest, SupplierStatus, Payout, PayoutStatus, StoreProduct, PlanDetails } from '../types';

// Mock Data - Mercado Cubano Realista (Combos, Aseo, Electrónica)
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Combo de Aseo Familiar (Detergente + Jabón + Pasta)',
    description: 'Incluye 2kg de detergente, 5 jabones de baño y 2 pastas dentales. Importado.',
    priceRetail: 2500,
    priceWholesale: 1900,
    currency: 'CUP',
    stock: 50,
    supplierId: 's2',
    supplierName: 'Abastos Habana',
    category: 'Combos',
    imageUrl: 'https://images.unsplash.com/photo-1583947581924-860b81593810?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    qualityScore: 98,
    supplierReputation: {
      fulfillmentRate: 99,
      dispatchTimeHours: 24,
      verified: true,
      trustScore: 95
    }
  },
  {
    id: 'p2',
    name: 'Zapatillas Nike Air Force 1 (Replica AAA)',
    description: 'Calidad top. Tallas 36-44. Caja incluida. Garantía de 7 días por defecto.',
    priceRetail: 55,
    priceWholesale: 35,
    currency: 'USD',
    stock: 12,
    supplierId: 's1',
    supplierName: 'Importadora Vedado',
    category: 'Calzado',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    qualityScore: 95,
    supplierReputation: {
      fulfillmentRate: 92,
      dispatchTimeHours: 48,
      verified: true,
      trustScore: 88
    }
  },
  {
    id: 'p3',
    name: 'Split Royal 1T Inverter 220V',
    description: 'Nuevo en caja. Transporte incluido en La Habana. Instalación no incluida.',
    priceRetail: 420,
    priceWholesale: 360,
    currency: 'USD',
    stock: 5,
    supplierId: 's1',
    supplierName: 'Electro Import',
    category: 'Electrodomésticos',
    imageUrl: 'https://images.unsplash.com/photo-1585642686001-2a9443597c55?auto=format&fit=crop&q=80&w=300',
    qualityScore: 90,
    supplierReputation: {
        fulfillmentRate: 85,
        dispatchTimeHours: 72,
        verified: true,
        trustScore: 82
    }
  },
  {
    id: 'p4',
    name: 'Aceite de Girasol (Caja 15L)',
    description: 'Formato mayorista. Ideal para revender por botella o para cafeterías.',
    priceRetail: 12000,
    priceWholesale: 9500,
    currency: 'CUP',
    stock: 20,
    supplierId: 's3',
    supplierName: 'Distribuidora Local',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300',
    minQuantity: 1,
    qualityScore: 85,
    supplierReputation: {
        fulfillmentRate: 80,
        dispatchTimeHours: 24,
        verified: false,
        trustScore: 65
    }
  },
  {
    id: 'p5',
    name: 'Powerbank Xiaomi 20000mAh (Original)',
    description: 'Carga rápida 18W. Indispensable para apagones. Varios colores.',
    priceRetail: 35,
    priceWholesale: 22,
    currency: 'USD',
    stock: 25,
    supplierId: 's1',
    supplierName: 'TecnoStore Cuba',
    category: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1609592425026-c27702581639?auto=format&fit=crop&q=80&w=300',
    qualityScore: 92,
    supplierReputation: {
        fulfillmentRate: 94,
        dispatchTimeHours: 12,
        verified: true,
        trustScore: 91
    }
  },
  {
    id: 'p6',
    name: 'Picadillo de Pavo (Tubo 400g)',
    description: 'Congelado. Venta mínima 10 tubos. Recogida en almacén o mensajería refrigerada.',
    priceRetail: 220,
    priceWholesale: 150,
    currency: 'CUP',
    stock: 500,
    supplierId: 's2',
    supplierName: 'Abastos Habana',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1594511877685-64de855d0452?auto=format&fit=crop&q=80&w=300',
    qualityScore: 88,
    supplierReputation: {
        fulfillmentRate: 99,
        dispatchTimeHours: 24,
        verified: true,
        trustScore: 95
    }
  },
  {
    id: 'p7',
    name: 'Cerveza Cristal (Caja 24u)',
    description: 'Producto nacional. Entrega inmediata en Playa y Marianao.',
    priceRetail: 4800,
    priceWholesale: 4200,
    currency: 'CUP',
    stock: 100,
    supplierId: 's3',
    supplierName: 'Distribuidora Local',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1606859188014-d67b209e5306?auto=format&fit=crop&q=80&w=300',
    qualityScore: 40, // Low quality score example (spammy post)
    supplierReputation: {
        fulfillmentRate: 60,
        dispatchTimeHours: 96,
        verified: false,
        trustScore: 45
    }
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    customerName: 'Yusimí González',
    customerPhone: '+53 52991234',
    total: 55,
    currency: 'USD',
    status: OrderStatus.CONFIRMED,
    date: '2023-10-25',
    items: [{ productId: 'p2', quantity: 1, productName: 'Zapatillas Nike AF1', price: 55 }],
    commission: 20,
    deliveryMethod: 'DELIVERY',
    supplierId: 's1'
  },
  {
    id: 'ord-002',
    customerName: 'Cafetería "El Paso"',
    customerPhone: '+53 58112233',
    total: 12000,
    currency: 'CUP',
    status: OrderStatus.DELIVERED,
    date: '2023-10-24',
    items: [{ productId: 'p4', quantity: 1, productName: 'Aceite Girasol Caja 15L', price: 12000 }],
    commission: 2500,
    deliveryMethod: 'PICKUP',
    supplierId: 's3'
  },
  {
    id: 'ord-003',
    customerName: 'Carlos M.',
    customerPhone: '+53 54667788',
    total: 35,
    currency: 'USD',
    status: OrderStatus.PENDING,
    date: '2023-10-26',
    items: [{ productId: 'p5', quantity: 1, productName: 'Powerbank Xiaomi', price: 35 }],
    commission: 13,
    deliveryMethod: 'DELIVERY',
    supplierId: 's1'
  }
];

// Admin Mock Data
const MOCK_SUPPLIER_REQUESTS: SupplierRequest[] = [
  {
    id: 'req-01',
    businessName: 'Bodega Vedado Import',
    ownerName: 'Roberto Pérez',
    phone: '+53 55551111',
    documentId: '89101022334',
    status: SupplierStatus.PENDING,
    registeredDate: '2023-10-26',
    inventoryCount: 150
  },
  {
    id: 'req-02',
    businessName: 'MIPYME "El Habanero"',
    ownerName: 'Maria Rodríguez',
    phone: '+53 52223344',
    documentId: '75050599887',
    status: SupplierStatus.PENDING,
    registeredDate: '2023-10-25',
    inventoryCount: 45
  },
  {
    id: 'req-03',
    businessName: 'TechnoCell 23',
    ownerName: 'Alejandro G.',
    phone: '+53 59990000',
    documentId: '95121266778',
    status: SupplierStatus.VERIFIED,
    registeredDate: '2023-10-20',
    inventoryCount: 300
  }
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'pay-01',
    supplierName: 'Importadora Vedado',
    amount: 350,
    currency: 'USD',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.UNPAID,
    pendingOrders: 12
  },
  {
    id: 'pay-02',
    supplierName: 'Abastos Habana',
    amount: 45000,
    currency: 'CUP',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.PROCESSING,
    pendingOrders: 5
  }
];

// Simulate Network Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (): Promise<Product[]> => {
  await delay(600);
  // Filter out very low quality products (Anti-Spam basics)
  return MOCK_PRODUCTS.filter(p => (p.qualityScore || 0) > 50);
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(500);
  return MOCK_ORDERS;
};

export const getResellerKPIs = async (): Promise<KPI[]> => {
  return [
    { label: 'Ganancia Neta (Mes)', value: '$128 USD', trend: 15.2, isPositive: true, subtext: '+ 4,500 CUP (Mixto)' },
    { label: 'Pedidos Completados', value: '12', trend: 5, isPositive: true, subtext: '8 pendientes de cobro' },
    { label: 'Tasa de Cierre', value: '65%', trend: -2, isPositive: false, subtext: 'WhatsApp Conversion' },
  ];
};

export const getPlanLimits = (tier: PlanTier): PlanLimits => {
  switch (tier) {
    case PlanTier.FREE:
      return { 
        maxStores: 1, 
        maxProducts: 25, 
        maxOrdersPerMonth: 10, 
        commissionRate: 0.05,
        features: {
          customDomain: false,
          removeBranding: false,
          advancedAnalytics: false,
          apiAccess: false,
          automatedPricing: false,
          prioritySupport: false,
          localDropshipping: false
        }
      };
    case PlanTier.PRO:
      return { 
        maxStores: 3, 
        maxProducts: 500, 
        maxOrdersPerMonth: 200, 
        commissionRate: 0.02,
        features: {
          customDomain: true,
          removeBranding: true,
          advancedAnalytics: true,
          apiAccess: false,
          automatedPricing: true,
          prioritySupport: true,
          localDropshipping: false
        }
      };
    case PlanTier.ULTRA:
      return { 
        maxStores: 9999, 
        maxProducts: 9999, 
        maxOrdersPerMonth: 9999, 
        commissionRate: 0,
        features: {
          customDomain: true,
          removeBranding: true,
          advancedAnalytics: true,
          apiAccess: true,
          automatedPricing: true,
          prioritySupport: true,
          localDropshipping: true
        }
      };
    default:
      return getPlanLimits(PlanTier.FREE);
  }
};

export const getSubscriptionPlans = async (): Promise<PlanDetails[]> => {
  await delay(300);
  return [
    {
      id: PlanTier.FREE,
      name: 'Plan Entrada',
      priceUSD: 0,
      priceCUP: 0,
      description: 'Ideal para validar tu idea de negocio sin arriesgar capital.',
      limits: getPlanLimits(PlanTier.FREE)
    },
    {
      id: PlanTier.PRO,
      name: 'Plan Emprendedor',
      priceUSD: 9,
      priceCUP: 2800,
      description: 'Para quienes ya tienen ventas recurrentes y quieren marca propia.',
      limits: getPlanLimits(PlanTier.PRO)
    },
    {
      id: PlanTier.ULTRA,
      name: 'Plan Distribuidor',
      priceUSD: 29,
      priceCUP: 9000,
      description: 'Potencia de agencia. Acceso a API y herramientas de logística.',
      limits: getPlanLimits(PlanTier.ULTRA)
    }
  ];
};

// --- New Services for Store Management ---

export const getMyStoreProducts = async (): Promise<StoreProduct[]> => {
  await delay(500);
  // Simulating products the reseller has added to their store
  // We take the first 4 items from MOCK_PRODUCTS
  return MOCK_PRODUCTS.slice(0, 4).map((p, idx) => ({
    ...p,
    customRetailPrice: p.priceRetail, // Default to suggested retail
    isActive: idx !== 2, // Simulate one inactive product
    addedAt: '2023-10-20',
    profitMargin: p.priceRetail - p.priceWholesale
  }));
};

export const updateStoreProductPrice = async (productId: string, newPrice: number): Promise<boolean> => {
  await delay(300);
  return true;
};

export const toggleProductStatus = async (productId: string, isActive: boolean): Promise<boolean> => {
  await delay(300);
  return true;
};

export const submitPublicOrder = async (order: any): Promise<{success: boolean, orderId: string}> => {
  await delay(1000);
  return { success: true, orderId: `ORD-${Math.floor(Math.random() * 10000)}` };
};

// Admin Services
export const getAdminStats = async (): Promise<KPI[]> => {
  await delay(400);
  return [
    { label: 'GMV (Volumen Total)', value: '$12.5k USD', trend: 22, isPositive: true, subtext: 'Mes actual' },
    { label: 'Ingresos SaaS', value: '$850 USD', trend: 8, isPositive: true, subtext: 'Suscripciones Activas' },
    { label: 'Proveedores Pendientes', value: '5', trend: 0, isPositive: false, subtext: 'Requieren Verificación' },
    { label: 'Gestores Activos', value: '142', trend: 12, isPositive: true, subtext: '12 nuevos esta semana' },
  ];
};

export const getSupplierRequests = async (): Promise<SupplierRequest[]> => {
  await delay(500);
  return MOCK_SUPPLIER_REQUESTS;
};

export const getPendingPayouts = async (): Promise<Payout[]> => {
  await delay(500);
  return MOCK_PAYOUTS;
};
