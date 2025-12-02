
import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckSquare, Search, MapPin, Clock } from 'lucide-react';
import { getSupplierOrders, updateOrderStatus } from '../services/api';
import { Order, OrderStatus } from '../types';

const SupplierDispatch: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getSupplierOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
       // Optimistic Update
       setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Cargando Centro de Despacho...</div>;

  const pendingOrders = orders.filter(o => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PENDING || o.status === OrderStatus.READY_FOR_PICKUP);

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-sky-500"/> Centro de Despacho
          </h1>
          <p className="text-slate-500">Gestiona los pedidos pagados y coordina la logística de entrega.</p>
       </div>

       <div className="grid grid-cols-1 gap-6">
          {pendingOrders.length === 0 ? (
             <div className="bg-white p-10 rounded-xl border border-slate-100 text-center text-slate-400">
                <Truck size={48} className="mx-auto mb-4 opacity-20" />
                <p>No tienes pedidos pendientes de despacho.</p>
             </div>
          ) : (
             pendingOrders.map(order => (
               <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                  {/* Order Info */}
                  <div className="p-6 flex-1">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Orden #{order.id.split('-')[1]}</span>
                           <h3 className="text-lg font-bold text-slate-900">{order.items[0].productName} {order.items.length > 1 && `+ ${order.items.length - 1} más`}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                           order.status === OrderStatus.READY_FOR_PICKUP ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                           {order.status === OrderStatus.READY_FOR_PICKUP ? 'Esperando Mensajero' : 'Por Empaquetar'}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                           <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center"><MapPin size={12} className="mr-1"/> Entrega</p>
                           <p className="text-sm text-slate-800 font-medium">{order.customerName}</p>
                           <p className="text-sm text-slate-600">{order.deliveryAddress || 'Dirección no especificada'}</p>
                           <p className="text-xs text-slate-400 mt-1">Tel: {order.customerPhone}</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-500 font-bold uppercase mb-1">Detalles</p>
                           <ul className="text-sm text-slate-600 space-y-1">
                              {order.items.map((item, idx) => (
                                 <li key={idx}>• {item.quantity}x {item.productName}</li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="bg-slate-50 p-6 flex flex-col justify-center gap-3 border-l border-slate-100 md:w-64">
                     <p className="text-xs text-center text-slate-400 mb-2">Acciones de Logística</p>
                     
                     {order.status !== OrderStatus.READY_FOR_PICKUP && (
                        <button 
                           onClick={() => handleUpdateStatus(order.id, OrderStatus.READY_FOR_PICKUP)}
                           className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                           Marcar "Listo para Envío"
                        </button>
                     )}
                     
                     <button 
                        onClick={() => handleUpdateStatus(order.id, OrderStatus.SHIPPED)}
                        className={`w-full py-2.5 border rounded-lg font-bold text-sm transition-colors ${
                           order.status === OrderStatus.READY_FOR_PICKUP 
                              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                     >
                        Marcar "En Camino"
                     </button>
                  </div>
               </div>
             ))
          )}
       </div>
    </div>
  );
};

export default SupplierDispatch;
