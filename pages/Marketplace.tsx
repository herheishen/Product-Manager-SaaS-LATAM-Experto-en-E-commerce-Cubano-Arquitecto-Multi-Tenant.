
import React, { useEffect, useState } from 'react';
import { Search, Plus, Zap, ShieldCheck, Check, Filter } from 'lucide-react';
import { getProducts } from '../services/api';
import { Product } from '../types';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-20 flex gap-4 items-center">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
           <input type="text" placeholder="Buscar productos (ej. Arroz, Jabón)..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
        </div>
        <div className="hidden md:flex gap-2">
           <select className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer">
              <option>Recomendados</option>
              <option>Mayor Ganancia</option>
              <option>Menor Precio</option>
           </select>
           <button className="px-4 py-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {products.map((product) => {
          const profit = product.priceRetail - product.priceWholesale;
          const isAdded = addedProducts.has(product.id);

          return (
            <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col overflow-hidden relative">
               
               {/* Image Section */}
               <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     {product.isHot && (
                        <span className="bg-white/95 backdrop-blur-md text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-orange-100">
                           <Zap size={10} fill="currentColor"/> TENDENCIA
                        </span>
                     )}
                     {product.supplierReputation?.verified && (
                        <span className="bg-white/95 backdrop-blur-md text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-indigo-100">
                           <ShieldCheck size={10}/> VERIFICADO
                        </span>
                     )}
                  </div>
                  {/* Stock Indicator Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                     <div className="flex items-center gap-2 text-white text-xs font-medium">
                        <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span>{product.stock} disponibles</span>
                     </div>
                  </div>
               </div>
               
               {/* Content */}
               <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">{product.category}</p>
                     <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                     <p className="text-xs text-slate-500 mt-1 truncate">Prov: {product.supplierName}</p>
                  </div>

                  <div className="mt-auto bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Costo</p>
                           <p className="text-sm font-bold text-slate-700 font-mono">{product.priceWholesale} <span className="text-[10px]">{product.currency}</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-emerald-600 uppercase">Ganancia Est.</p>
                           <p className="text-lg font-bold text-emerald-600 leading-none">+{profit} <span className="text-xs">{product.currency}</span></p>
                        </div>
                     </div>
                     <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{width: `${(profit/product.priceRetail)*100}%`}}></div>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleAddToStore(product.id)}
                    disabled={isAdded}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isAdded 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default' 
                        : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-200'
                    }`}
                  >
                    {isAdded ? <><Check size={18}/> En tu Vitrina</> : <><Plus size={18}/> Agregar a mi Tienda</>}
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
