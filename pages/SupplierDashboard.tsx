
import React, { useEffect, useState } from 'react';
import { Package, Plus, TrendingUp, DollarSign, AlertCircle, ShoppingBag, X, Check, Minus, RefreshCw } from 'lucide-react';
import { getSupplierStats, getSupplierProducts, createProduct, updateProductStock } from '../services/api';
import { KPI, Product } from '../types';

const SupplierDashboard: React.FC = () => {
  const [stats, setStats] = useState<KPI[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    priceWholesale: '',
    stock: '',
    category: 'Alimentos'
  });

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, productsData] = await Promise.all([
        getSupplierStats(),
        getSupplierProducts()
      ]);
      setStats(statsData);
      setProducts(productsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(newProduct);
    setIsModalOpen(false);
    // Optimistic Update
    setProducts([...products, {
      id: `new-${Date.now()}`,
      name: newProduct.name,
      priceWholesale: Number(newProduct.priceWholesale),
      priceRetail: Number(newProduct.priceWholesale) * 1.3,
      stock: Number(newProduct.stock),
      currency: 'USD',
      description: 'Nuevo producto agregado',
      supplierId: 'me',
      supplierName: 'Mi Negocio',
      category: newProduct.category,
      imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801fafde?auto=format&fit=crop&q=80&w=300'
    }]);
    setNewProduct({ name: '', priceWholesale: '', stock: '', category: 'Alimentos' });
  };

  const handleQuickStockUpdate = async (productId: string, delta: number) => {
    setUpdatingStock(productId);
    await updateProductStock(productId, delta);
    setProducts(prev => prev.map(p => {
       if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
       }
       return p;
    }));
    setUpdatingStock(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Cargando Panel de Proveedor...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Proveedor</h1>
            <p className="text-slate-500">Gestiona tu inventario y red de distribución.</p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95"
         >
            <Plus size={20} className="mr-2" /> Nuevo Producto
         </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
                  <p className={`text-xs mt-2 font-medium flex items-center ${stat.isPositive ? 'text-green-600' : 'text-orange-500'}`}>
                     {stat.isPositive ? <TrendingUp size={14} className="mr-1"/> : <AlertCircle size={14} className="mr-1"/>}
                     {stat.subtext}
                  </p>
               </div>
               <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                  <Package size={24} />
               </div>
            </div>
         ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Package className="text-sky-500" /> Inventario Activo
            </h2>
            <div className="text-xs text-slate-400 font-medium">
               Mostrando {products.length} productos
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50/50 text-slate-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Producto</th>
                     <th className="px-6 py-4">Precio Mayorista</th>
                     <th className="px-6 py-4 text-center">Ajuste Rápido de Stock</th>
                     <th className="px-6 py-4">Estado</th>
                     <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                     <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <img src={product.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                              <div>
                                 <p className="font-bold text-slate-900">{product.name}</p>
                                 <p className="text-xs text-slate-400">{product.category}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                           {product.priceWholesale} {product.currency}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-3">
                              <button 
                                 onClick={() => handleQuickStockUpdate(product.id, -1)}
                                 disabled={updatingStock === product.id || product.stock <= 0}
                                 className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 transition-all text-slate-500"
                              >
                                 <Minus size={14} />
                              </button>
                              <span className={`font-bold w-12 text-center text-lg ${product.stock < 10 ? 'text-orange-500' : 'text-slate-700'}`}>
                                 {updatingStock === product.id ? <RefreshCw size={14} className="animate-spin inline"/> : product.stock}
                              </span>
                              <button 
                                 onClick={() => handleQuickStockUpdate(product.id, 1)}
                                 disabled={updatingStock === product.id}
                                 className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-white hover:bg-slate-800 shadow-sm disabled:opacity-50 transition-all"
                              >
                                 <Plus size={14} />
                              </button>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {product.stock > 0 ? 'Publicado' : 'Agotado'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-slate-400 font-bold text-xs hover:text-sky-600 transition-colors">Editar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modal New Product */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-lg text-slate-800">Publicar Nuevo Producto</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
               </div>
               <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre del Producto</label>
                     <input 
                        required 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none font-medium"
                        placeholder="Ej. Caja de Pollo 15kg"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Precio Mayorista (USD)</label>
                        <div className="relative">
                           <span className="absolute left-4 top-3 text-slate-400">$</span>
                           <input 
                              required type="number"
                              value={newProduct.priceWholesale}
                              onChange={e => setNewProduct({...newProduct, priceWholesale: e.target.value})}
                              className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
                              placeholder="0.00"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Stock Inicial</label>
                        <input 
                           required type="number"
                           value={newProduct.stock}
                           onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                           className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
                           placeholder="0"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Categoría</label>
                     <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none font-medium text-slate-700"
                     >
                        <option>Alimentos</option>
                        <option>Aseo</option>
                        <option>Electrónica</option>
                        <option>Hogar</option>
                     </select>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        Cancelar
                     </button>
                     <button type="submit" className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all transform active:scale-[0.98]">
                        Publicar Ahora
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
