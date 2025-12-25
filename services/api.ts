import { Product, Order, OrderStatus, KPI, PlanTier, PlanLimits, SupplierRequest, SupplierStatus, Payout, PayoutStatus, StoreProduct, PlanDetails, Notification, NotificationType, AIPrediction, AIPriceSuggestion, FraudAnalysis, Challenge, StoreConfig, UserRole } from '../types';
import { MUNICIPIOS_HABANA } from '../constants';

// --- DATA SEEDING (REAL CUBAN MARKET) ---

// Fix: Explicitly type MOCK_SUPPLIERS to ensure `legalType` is correctly inferred as a union type, not just string.
const MOCK_SUPPLIERS: SupplierRequest[] = [
  {
    id: 's-cerro',
    businessName: 'Almacenes El Cerro',
    legalType: 'MIPYME',
    address: 'Ave. 31 #1234, El Cerro, La Habana',
    ownerName: 'Manuel Fonseca',
    phone: '+5352123456',
    documentId: '68010112345',
    status: SupplierStatus.VERIFIED,
    registeredDate: '2023-10-01',
    inventoryCount: 500,
    fulfillmentRate: 98,
    dispatchTimeHours: 24,
    trustScore: 95
  },
  {
    id: 's-electro',
    businessName: 'ElectroCosto Oriente',
    legalType: 'TCP',
    address: 'Calle Enramada, Santiago de Cuba',
    ownerName: 'Anaís Rojas',
    phone: '+5353987654',
    documentId: '75060698765',
    status: SupplierStatus.VERIFIED,
    registeredDate: '2023-10-05',
    inventoryCount: 120,
    fulfillmentRate: 92,
    dispatchTimeHours: 48,
    trustScore: 88
  },
  {
    id: 's-mesa',
    businessName: 'TuMesa.cu (Agropecuaria)',
    legalType: 'MIPYME',
    address: 'Rancho Boyeros Km 3, La Habana',
    ownerName: 'Roberto Gómez',
    phone: '+5354567890',
    documentId: '80030345678',
    status: SupplierStatus.PENDING,
    registeredDate: '2023-10-15',
    inventoryCount: 0,
    fulfillmentRate: 0,
    dispatchTimeHours: 0,
    trustScore: 0
  }
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-jabon-esplendor',
    name: 'Jabón de Baño "Esplendor" (Paquete 3u)',
    description: 'Jabón suave de tocador. Para piel sensible. Paquete de 3 unidades.',
    priceRetail: 3.50, // USD
    priceWholesale: 2.50, // USD
    currency: 'USD',
    stock: 180,
    supplierId: 's-cerro',
    supplierName: MOCK_SUPPLIERS.find(s => s.id === 's-cerro')?.businessName || '',
    category: 'Aseo Personal',
    imageUrl: 'https://images.unsplash.com/photo-1621644754593-39f1c75c87e6?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    minQuantity: 1,
    qualityScore: 95,
    // Fix: Extract only relevant fields for supplierReputation
    supplierReputation: {
      fulfillmentRate: MOCK_SUPPLIERS[0].fulfillmentRate,
      dispatchTimeHours: MOCK_SUPPLIERS[0].dispatchTimeHours,
      verified: MOCK_SUPPLIERS[0].status === SupplierStatus.VERIFIED, // Use status for verified
      trustScore: MOCK_SUPPLIERS[0].trustScore,
    }
  },
  {
    id: 'p-arroz-5kg',
    name: 'Arroz Grano Largo (Saco 5kg)',
    description: 'Arroz de alta calidad, grano largo. Ideal para consumo familiar.',
    priceRetail: 9.00, // USD
    priceWholesale: 6.80, // USD
    currency: 'USD',
    stock: 120,
    supplierId: 's-cerro',
    supplierName: MOCK_SUPPLIERS.find(s => s.id === 's-cerro')?.businessName || '',
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1546747190-7d7213824128?auto=format&fit=crop&q=80&w=300',
    isHot: true,
    minQuantity: 1,
    qualityScore: 99,
    // Fix: Extract only relevant fields for supplierReputation
    supplierReputation: {
      fulfillmentRate: MOCK_SUPPLIERS[0].fulfillmentRate,
      dispatchTimeHours: MOCK_SUPPLIERS[0].dispatchTimeHours,
      verified: MOCK_SUPPLIERS[0].status === SupplierStatus.VERIFIED,
      trustScore: MOCK_SUPPLIERS[0].trustScore,
    }
  },
  {
    id: 'p-plancha-holstein',
    name: 'Plancha Eléctrica Holstein (110V)',
    description: 'Plancha de vapor con suela antiadherente. 110V. Incluye vaso medidor.',
    priceRetail: 30.00, // USD
    priceWholesale: 22.00, // USD
    currency: 'USD',
    stock: 45,
    supplierId: 's-electro',
    supplierName: MOCK_SUPPLIERS.find(s => s.id === 's-electro')?.businessName || '',
    category: 'Electrodomésticos',
    imageUrl: 'https://images.unsplash.com/photo-1543472810-749eb3355554?auto=format&fit=crop&q=80&w=300',
    minQuantity: 1,
    qualityScore: 90,
    // Fix: Extract only relevant fields for supplierReputation
    supplierReputation: {
      fulfillmentRate: MOCK_SUPPLIERS[1].fulfillmentRate,
      dispatchTimeHours: MOCK_SUPPLIERS[1].dispatchTimeHours,
      verified: MOCK_SUPPLIERS[1].status === SupplierStatus.VERIFIED,
      trustScore: MOCK_SUPPLIERS[1].trustScore,
    }
  },
  {
    id: 'p-filtro-agua',
    name: 'Filtro de Agua Básico (Cerámica)',
    description: 'Filtro purificador de agua de mesa con cartucho de cerámica.',
    priceRetail: 12.00, // USD
    priceWholesale: 8.50, // USD
    currency: 'USD',
    stock: 70,
    supplierId: 's-electro',
    supplierName: MOCK_SUPPLIERS.find(s => s.id === 's-electro')?.businessName || '',
    category: 'Hogar',
    imageUrl: 'https://images.unsplash.com/photo-1598209279122-8541213a0383?auto=format&fit=crop&q=80&w=300',
    minQuantity: 1,
    qualityScore: 85,
    // Fix: Extract only relevant fields for supplierReputation
    supplierReputation: {
      fulfillmentRate: MOCK_SUPPLIERS[1].fulfillmentRate,
      dispatchTimeHours: MOCK_SUPPLIERS[1].dispatchTimeHours,
      verified: MOCK_SUPPLIERS[1].status === SupplierStatus.VERIFIED,
      trustScore: MOCK_SUPPLIERS[1].trustScore,
    }
  }
];

