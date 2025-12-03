
import { Product, Order, OrderStatus, KPI, PlanTier, PlanLimits, SupplierRequest, SupplierStatus, Payout, PayoutStatus, StoreProduct, PlanDetails, Notification, NotificationType, AIPrediction, AIPriceSuggestion, FraudAnalysis, Challenge } from '../types';

// --- DATA SEEDING (REAL CUBAN MARKET) ---

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-jabon',
    name: 'Jabón Perla (Paquete 5u)',
    description: 'Jabón de lavar original. Aroma limón. Ideal para reventa en bodegas.',
    priceRetail: 450,
    priceWholesale: 320,
    currency: 'CUP',
    stock: 200,
    supplierId: 's-ferre',
    supplierName: 'FerrePro Santiago',
    category: 'Aseo',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    minQuantity: 5,
    qualityScore: 95,
    supplierReputation: {
      fulfillmentRate: 98,
      dispatchTimeHours: 48,
      verified: true,
      trustScore: 92
    }
  },
  {
    id: 'p-arroz',
    name: 'Arroz Importado 5kg (Brasil)',
    description: 'Grano entero, 95% libre de impurezas. Saco sellado.',
    priceRetail: 1800,
    priceWholesale: 1450,
    currency: 'CUP',
    stock: 50,
    supplierId: 's-parque',
    supplierName: 'La Tienda del Parque',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    qualityScore: 99,
    supplierReputation: {
      fulfillmentRate: 100,
      dispatchTimeHours: 24,
      verified: true,
      trustScore: 96
    }
  },
  {
    id: 'p-plancha',
    name: 'Plancha Eléctrica Holstein',
    description: 'Anti-adherente. 110V. Garantía de 30 días con el proveedor.',
    priceRetail: 35,
    priceWholesale: 24,
    currency: 'USD',
    stock: 12,
    supplierId: 's-tech',
    supplierName: 'TechCuba Import',
    category: 'Electrodomésticos',
    imageUrl: 'https://images.unsplash.com/photo-1543472810-749eb3355554?auto=format&fit=crop&q=80&w=300',
    qualityScore: 90,
    supplierReputation: {
        fulfillmentRate: 88,
        dispatchTimeHours: 24,
        verified: true,
        trustScore: 85
    }
  },
  {
    id: 'p-filtro',
    name: 'Filtro de Agua Doméstico',
    description: 'Cerámica y carbón activado. Incluye adaptador para pila.',
    priceRetail: 15,
    priceWholesale: 9,
    currency: 'USD',
    stock: 40,
    supplierId: 's-ferre',
    supplierName: 'FerrePro Santiago',
    category: 'Hogar',
    imageUrl: 'https://images.unsplash.com/photo-1598209279122-8541213a0383?auto=format&fit=crop&q=80&w=300',
    qualityScore: 85,
    supplierReputation: {
        fulfillmentRate: 98,
        dispatchTimeHours: 48,
        verified: true,
        trustScore: 92
    }
  },
  {
    id: 'p-aceite',
    name: 'Aceite de Girasol (1 Litro)',
    description: 'Botella sellada. Marca Golden Chef o similar según disponibilidad.',
    priceRetail: 750,
    priceWholesale: 580,
    currency: 'CUP',
    stock: 150,
    supplierId: 's-parque',
    supplierName: 'La Tienda del Parque',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300',
    qualityScore: 94,
    supplierReputation: {
        fulfillmentRate: 100,
        dispatchTimeHours: 24,
        verified: true,
        trustScore: 96
    }
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1024',
    customerName: 'Yusimí González',
    customerPhone: '+53 52991234',
    total: 35,
    currency: 'USD',
    status: OrderStatus.CONFIRMED,
    date: '2023-10-25',
    items: [{ productId: 'p-plancha', quantity: 1, productName: 'Plancha Eléctrica', price: 35 }],
    commission: 11,
    deliveryMethod: 'DELIVERY',
    deliveryAddress: 'Calle 23 e/ L y M, Vedado',
    supplierId: 's-tech'
  },
  {
    id: 'ord-1025',
    customerName: 'Cafetería "El Paso"',
    customerPhone: '+53 58112233',
    total: 3600,
    currency: 'CUP',
    status: OrderStatus.DELIVERED,
    date: '2023-10-24',
    items: [{ productId: 'p-arroz', quantity: 2, productName: 'Arroz Importado 5kg', price: 1800 }],
    commission: 700,
    deliveryMethod: 'PICKUP',
    deliveryAddress: 'Almacén Central',
    supplierId: 's-parque'
  },
  {
    id: 'ord-1026',
    customerName: 'Carlos M.',
    customerPhone: '+53 54667788',
    total: 4500,
    currency: 'CUP',
    status: OrderStatus.PENDING,
    date: '2023-10-26',
    items: [{ productId: 'p-jabon', quantity: 10, productName: 'Jabón Perla', price: 450 }],
    commission: 1300,
    deliveryMethod: 'DELIVERY',
    deliveryAddress: 'Ave 51, Marianao',
    supplierId: 's-ferre'
  }
];

