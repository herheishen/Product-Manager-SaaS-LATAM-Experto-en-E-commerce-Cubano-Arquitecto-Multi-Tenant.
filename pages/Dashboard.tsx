
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getResellerKPIs, getOrders, getPlanLimits, getRecentNotifications, getInventoryPredictions } from '../services/api';
import { KPI, Order, OrderStatus, PlanTier, Notification, NotificationType, AIPrediction } from '../types';
import { TrendingUp, TrendingDown, Package, Zap, ArrowRight, DollarSign, Bell, AlertTriangle, Tag, ShieldAlert, Sparkles, BrainCircuit } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated User Plan State
  const currentPlan = PlanTier.FREE;
  const limits = getPlanLimits(currentPlan);
  const usage = { products: 12, orders: 4 }; // Mock usage approaching limits

  const chartData = [
    { name: 'Lun', sales: 400, commission: 80 },
    { name: 'Mar', sales: 300, commission: 60 },
    { name: 'Mie', sales: 200, commission: 40 },
    { name: 'Jue', sales: 278, commission: 55 },
    { name: 'Vie', sales: 189, commission: 35 },
    { name: 'Sab', sales: 639, commission: 120 },
    { name: 'Dom', sales: 349, commission: 70 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [kpiData, orderData, notifData, predData] = await Promise.all([
        getResellerKPIs(),
        getOrders(),
        getRecentNotifications(),
        getInventoryPredictions()
      ]);
      setKpis(kpiData);
      setRecentOrders(orderData.slice(0, 5));
      setNotifications(notifData);
      setPredictions(predData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-500 font-medium">Cargando tu Kiosko...</div>;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.STOCK_ALERT: return <AlertTriangle className="text-red-500" size={18} />;
      case NotificationType.PRICE_CHANGE: return <Tag className="text-blue-500" size={18} />;
      case NotificationType.COMPLIANCE_WARNING: return <ShieldAlert className="text-orange-500" size={18} />;
      default: return <Bell className="text-slate-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Status Banner (Freemium Strategy) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute -top-6 -right-6 p-4 opacity-5 rotate-12">
          <Zap size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-sky-500 text-xs font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider shadow-sm">Plan {currentPlan}</span>
              <span className="text-slate-400 text-xs font-medium">Tu suscripción actual</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Impulsa tus ventas en Cuba</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-lg">
              Estás cerca del límite de productos. Pásate al plan PRO para vender sin límites y usar tu propio dominio .cu
            </p>
          </div>
          
          <div className="w-full md:w-72 bg-slate-800/80 rounded-lg p-4 backdrop-blur-md border border-slate-600 shadow-lg">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Productos Activos</span>
                  <span className={usage.products >= limits.maxProducts ? "text-orange-400" : "text-sky-400"}>
                    {usage.products} / {limits.maxProducts}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${usage.products >= limits.maxProducts ? 'bg-orange-500' : 'bg-sky-500'}`} 
                    style={{ width: `${(usage.products / limits.maxProducts) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Pedidos este Mes</span>
                  <span className="text-green-400">{usage.orders} / {limits.maxOrdersPerMonth}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(usage.orders / limits.maxOrdersPerMonth) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-bold rounded text-white transition-all flex items-center justify-center shadow-md">
              <Zap size={14} className="mr-1.5 fill-current" /> MEJORAR AHORA
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Stats & Charts */}
        <div className="lg:col-span-3 space-y-6">
           {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between z-10 relative">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{kpi.value}</h3>
                    {kpi.subtext && <p className="text-xs text-slate-400 mt-1 font-medium">{kpi.subtext}</p>}
                  </div>
                  <div className={`p-3 rounded-full ${kpi.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {kpi.isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm relative z-10">
                  <span className={`${kpi.isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} font-bold px-2 py-0.5 rounded text-xs`}>
                    {kpi.isPositive ? '+' : ''}{kpi.trend}%
                  </span>
                  <span className="text-slate-400 ml-2 text-xs">vs mes anterior</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Rendimiento Financiero</h3>
                <p className="text-xs text-slate-400">Ventas vs Comisiones (USD eq)</p>
              </div>
              <select className="text-xs border border-slate-200 rounded-lg text-slate-600 px-2 py-1 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option>Últimos 7 días</option>
                <option>Este Mes</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="sales" name="Venta Total" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="commission" name="Tu Ganancia" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & AI Insights */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Inventory Forecast - NEW */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-5">
               <BrainCircuit size={80} className="text-indigo-600"/>
             </div>
             <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Predicción de Stock (IA)</h3>
             </div>
             
             <div className="space-y-4 relative z-10">
               {predictions.map((p) => (
                 <div key={p.productId} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-700 text-xs truncate max-w-[120px]">{p.productName}</h4>
                      {p.recommendation === 'RESTOCK_NOW' && (
                        <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded uppercase">Crítico</span>
                      )}
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] text-slate-400">Stock Actual: {p.currentStock}</p>
                         <p className="text-[10px] text-slate-400">Ventas/día: {p.burnRatePerDay}</p>
                      </div>
                      <div className="text-right">
                         <span className="block text-xl font-bold text-slate-800 leading-none">{p.daysUntilStockout}</span>
                         <span className="text-[9px] text-slate-500 font-medium">días restantes</span>
                      </div>
                   </div>
                   {p.daysUntilStockout < 5 && (
                     <div className="mt-2 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium">
                       ⚠️ Sugerencia: Pausar venta o buscar nuevo proveedor.
                     </div>
                   )}
                 </div>
               ))}
               {predictions.length === 0 && <p className="text-xs text-slate-400">Sin datos suficientes para predecir.</p>}
             </div>
          </div>

          {/* Notification Center */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-slate-800" />
                <h3 className="font-bold text-slate-800 text-sm">Centro de Alertas</h3>
                {notifications.some(n => !n.read) && <span className="w-2 h-2 rounded-full bg-red-500 ml-auto"></span>}
             </div>
             
             <div className="space-y-3">
               {notifications.length === 0 ? (
                 <p className="text-xs text-slate-400 text-center py-4">Sin notificaciones.</p>
               ) : (
                 notifications.map(n => (
                   <div key={n.id} className={`p-3 rounded-lg border text-xs ${n.priority === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                        <div>
                          <p className={`font-bold ${n.priority === 'HIGH' ? 'text-red-800' : 'text-slate-700'}`}>{n.title}</p>
                          <p className="text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium text-right">{n.date}</p>
                        </div>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