let MOCK_ORDERS: Order[] = [
  {
    id: 'ord-2023001',
    customerName: 'Carlos M.',
    customerPhone: '+53 53123456',
    total: 30.00,
    currency: 'USD',
    status: OrderStatus.DELIVERED,
    date: '2023-10-25',
    items: [{ productId: 'p-plancha-holstein', quantity: 1, productName: 'Plancha Eléctrica Holstein (110V)', price: 30.00 }],
    commission: 8.00,
    deliveryMethod: 'DELIVERY',
    deliveryAddress: 'Calle L #123, Vedado',
    supplierId: 's-electro'
  },
  {
    id: 'ord-2023002',
    customerName: 'Yusimí G.',
    customerPhone: '+53 52991234',
    total: 15.00, // 2x2.5 + 1x6.8 = 5 + 6.8 = 11.8 wholesale; 2x3.5+1x9 = 7+9 = 16 retail
    currency: 'USD',
    status: OrderStatus.CONFIRMED,
    date: '2023-10-26',
    items: [
      { productId: 'p-jabon-esplendor', quantity: 2, productName: 'Jabón de Baño "Esplendor" (Paquete 3u)', price: 3.50 },
      { productId: 'p-arroz-5kg', quantity: 1, productName: 'Arroz Grano Largo (Saco 5kg)', price: 9.00 }
    ],
    commission: 4.20, // 16 - (5+6.8) = 16 - 11.8 = 4.2
    deliveryMethod: 'DELIVERY',
    deliveryAddress: 'Ave. 41 #456, Playa',
    supplierId: 's-cerro'
  },
  {
    id: 'ord-2023003',
    customerName: 'Pedro P.',
    customerPhone: '+53 54321098',
    total: 25.00,
    currency: 'USD',
    status: OrderStatus.PENDING,
    date: '2023-10-27',
    items: [{ productId: 'p-filtro-agua', quantity: 1, productName: 'Filtro de Agua Básico (Cerámica)', price: 12.00 }],
    commission: 3.50,
    deliveryMethod: 'PICKUP',
    deliveryAddress: 'Tienda ElectroCosto',
    supplierId: 's-electro'
  }
];