// Admin Mock Data - Real Suppliers
const MOCK_SUPPLIER_REQUESTS: SupplierRequest[] = [
  {
    id: 'req-parque',
    businessName: 'La Tienda del Parque',
    legalType: 'TCP',
    address: 'Calle 30, Playa, La Habana',
    ownerName: 'Juan Carlos Silva',
    phone: '+53 52223344',
    documentId: '85010122334',
    status: SupplierStatus.VERIFIED,
    registeredDate: '2023-09-10',
    inventoryCount: 450
  },
  {
    id: 'req-ferre',
    businessName: 'FerrePro Santiago',
    legalType: 'MIPYME',
    address: 'Vista Alegre, Santiago de Cuba',
    ownerName: 'Marta Elena R.',
    phone: '+53 58889900',
    documentId: '90121266778',
    status: SupplierStatus.VERIFIED,
    registeredDate: '2023-09-15',
    inventoryCount: 1200
  },
  {
    id: 'req-tech',
    businessName: 'TechCuba Import',
    legalType: 'MIPYME',
    address: 'Miramar, Playa',
    ownerName: 'Alejandro G.',
    phone: '+53 59990000',
    documentId: '95121266778',
    status: SupplierStatus.PENDING,
    registeredDate: '2023-10-20',
    inventoryCount: 50
  }
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'pay-001',
    supplierName: 'FerrePro Santiago',
    amount: 15000,
    currency: 'CUP',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.UNPAID,
    pendingOrders: 8
  },
  {
    id: 'pay-002',
    supplierName: 'La Tienda del Parque',
    amount: 240,
    currency: 'USD',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.PROCESSING,
    pendingOrders: 0
  }
];

// Mock Notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: NotificationType.STOCK_ALERT,
    title: '⚠️ Stock Bajo: Filtro de Agua',
    message: 'FerrePro reporta menos de 5 unidades. Considera pausar la venta.',
    date: 'Hace 15 min',
    read: false,
    priority: 'HIGH',
    relatedProductId: 'p-filtro'
  },
  {
    id: 'n2',
    type: NotificationType.PRICE_CHANGE,
    title: 'Baja de Precio: Jabón Perla',
    message: 'Ahora a 320 CUP (antes 340). ¡Ajusta tu margen!',
    date: 'Hace 1 hora',
    read: false,
    priority: 'MEDIUM',
    relatedProductId: 'p-jabon'
  }
];

// Mock Challenges
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Iniciación',
    description: 'Vende tu primer "Combo de Aseo".',
    target: 1,
    current: 0,
    reward: 'Badge "Vendedor Novato"',
    deadline: '7 días',
    type: 'SALES',
    icon: 'ROCKET'
  },
  {
    id: 'c2',
    title: 'Dominio de Redes',
    description: 'Comparte 5 productos en Facebook.',
    target: 5,
    current: 2,
    reward: 'Comisión reducida 2%',
    deadline: '24 horas',
    type: 'SHARES',
    icon: 'FIRE'
  }
];

// Simulate Network Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- CRITICAL VALIDATION LOGIC ---

export const validateCubanCI = (ci: string): boolean => {
  return /^\d{11}$/.test(ci);
};

export const validateCubanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return /^53[56]\d{7}$/.test(cleaned);
};

export const checkProductCompliance = (name: string, description: string): { allowed: boolean, reason?: string } => {
  const forbiddenKeywords = ['antibiotico', 'azitromicina', 'dolar', 'euro', 'mlc', 'droga', 'arma'];
  const text = (name + ' ' + description).toLowerCase();
  for (const word of forbiddenKeywords) {
    if (text.includes(word)) {
      return { allowed: false, reason: `Contiene término prohibido: "${word}"` };
    }
  }
  return { allowed: true };
};

// --- SERVICES ---

export const getProducts = async (): Promise<Product[]> => {
  await delay(600);
  return MOCK_PRODUCTS.filter(p => (p.qualityScore || 0) > 50);
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(500);
  return MOCK_ORDERS; 
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  await delay(500);
  return true;
};

export const getSupplierOrders = async (): Promise<Order[]> => {
  await delay(500);
  return MOCK_ORDERS.filter(o => o.supplierId === 's-ferre'); // Mock logged in as FerrePro
};

