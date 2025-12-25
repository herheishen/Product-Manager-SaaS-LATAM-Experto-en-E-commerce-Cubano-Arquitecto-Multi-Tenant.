import React, { useEffect, useState } from 'react';
import { Package, Plus, TrendingUp, DollarSign, AlertCircle, ShoppingBag, X, Check, Minus, RefreshCw, PencilLine } from 'lucide-react';
import { getSupplierStats, getSupplierProducts, createProduct, updateProductStock, checkProductCompliance } from '../services/api';
import { KPI, Product, UserRole, SupplierStatus } from '../types';
// Fix: Import PRODUCT_CATEGORIES from constants, not types
import { PRODUCT_CATEGORIES } from '../constants';

const SupplierDashboard: React.FC = () => {
  const [stats, setStats] = useState<KPI[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  // Mock current user's role and supplier status
  const currentUserRole = UserRole.SUPPLIER;
  const currentSupplierStatus = SupplierStatus.VERIFIED; // Mock as verified for demo

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    priceWholesale: '',
    stock: '',
    category: PRODUCT_CATEGORIES[0],
    imageUrl: ''
  });
  const [complianceError, setComplianceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, productsData] = await Promise.all([
        getSupplierStats(),
        getSupplierProducts('s-cerro') // Mock specific supplier ID
      ]);
      setStats(statsData);
      setProducts(productsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setComplianceError(null);

    const wholesalePrice = Number(newProduct.priceWholesale);
    const stock = Number(newProduct.stock);

    if (wholesalePrice <= 0) {
        setComplianceError("El precio mayorista debe ser mayor que 0.");
        return;
    }
    if (stock <= 0) {
        setComplianceError("El stock inicial debe ser mayor que 0.");
        return;
    }

    try {
        await createProduct(newProduct);
        setIsModalOpen(false);
        // Optimistic Update
        setProducts([...products, {
        id: `new-${Date.now()}`,
        name: newProduct.name,
        description: newProduct.description,
        priceWholesale: wholesalePrice,
        priceRetail: wholesalePrice * 1.3, // Default markup
        stock: stock,
        currency: 'USD',
        supplierId: 's-cerro',
        supplierName: 'Almacenes El Cerro',
        category: newProduct.category,
        imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=Nuevo+Producto',
        qualityScore: 70,
        supplierReputation: { fulfillmentRate: 90, dispatchTimeHours: 24, verified: true, trustScore: 90 }
        }]);
        setNewProduct({ name: '', description: '', priceWholesale: '', stock: '', category: PRODUCT_CATEGORIES[0], imageUrl: '' });
    } catch (error: any) {
        setComplianceError(error.message);
    }
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

  const isPublishingAllowed = currentSupplierStatus === SupplierStatus.VERIFIED;


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
           disabled={!isPublishingAllowed}
           className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            <Plus size={20} className="mr-2" /> Nuevo Producto
         </button>
      </div>

      {/* Warning if not verified */}
      {!isPublishingAllowed && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="text-sm font-medium">Tu perfil de proveedor está en revisión o no ha sido verificado. No puedes publicar productos aún.</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
                  <p className={`text-xs mt-2 font-medium flex items-center ${stat.isPositive ? 'text-emerald-600' : 'text-orange-500'}`}>
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
               <Package className="text-indigo-500" /> Inventario Activo
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
                              <img src={product.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" alt={product.name}/>
                              <div>
                                 <p className="font-bold text-slate-900">{product.name}</p>
                                 <p className="text-xs text-slate-400">{product.category}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                           {product.priceWholesale.toFixed(2)} {product.currency}
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
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {product.stock > 0 ? 'Publicado' : 'Agotado'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => console.log('Edit product', product.id)} className="text-slate-400 font-bold text-xs hover:text-indigo-600 transition-colors flex items-center justify-end gap-1">
                             <PencilLine size={14} /> Editar
                           </button>
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
                  {complianceError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-3">
                      <AlertCircle size={20} className="flex-shrink-0" />
                      <p className="text-sm font-medium">{complianceError}</p>
                    </div>
                  )}
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre del Producto</label>
                     <input 
                        required 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                        placeholder="Ej. Caja de Pollo 15kg"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descripción (opcional)</label>
                     <textarea 
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium text-slate-900 resize-none"
                        rows={3}
                        placeholder="Detalles sobre el producto, peso, tamaño, etc."
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL de Imagen (opcional)</label>
                     <input 
                        value={newProduct.imageUrl}
                        onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                        placeholder="https://example.com/imagen.jpg"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Precio Mayorista (USD)</label>
                        <div className="relative">
                           <span className="absolute left-4 top-3 text-slate-400">$</span>
                           <input 
                              required type="number" step="0.01"
                              value={newProduct.priceWholesale}
                              onChange={e => setNewProduct({...newProduct, priceWholesale: e.target.value})}
                              className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
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
                           className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-bold text-slate-800"
                           placeholder="0"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Categoría</label>
                     <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium text-slate-700"
                     >
                        {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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