// Admin Mock Data - Real Suppliers
let MOCK_SUPPLIER_REQUESTS: SupplierRequest[] = [
  MOCK_SUPPLIERS[0], // Almacenes El Cerro
  MOCK_SUPPLIERS[1], // ElectroCosto Oriente
  MOCK_SUPPLIERS[2], // TuMesa.cu
];

let MOCK_PAYOUTS: Payout[] = [
  {
    id: 'pay-001',
    supplierName: 'Almacenes El Cerro',
    amount: 150.00,
    currency: 'USD',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.UNPAID,
    pendingOrders: 1
  },
  {
    id: 'pay-002',
    supplierName: 'ElectroCosto Oriente',
    amount: 240.00,
    currency: 'USD',
    period: 'Semana 42 - Oct',
    status: PayoutStatus.PROCESSING,
    pendingOrders: 0
  }
];

// Mock Reseller Store Configs
let MOCK_RESELLER_STORES: Record<string, StoreConfig> = {
  'tienda-pepe': {
    ownerId: 'reseller-pepe',
    name: 'Tienda Pepe',
    subdomain: 'tienda-pepe.kiosko.cu',
    themeColor: '#4f46e5', // Indigo 600
    whatsappNumber: '+5355555555',
    products: [MOCK_PRODUCTS[0].id, MOCK_PRODUCTS[1].id, MOCK_PRODUCTS[2].id],
    planTier: PlanTier.FREE,
    acceptedPayments: {
      cash: true,
      transfermovil: true,
      zelle: false,
      usdt: false,
    },
    // Fix: Use StoreStatus enum for storeStatus
    storeStatus: StoreStatus.ACTIVE
  },
  'super-ventas': {
    ownerId: 'reseller-super',
    name: 'Super Ventas Online',
    subdomain: 'super-ventas.kiosko.cu',
    themeColor: '#059669', // Emerald 600
    whatsappNumber: '+5351234567',
    products: [MOCK_PRODUCTS[1].id, MOCK_PRODUCTS[3].id],
    planTier: PlanTier.PRO,
    acceptedPayments: {
      cash: true,
      transfermovil: true,
      zelle: true,
      usdt: false,
    },
    // Fix: Use StoreStatus enum for storeStatus
    storeStatus: StoreStatus.ACTIVE
  },
};

// Mock Notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: NotificationType.STOCK_ALERT,
    title: '⚠️ Stock Bajo: Filtro de Agua',
    message: 'ElectroCosto reporta menos de 10 unidades. Considera pausar la venta.',
    date: 'Hace 15 min',
    read: false,
    priority: 'HIGH',
    relatedProductId: 'p-filtro-agua'
  },
  {
    id: 'n2',
    type: NotificationType.PRICE_CHANGE,
    title: 'Baja de Precio: Jabón Esplendor',
    message: 'Ahora a 2.50 USD (antes 2.70 USD). ¡Ajusta tu margen!',
    date: 'Hace 1 hora',
    read: false,
    priority: 'MEDIUM',
    relatedProductId: 'p-jabon-esplendor'
  }
];

// Mock Challenges
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Primeros Pasos',
    description: 'Vende tu primer "Jabón Esplendor".',
    target: 1,
    current: 0,
    reward: 'Badge "Vendedor Novato"',
    deadline: '7 días',
    type: 'SALES',
    icon: 'ROCKET'
  },
  {
    id: 'c2',
    title: 'Maestro de Redes',
    description: 'Comparte 5 productos en tus redes sociales.',
    target: 5,
    current: 2,
    reward: 'Comisión reducida 0.5%',
    deadline: '24 horas',
    type: 'SHARES',
    icon: 'FIRE'
  }
];

// Simulate Network Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- CRITICAL VALIDATION LOGIC ---

export const validateCubanCI = (ci: string): boolean => {
  // Simple check for 11 digits
  return /^\d{11}$/.test(ci);
};

