
import React, { useEffect, useState } from 'react';
import { Search, Plus, Zap, ShieldCheck, Check } from 'lucide-react';
import { getProducts, getPlanLimits } from '../services/api';
import { Product, PlanTier } from '../types';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleAddToStore = (id: string) => {
    setAddedProducts(prev => new Set(prev).add(id));
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Cargando mercado...</div>;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-20 flex gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
           <input type="text" placeholder="Buscar productos (ej. Arroz, Jabón)..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none">
           <option>Recomendados</option>
           <option>Mayor Ganancia</option>
           <option>Menor Precio</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {products.map((product) => {
          const profit = product.priceRetail - product.priceWholesale;
          const isAdded = addedProducts.has(product.id);

          return (
            <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
               <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                     {product.isHot && <span className="bg-white/90 backdrop-blur text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"><Zap size={10} fill="currentColor"/> HOT</span>}
                     {product.supplierReputation?.verified && <span className="bg-white/90 backdrop-blur text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"><ShieldCheck size={10}/> VERIFIED</span>}
                  </div>
               </div>
               
               <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-3">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{product.category}</p>
                     <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{product.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-slate-50 border-b border-dashed">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Costo</p>
                        <p className="text-sm font-bold text-slate-700">{product.priceWholesale} <span className="text-[10px] font-normal">{product.currency}</span></p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Tu Ganancia</p>
                        <p className="text-sm font-bold text-emerald-600">+{profit} {product.currency}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                     <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                     <span>{product.stock} disponibles</span>
                     <span className="text-slate-300">•</span>
                     <span className="truncate">{product.supplierName}</span>
                  </div>

                  <button 
                    onClick={() => handleAddToStore(product.id)}
                    disabled={isAdded}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-auto ${
                      isAdded 
                        ? 'bg-slate-50 text-slate-400 cursor-default' 
                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200'
                    }`}
                  >
                    {isAdded ? <><Check size={16}/> Agregado</> : <><Plus size={16}/> Agregar a mi Tienda</>}
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
