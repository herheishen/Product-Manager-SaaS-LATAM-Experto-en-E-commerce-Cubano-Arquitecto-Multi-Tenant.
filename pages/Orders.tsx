

import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Search, Filter, DollarSign, Calendar, Eye, CreditCard } from 'lucide-react';
import { getResellerOrders } from '../services/api';
import { Order, OrderStatus } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  useEffect(() => {
    getResellerOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pendiente</span>;
      case OrderStatus.CONFIRMED: return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Confirmado</span>;
      case OrderStatus.READY_FOR_PICKUP: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Package size={12}/> Listo Pickup</span>;
      case OrderStatus.SHIPPED: return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12}/> En Camino</span>;
      case OrderStatus.DELIVERED: return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Entregado</span>;
      case OrderStatus.CANCELLED: return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Cancelado</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PENDING') return matchesSearch && (o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.READY_FOR_PICKUP || o.status === OrderStatus.SHIPPED);
    if (statusFilter === 'COMPLETED') return matchesSearch && (o.status === OrderStatus.DELIVERED);
    return matchesSearch;
  });

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando tus ventas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Pedidos</h1>
          <p className="text-slate-500">Gestiona el estado de tus ventas y monitorea tus ganancias.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="Buscar cliente o ID..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full shadow-sm text-slate-900 bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value as any)}
             className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
           >
             <option value="ALL">Todos</option>
             <option value="PENDING">En Proceso</option>
             <option value="COMPLETED">Finalizados</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Total Venta</th>
                <th className="px-6 py-4">Tu Ganancia</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                      <Package size={48} className="mx-auto mb-3 opacity-20"/>
                      No se encontraron pedidos.
                   </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">#{order.id.split('-')[1]}</td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-900">{order.customerName}</p>
                       <p className="text-xs text-slate-500">{order.items.length} productos</p>
                    </td>
                    <td className="px-6 py-4">
                       {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                       {order.total.toFixed(2)} <span className="text-xs font-normal text-slate-500">{order.currency}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-emerald-600 font-bold flex items-center">
                          +{order.commission.toFixed(2)} {order.currency}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                       <div className="flex items-center gap-1">
                          <Calendar size={12}/> {order.date}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => console.log('Ver detalle de orden', order.id)} className="text-indigo-600 font-bold text-xs hover:underline flex items-center justify-end gap-1">
                          <Eye size={14}/> Detalle
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Profit Summary Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
         <div>
            <h3 className="font-bold text-lg">Balance Pendiente (A Pagar)</h3>
            <p className="text-slate-400 text-xs mt-1">Dinero que debes a la plataforma o proveedores para liberar envíos.</p>
         </div>
         <div className="text-right flex flex-col items-center md:items-end">
            <span className="text-3xl font-bold block">$45.00 <span className="text-sm font-normal">USD</span></span>
            <button 
              onClick={() => console.log('Abrir modal de pago de deuda')}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1 active:scale-95"
            >
               <CreditCard size={14}/> Pagar Deuda
            </button>
         </div>
      </div>
    </div>
  );
};

export default Orders;