export const validateCubanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9+]/g, ''); // Allow '+' for international prefix
  return /^\+53[56]\d{7}$/.test(cleaned); // +53 5xxxxxxx or +53 6xxxxxxx
};

export const checkProductCompliance = (name: string, description: string): { allowed: boolean, reason?: string } => {
  const forbiddenKeywords = ['antibiotico', 'azitromicina', 'dolar', 'euro', 'mlc', 'droga', 'arma', 'divisas', 'medicamento'];
  const text = (name + ' ' + description).toLowerCase();
  for (const word of forbiddenKeywords) {
    if (text.includes(word)) {
      return { allowed: false, reason: `Contiene término prohibido: "${word}"` };
    }
  }
  return { allowed: true };
};

// --- API SERVICES ---

// General Product Services
export const getProducts = async (): Promise<Product[]> => {
  await delay(600);
  return MOCK_PRODUCTS.filter(p => (p.qualityScore || 0) > 50 && p.stock > 0);
};

// Reseller Services
export const getResellerKPIs = async (): Promise<KPI[]> => {
  await delay(400);
  return [
    { label: 'Ganancia Neta', value: '14.20 USD', trend: 15.2, isPositive: true, subtext: '+ 450 CUP (Efectivo)' },
    { label: 'Pedidos Activos', value: '2', trend: 0, isPositive: true, subtext: '1 listo para entrega' },
    { label: 'Visitas Tienda', value: '142', trend: -5, isPositive: false, subtext: 'Baja conversión hoy' },
  ];
};

export const getResellerStoreConfig = async (subdomain: string): Promise<StoreConfig | undefined> => {
  await delay(300);
  return MOCK_RESELLER_STORES[subdomain];
};

export const updateResellerStoreConfig = async (subdomain: string, config: Partial<StoreConfig>): Promise<boolean> => {
  await delay(700);
  MOCK_RESELLER_STORES[subdomain] = { ...MOCK_RESELLER_STORES[subdomain], ...config };
  return true;
};

export const getMyStoreProducts = async (subdomain: string = 'tienda-pepe'): Promise<StoreProduct[]> => {
  await delay(500);
  const store = MOCK_RESELLER_STORES[subdomain];
  if (!store) return [];

  return store.products.map(productId => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    const customRetailPrice = product.priceRetail; // Default to supplier's retail price for mock
    const profitMargin = customRetailPrice - product.priceWholesale;

    return {
      ...product,
      customRetailPrice,
      isActive: product.stock > 0, // Mock: active if in stock
      addedAt: '2023-10-20',
      profitMargin: profitMargin
    };
  }).filter(Boolean) as StoreProduct[];
};

export const addProductToResellerStore = async (subdomain: string, productId: string): Promise<boolean> => {
  await delay(500);
  const store = MOCK_RESELLER_STORES[subdomain];
  if (store) {
    if (!store.products.includes(productId)) {
      store.products.push(productId);
      return true;
    }
  }
  return false;
}

export const updateResellerStoreProductPrice = async (subdomain: string, productId: string, newPrice: number): Promise<boolean> => {
  await delay(300);
  // In a real scenario, this would update the specific StoreProduct entry
  // For mock, we'll just return true.
  return true;
};


export const getResellerOrders = async (): Promise<Order[]> => {
  await delay(500);
  // Mock filter for reseller
  return MOCK_ORDERS.filter(o => o.items.some(item => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    // In a real app, orders would be linked to the reseller
    // For now, any order is visible.
    return !!product; 
  }));
};