export const getResellerKPIs = async (): Promise<KPI[]> => {
  return [
    { label: 'Ganancia Neta', value: '4,500 CUP', trend: 15.2, isPositive: true, subtext: '+ $30 USD (Zelle)' },
    { label: 'Pedidos Activos', value: '3', trend: 0, isPositive: true, subtext: '1 listo para entrega' },
    { label: 'Visitas Tienda', value: '142', trend: -5, isPositive: false, subtext: 'Baja conversión hoy' },
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
        features: { customDomain: false, removeBranding: false, advancedAnalytics: false, apiAccess: false, automatedPricing: false, prioritySupport: false, localDropshipping: false }
      };
    case PlanTier.PRO:
      return { 
        maxStores: 3, 
        maxProducts: 500, 
        maxOrdersPerMonth: 200, 
        commissionRate: 0.02,
        features: { customDomain: true, removeBranding: true, advancedAnalytics: true, apiAccess: false, automatedPricing: true, prioritySupport: true, localDropshipping: false }
      };
    case PlanTier.ULTRA:
      return { 
        maxStores: 9999, 
        maxProducts: 9999, 
        maxOrdersPerMonth: 9999, 
        commissionRate: 0,
        features: { customDomain: true, removeBranding: true, advancedAnalytics: true, apiAccess: true, automatedPricing: true, prioritySupport: true, localDropshipping: true }
      };
    default: return getPlanLimits(PlanTier.FREE);
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

export const getMyStoreProducts = async (): Promise<StoreProduct[]> => {
  await delay(500);
  return MOCK_PRODUCTS.slice(0, 3).map((p, idx) => ({
    ...p,
    customRetailPrice: p.priceRetail,
    isActive: idx !== 1,
    addedAt: '2023-10-20',
    profitMargin: p.priceRetail - p.priceWholesale
  }));
};

export const updateStoreProductPrice = async (productId: string, newPrice: number): Promise<boolean> => {
  await delay(300);
  return true;
};

export const submitPublicOrder = async (order: any): Promise<{success: boolean, orderId: string}> => {
  await delay(1000);
  return { success: true, orderId: `ORD-${Math.floor(Math.random() * 10000)}` };
};

export const getRecentNotifications = async (): Promise<Notification[]> => {
  await delay(400);
  return MOCK_NOTIFICATIONS;
};

// Admin & Other Services (Mock implementations)
export const getAdminStats = async (): Promise<KPI[]> => {
  await delay(400);
  return [
    { label: 'GMV (Volumen)', value: '$12.5k USD', trend: 22, isPositive: true, subtext: 'Mes actual' },
    { label: 'Revenue SaaS', value: '$850 USD', trend: 8, isPositive: true, subtext: 'Suscripciones' },
    { label: 'Proveedores', value: '3', trend: 1, isPositive: true, subtext: 'Verificados' },
    { label: 'Gestores', value: '142', trend: 12, isPositive: true, subtext: 'Activos' },
  ];
};

export const getSupplierRequests = async (): Promise<SupplierRequest[]> => {
  await delay(500);
  return MOCK_SUPPLIER_REQUESTS;
};

export const verifySupplier = async (supplierId: string, status: SupplierStatus): Promise<boolean> => {
  await delay(1000);
  return true;
};

export const getPendingPayouts = async (): Promise<Payout[]> => {
  await delay(500);
  return MOCK_PAYOUTS;
};

export const getSupplierStats = async (): Promise<KPI[]> => {
  await delay(300);
  return [
    { label: 'Ventas Totales', value: '$2,400 USD', trend: 18, isPositive: true, subtext: 'Semana actual' },
    { label: 'Inventario', value: '1,200 un.', trend: -2, isPositive: false, subtext: 'Stock total' },
    { label: 'Revendedores', value: '15', trend: 4, isPositive: true, subtext: 'Vendiendo tus productos' }
  ];
};

export const getSupplierProducts = async (): Promise<Product[]> => {
  await delay(400);
  return MOCK_PRODUCTS.filter(p => p.supplierId === 's-ferre'); 
};

export const createProduct = async (productData: any): Promise<boolean> => {
  await delay(1000);
  return true;
};

export const updateProductStock = async (productId: string, delta: number): Promise<boolean> => {
  await delay(200);
  return true;
};

// AI Services
export const generateSmartCopy = async (productName: string, price: number, currency: string, description: string): Promise<string> => {
  await delay(600);
  return `🔥 *${productName.toUpperCase()}* 🔥\n\n${description}\n\n💰 Precio: ${price} ${currency}\n📍 Entregas en toda La Habana\n🚀 ¡Escribe ya que se acaban!`;
};

export const getInventoryPredictions = async (): Promise<AIPrediction[]> => {
  await delay(800);
  return MOCK_PRODUCTS.slice(0, 3).map(p => ({
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    burnRatePerDay: Math.floor(Math.random() * 5) + 1,
    daysUntilStockout: Math.floor(p.stock / 2),
    recommendation: p.stock < 10 ? 'RESTOCK_NOW' : 'NORMAL'
  }));
};

export const getSmartPriceSuggestion = async (productId: string, basePrice: number, zone: string): Promise<AIPriceSuggestion> => {
  await delay(500);
  return {
    productId,
    suggestedPrice: Math.round(basePrice * 1.3),
    reasoning: 'Margen sugerido del 30% para zona Playa.',
    zoneMultiplier: 1.3
  };
};

export const analyzeFraudRisk = async (orderTotal: number, customerPhone: string): Promise<FraudAnalysis> => {
    return { orderId: 'x', riskScore: 10, riskLevel: 'LOW', flags: [] };
};

export const getActiveChallenges = async (): Promise<Challenge[]> => {
  await delay(400);
  return MOCK_CHALLENGES;
};

export const generateSocialAsset = async (productId: string, type: 'STORY' | 'POST'): Promise<string> => {
  await delay(1000);
  return MOCK_PRODUCTS.find(p => p.id === productId)?.imageUrl || '';
};
