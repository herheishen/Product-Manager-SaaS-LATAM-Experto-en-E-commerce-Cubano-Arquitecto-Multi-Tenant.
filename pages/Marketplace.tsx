
import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Check, Zap, TrendingUp, AlertCircle, ShieldCheck, Clock, Star, SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getPlanLimits } from '../services/api';
import { Product, PlanTier } from '../types';

type SortOption = 'RECOMMENDED' | 'PROFIT_DESC' | 'PRICE_ASC';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');
  
  // Simulated limits
  const currentPlan = PlanTier.FREE;
  const limits = getPlanLimits(currentPlan);
  const currentProductCount = addedProducts.size + 12; // Mock starting count

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
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

  // Get unique categories
  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];

  // Logic for filtering and sorting
  const processedProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesVerified = onlyVerified ? p.supplierReputation?.verified : true;
      
      return matchesSearch && matchesCategory && matchesVerified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'PROFIT_DESC':
          const profitA = a.priceRetail - a.priceWholesale;
          const profitB = b.priceRetail - b.priceWholesale;
          return profitB - profitA; // Note: Mixing currencies in basic sorting is flawed in real apps, but ok for mock
        case 'PRICE_ASC':
          return a.priceWholesale - b.priceWholesale;
        case 'RECOMMENDED':
        default:
          return (b.supplierReputation?.trustScore || 0) - (a.supplierReputation?.trustScore || 0);
      }
    });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            Mercado Mayorista 
            <span className="ml-2 bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full border border-sky-200 font-bold">Sin Inversión</span>
          </h1>
          <p className="text-sm text-slate-500">Conecta con proveedores verificados y vende sin stock.</p>
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
           <button 
             onClick={() => setShowFiltersMobile(!showFiltersMobile)}
             className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 bg-white shadow-sm lg:hidden"
           >
             <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-6">
        {/* Sidebar Filters (Desktop) */}
        <aside className={`w-64 bg-white rounded-xl shadow-sm border border-slate-100 p-5 overflow-y-auto flex-shrink-0 hidden lg:block`}>
          <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-2">
             <SlidersHorizontal size={18} /> Filtros
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ordenar Por</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-sky-500"
            >
              <option value="RECOMMENDED">🌟 Recomendados</option>
              <option value="PROFIT_DESC">💰 Mayor Ganancia</option>
              <option value="PRICE_ASC">📉 Precio Más Bajo</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Categorías</label>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-sky-50 text-sky-700 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="mb-6 space-y-3">
             <label className="flex items-center cursor-pointer group">
               <div className="relative">
                 <input 
                  type="checkbox" 
                  checked={onlyVerified} 
                  onChange={() => setOnlyVerified(!onlyVerified)}
                  className="sr-only" 
                 />
                 <div className={`block w-10 h-6 rounded-full transition-colors ${onlyVerified ? 'bg-sky-500' : 'bg-slate-200'}`}></div>
                 <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${onlyVerified ? 'transform translate-x-4' : ''}`}></div>
               </div>
               <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">Solo Verificados</span>
             </label>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong className="block mb-1">💡 Tip Pro:</strong>
              Los proveedores verificados tienen 40% menos devoluciones. Prioriza productos con el sello azul.
            </p>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {showFiltersMobile && (
           <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
              <div className="w-80 bg-white h-full p-5 shadow-2xl animate-in slide-in-from-right">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg">Filtros</h3>
                   <button onClick={() => setShowFiltersMobile(false)}><X size={24}/></button>
                </div>
                {/* Mobile filters content would go here, duplicating logic for simplicity in this demo */}
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold mb-2">Categoría</label>
                      <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="pt-4 border-t">
                     <label className="flex items-center gap-2">
                        <input type="checkbox" checked={onlyVerified} onChange={() => setOnlyVerified(!onlyVerified)} />
                        <span>Solo Verificados</span>
                     </label>
                   </div>
                   <button 
                    onClick={() => setShowFiltersMobile(false)}
                    className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold mt-8"
                   >
                     Ver Resultados
                   </button>
                </div>
              </div>
           </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          {loading ? (
             <div className="h-64 flex items-center justify-center text-slate-400">Cargando mercado...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pr-2">
              {processedProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500">
                  <Search size={48} className="mx-auto mb-4 opacity-20"/>
                  <p>No se encontraron productos con estos filtros.</p>
                </div>
              ) : (
                processedProducts.map((product) => {
                  const profit = product.priceRetail - product.priceWholesale;
                  const isTrusted = (product.supplierReputation?.trustScore || 0) > 90;
                  const isFast = (product.supplierReputation?.dispatchTimeHours || 0) <= 24;

                  return (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                      {/* Image Area */}
                      <div className="relative h-48 bg-slate-200 overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Status Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          {product.isHot && (
                            <span className="bg-orange-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide flex items-center">
                              <Zap size={10} className="mr-1 fill-white" /> Tendencia
                            </span>
                          )}
                          {isTrusted && (
                            <span className="bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide flex items-center">
                              <Star size={10} className="mr-1 fill-white" /> Top Seller
                            </span>
                          )}
                        </div>

                        {/* Profit Badge Overlay */}
                        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 flex justify-end items-end">
                           <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center border border-green-400">
                            <TrendingUp size={12} className="mr-1" />
                            Gana {profit} {product.currency}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide border border-slate-200">
                            {product.category}
                          </span>
                          
                          {/* Supplier Trust Indicator */}
                          <div className="flex items-center gap-1">
                             {product.supplierReputation?.verified && (
                               <ShieldCheck size={14} className="text-sky-500" />
                             )}
                             <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px] hover:text-sky-600 cursor-pointer">{product.supplierName}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-900 mb-1 leading-tight text-sm group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[2.5em]">{product.name}</h3>
                        
                        {/* Reputation Stats Row */}
                        <div className="flex gap-3 mb-3 mt-1 pt-2 border-t border-slate-50">
                           <div className="flex items-center text-[10px] text-slate-500" title="Tiempo de Despacho">
                              <Clock size={12} className={`mr-1 ${isFast ? 'text-green-500' : 'text-slate-400'}`} />
                              {product.supplierReputation?.dispatchTimeHours}h
                           </div>
                           <div className="flex items-center text-[10px] text-slate-500" title="Tasa de Cumplimiento">
                              <Check size={12} className="mr-1 text-sky-500" />
                              {product.supplierReputation?.fulfillmentRate}%
                           </div>
                           <div className="flex items-center text-[10px] text-slate-500" title="Score de Calidad">
                              <Star size={12} className="mr-1 text-orange-400" />
                              {product.qualityScore}/100
                           </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-2.5 mb-3 border border-slate-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Costo</p>
                              <p className="font-bold text-slate-900 text-base">{product.priceWholesale} <span className="text-[10px] text-slate-500 font-normal">{product.currency}</span></p>
                            </div>
                            <div className="text-right border-l border-slate-200 pl-4">
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Venta Sug.</p>
                              <p className="font-bold text-sky-600 text-base">{product.priceRetail} <span className="text-[10px] text-sky-400 font-normal">{product.currency}</span></p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleAddToStore(product.id)}
                          disabled={addedProducts.has(product.id)}
                          className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-all shadow-sm mt-auto ${
                            addedProducts.has(product.id)
                              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                              : 'bg-slate-900 text-white hover:bg-sky-600 hover:shadow-md hover:-translate-y-0.5'
                          }`}
                        >
                          {addedProducts.has(product.id) ? (
                            <>
                              <Check size={16} className="mr-2" /> Agregado
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" /> Agregar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