export const submitPublicOrder = async (storeId: string, orderData: any): Promise<{ success: boolean, orderId: string }> => {
  await delay(1000);
  const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`;
  const total = orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const commission = total * (Math.random() * 0.1 + 0.1); // Mock 10-20% commission
  
  MOCK_ORDERS.push({
    id: newOrderId,
    customerName: orderData.details.customerName,
    customerPhone: orderData.details.phone,
    total: total,
    currency: orderData.items[0].currency, // Assuming all items same currency
    status: OrderStatus.PENDING,
    date: new Date().toISOString().split('T')[0],
    items: orderData.items,
    commission: commission,
    deliveryMethod: 'DELIVERY', // Hardcoded for simplicity
    deliveryAddress: `${orderData.details.address}, ${orderData.details.municipality}`,
    supplierId: orderData.items[0].supplierId // Assuming single supplier for now
  });

  return { success: true, orderId: newOrderId };
};

export const getPublicStoreDetails = async (subdomain: string): Promise<StoreConfig | undefined> => {
  await delay(300);
  return MOCK_RESELLER_STORES[subdomain];
};

export const getPublicStoreProducts = async (subdomain: string): Promise<StoreProduct[]> => {
  await delay(500);
  const store = MOCK_RESELLER_STORES[subdomain];
  if (!store) return [];

  return store.products.map(productId => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    const customRetailPrice = product.priceRetail * (1 + (Math.random() * 0.1)); // Mock a slight markup
    const profitMargin = customRetailPrice - product.priceWholesale;

    return {
      ...product,
      customRetailPrice,
      isActive: product.stock > 0,
      addedAt: '2023-10-20',
      profitMargin: profitMargin
    };
  }).filter(Boolean) as StoreProduct[];
};

// Supplier Services
export const getSupplierStats = async (): Promise<KPI[]> => {
  await delay(300);
  // Mock stats for 's-cerro'
  return [
    { label: 'Ventas Totales', value: '180 USD', trend: 18, isPositive: true, subtext: 'Semana actual' },
    { label: 'Inventario', value: '300 un.', trend: -2, isPositive: false, subtext: 'Stock total' },
    { label: 'Revendedores', value: '2', trend: 1, isPositive: true, subtext: 'Vendiendo tus productos' }
  ];
};

export const getSupplierProducts = async (supplierId: string = 's-cerro'): Promise<Product[]> => {
  await delay(400);
  return MOCK_PRODUCTS.filter(p => p.supplierId === supplierId);
};

export const createProduct = async (productData: any): Promise<boolean> => {
  await delay(1000);
  // Basic compliance check before creation
  const compliance = checkProductCompliance(productData.name, productData.description || '');
  if (!compliance.allowed) {
    throw new Error(compliance.reason || "Producto no cumple normativas.");
  }
  
  // Fix: Extract only relevant fields for supplierReputation from a mock supplier for new products
  const mockSupplier = MOCK_SUPPLIERS.find(s => s.id === 's-cerro');
  const supplierReputation = mockSupplier ? {
    fulfillmentRate: mockSupplier.fulfillmentRate,
    dispatchTimeHours: mockSupplier.dispatchTimeHours,
    verified: mockSupplier.status === SupplierStatus.VERIFIED,
    trustScore: mockSupplier.trustScore,
  } : undefined;

  MOCK_PRODUCTS.push({
    id: `p-${Math.random().toString(36).substring(2, 9)}`,
    name: productData.name,
    description: productData.description || 'Sin descripción.',
    priceWholesale: Number(productData.priceWholesale),
    priceRetail: Number(productData.priceWholesale) * 1.3, // Default 30% markup
    currency: 'USD',
    stock: Number(productData.stock),
    supplierId: 's-cerro', // Mock logged in as s-cerro
    supplierName: MOCK_SUPPLIERS.find(s => s.id === 's-cerro')?.businessName || '',
    category: productData.category,
    imageUrl: 'https://via.placeholder.com/300x300?text=Nuevo+Producto', // Placeholder image
    qualityScore: 70, // New products might need manual review
    supplierReputation: supplierReputation
  });
  return true;
};

export const updateProductStock = async (productId: string, delta: number): Promise<boolean> => {
  await delay(200);
  const product = MOCK_PRODUCTS.find(p => p.id === productId);
  if (product) {
    product.stock = Math.max(0, product.stock + delta);
    return true;
  }
  return false;
};

export const getSupplierOrders = async (supplierId: string = 's-cerro'): Promise<Order[]> => {
  await delay(500);
  return MOCK_ORDERS.filter(o => o.supplierId === supplierId && (o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PENDING || o.status === OrderStatus.READY_FOR_PICKUP));
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  await delay(500);
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    return true;
  }
  return false;
};

// Admin Services
export const getAdminStats = async (): Promise<KPI[]> => {
  await delay(400);
  return [
    { label: 'GMV (Volumen)', value: '$5.5k USD', trend: 22, isPositive: true, subtext: 'Mes actual' },
    { label: 'Revenue SaaS', value: '$120 USD', trend: 8, isPositive: true, subtext: 'Suscripciones' },
    { label: 'Proveedores', value: MOCK_SUPPLIER_REQUESTS.filter(s => s.status === SupplierStatus.VERIFIED).length.toString(), trend: 1, isPositive: true, subtext: 'Verificados' },
    { label: 'Gestores', value: Object.keys(MOCK_RESELLER_STORES).length.toString(), trend: 12, isPositive: true, subtext: 'Activos' },
  ];
};

export const getSupplierRequests = async (): Promise<SupplierRequest[]> => {
  await delay(500);
  return MOCK_SUPPLIER_REQUESTS;
};

export const verifySupplier = async (supplierId: string, status: SupplierStatus): Promise<boolean> => {
  await delay(1000);
  const req = MOCK_SUPPLIER_REQUESTS.find(r => r.id === supplierId);
  if (req) {
    req.status = status;
    if (status === SupplierStatus.VERIFIED) {
        // Find in MOCK_SUPPLIERS and update status there as well
        const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
        if(supplier) supplier.status = SupplierStatus.VERIFIED;
    }
    return true;
  }
  return false;
};

export const getPendingPayouts = async (): Promise<Payout[]> => {
  await delay(500);
  return MOCK_PAYOUTS;
};

export const updatePayoutStatus = async (payoutId: string, status: PayoutStatus): Promise<boolean> => {
  await delay(700);
  const payout = MOCK_PAYOUTS.find(p => p.id === payoutId);
  if (payout) {
    payout.status = status;
    return true;
  }
  return false;
};

// General Services
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

export const getRecentNotifications = async (): Promise<Notification[]> => {
  await delay(400);
  return MOCK_NOTIFICATIONS;
};


// AI Services
export const generateSmartCopy = async (productName: string, price: number, currency: string, description: string): Promise<string> => {
  await delay(600);
  return `🔥 *${productName.toUpperCase()}* 🔥\n\n${description}\n\n💰 Precio: ${price.toFixed(2)} ${currency}\n📍 Entregas en toda La Habana\n🚀 ¡Escribe ya que se acaban!`;
};

export const getInventoryPredictions = async (): Promise<AIPrediction[]> => {
  await delay(800);
  return MOCK_PRODUCTS.slice(0, 3).map(p => ({
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    burnRatePerDay: Math.floor(Math.random() * 5) + 1, // Mock sales per day
    daysUntilStockout: p.stock > 0 ? Math.floor(p.stock / (Math.floor(Math.random() * 3) + 1)) : 0, // Mock days
    recommendation: p.stock < 10 ? 'RESTOCK_NOW' : 'NORMAL'
  }));
};

export const getSmartPriceSuggestion = async (productId: string, basePrice: number, zone: string): Promise<AIPriceSuggestion> => {
  await delay(500);
  // Mock logic: Playa might have higher prices
  const zoneMultiplier = zone === 'Playa' ? 1.3 : 1.2;
  return {
    productId,
    suggestedPrice: parseFloat((basePrice * zoneMultiplier).toFixed(2)),
    reasoning: `Margen sugerido para la zona de ${zone} basado en demanda y competencia.`,
    zoneMultiplier: zoneMultiplier
  };
};

export const analyzeFraudRisk = async (orderTotal: number, customerPhone: string): Promise<FraudAnalysis> => {
    // Mock fraud detection: high total or suspicious phone
    const riskScore = orderTotal > 100 && customerPhone.includes('999') ? 80 : 10;
    return { 
      orderId: 'x', 
      riskScore: riskScore, 
      riskLevel: riskScore > 50 ? 'HIGH' : 'LOW', 
      flags: riskScore > 50 ? ['HIGH_VALUE_ORDER', 'SUSPICIOUS_PHONE'] : [] 
    };
};

export const getActiveChallenges = async (): Promise<Challenge[]> => {
  await delay(400);
  return MOCK_CHALLENGES;
};

export const generateSocialAsset = async (productId: string, type: 'STORY' | 'POST'): Promise<string> => {
  await delay(1000);
  return MOCK_PRODUCTS.find(p => p.id === productId)?.imageUrl || 'https://via.placeholder.com/600x800?text=Story+Generada';
};