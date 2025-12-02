
import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Check, DollarSign, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { getProducts, getPlanLimits } from '../services/api';
import { Product, PlanTier } from '../types';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated limits
  const currentPlan = PlanTier.FREE;
  const limits = getPlanLimits(currentPlan);
  const currentProductCount = addedProducts.size + 12; // Mock starting count

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddToStore = (productId: string) => {
    if (addedProducts.size + currentProductCount >= limits.maxProducts) {
      alert(`⚠️ Límite del Plan ${currentPlan} alcanzado.\n\nSolo puedes tener ${limits.maxProducts} productos activos. Actualiza a PRO para vender sin límites.`);
      return;
    }
    const newSet = new Set(addedProducts);
    newSet.add(productId);
    setAddedProducts(newSet);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            Mercado Mayorista 
            <span className="ml-2 bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full border border-sky-200">Sin Inversión</span>
          </h1>
          <p className="text-sm text-slate-500">Encuentra proveedores locales. Vende hoy, paga cuando cobres.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="Buscar (ej. Zapatillas, Combos...)"
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 bg-white shadow-sm">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {filteredProducts.map((product) => {
          const profit = product.priceRetail - product.priceWholesale;
          const profitPercent = Math.round((profit / product.priceWholesale) * 100);
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 bg-slate-200 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  {product.isHot && (
                    <span className="bg-orange-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide flex items-center">
                      <Zap size={10} className="mr-1 fill-white" /> Tendencia
                    </span>
                  )}
                  {product.stock < 10 && (
                    <span className="bg-red-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide flex items-center">
                      <AlertCircle size={10} className="mr-1" /> ¡Poco Stock!
                    </span>
                  )}
                  <span className="bg-slate-900/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    Stock: {product.stock}
                  </span>
                </div>

                {/* Profit Badge Overlay - KEY METRIC */}
                <div className="absolute bottom-3 right-3 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center border border-green-400">
                  <TrendingUp size={16} className="mr-1.5" />
                  Ganas {profit} {product.currency}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide border border-slate-200">
                     {product.category}
                   </span>
                   <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{product.supplierName}</span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1 leading-tight text-base group-hover:text-sky-600 transition-colors">{product.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                
                <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Mayorista</p>
                      <p className="font-bold text-slate-900 text-lg">{product.priceWholesale} <span className="text-xs text-slate-500 font-normal">{product.currency}</span></p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-4">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Venta Sugerida</p>
                      <p className="font-bold text-sky-600 text-lg">{product.priceRetail} <span className="text-xs text-sky-400 font-normal">{product.currency}</span></p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToStore(product.id)}
                  disabled={addedProducts.has(product.id)}
                  className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all shadow-sm ${
                    addedProducts.has(product.id)
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                      : 'bg-slate-900 text-white hover:bg-sky-600 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {addedProducts.has(product.id) ? (
                    <>
                      <Check size={18} className="mr-2" /> Listo para vender
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" /> Agregar a mi Kiosko
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
