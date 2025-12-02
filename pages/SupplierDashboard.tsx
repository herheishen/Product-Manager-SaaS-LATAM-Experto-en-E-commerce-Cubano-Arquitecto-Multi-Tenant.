
import React, { useEffect, useState } from 'react';
import { Package, Plus, TrendingUp, DollarSign, AlertCircle, ShoppingBag, X, Check } from 'lucide-react';
import { getSupplierStats, getSupplierProducts, createProduct } from '../services/api';
import { KPI, Product } from '../types';

const SupplierDashboard: React.FC = () => {
  const [stats, setStats] = useState<KPI[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Cargando Panel de Proveedor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Proveedor</h1>
            <p className="text-slate-500">Gestiona tu inventario y red de distribución.</p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-slate-900 text-white px-4 py-2.5 rounded-lg font-bold flex items-center hover:bg-slate-800 shadow-lg"
         >
            <Plus size={20} className="mr-2" /> Nuevo Producto
         </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 font-medium ${stat.isPositive ? 'text-green-600' : 'text-orange-500'}`}>
                     {stat.subtext}
                  </p>
               </div>
               <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <TrendingUp size={20} />
               </div>
            </div>
         ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Package className="text-sky-500" /> Inventario Activo
            </h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                     <th className="px-6 py-3">Producto</th>
                     <th className="px-6 py-3">Precio Mayorista</th>
                     <th className="px-6 py-3">Stock Físico</th>
                     <th className="px-6 py-3">Estado</th>
                     <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                     <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                           <img src={product.imageUrl} className="w-10 h-10 rounded object-cover bg-slate-200" />
                           <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              <p className="text-xs text-slate-400">{product.category}</p>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-mono">
                           {product.priceWholesale} {product.currency}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-slate-700'}`}>
                              {product.stock} u
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                              Publicado
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-sky-600 font-medium hover:underline">Editar</button>
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200">
               <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Publicar Nuevo Producto</h3>
                  <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400"/></button>
               </div>
               <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Producto</label>
                     <input 
                        required 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="Ej. Caja de Pollo 15kg"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Precio Mayorista (USD)</label>
                        <input 
                           required type="number"
                           value={newProduct.priceWholesale}
                           onChange={e => setNewProduct({...newProduct, priceWholesale: e.target.value})}
                           className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                           placeholder="0.00"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Stock Inicial</label>
                        <input 
                           required type="number"
                           value={newProduct.stock}
                           onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                           className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                           placeholder="0"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
                     <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-white outline-none"
                     >
                        <option>Alimentos</option>
                        <option>Aseo</option>
                        <option>Electrónica</option>
                        <option>Hogar</option>
                     </select>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold border border-slate-200 rounded-lg hover:bg-slate-50">
                        Cancelar
                     </button>
                     <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200">
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
