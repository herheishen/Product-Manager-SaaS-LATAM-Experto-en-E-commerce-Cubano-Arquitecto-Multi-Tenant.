
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getResellerKPIs, getOrders, getPlanLimits, getRecentNotifications, getInventoryPredictions, getActiveChallenges } from '../services/api';
import { KPI, Notification, NotificationType, AIPrediction, Challenge, PlanTier } from '../types';
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Tag, ShieldAlert, BrainCircuit, Trophy, ArrowRight, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentPlan = PlanTier.FREE;
  const limits = getPlanLimits(currentPlan);

  useEffect(() => {
    const fetchData = async () => {
      const [kpiData, , notifData, predData] = await Promise.all([
        getResellerKPIs(),
        getOrders(),
        getRecentNotifications(),
        getInventoryPredictions(),
        getActiveChallenges()
      ]);
      setKpis(kpiData);
      setNotifications(notifData);
      setPredictions(predData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Cargando...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buenos días, Gestor</h1>
           <p className="text-slate-500 mt-1 font-medium">Resumen de tu actividad hoy.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center">
           <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> Sistema Operativo
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
               <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{kpi.label}</p>
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {kpi.isPositive ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                     {kpi.trend}%
                  </span>
               </div>
               <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
               <p className="text-xs text-slate-400 font-medium mt-1">{kpi.subtext}</p>
            </div>
         ))}
         
         <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
             <div>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-indigo-300 uppercase">Plan {currentPlan}</span>
                   <button className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20">Upgrade</button>
                </div>
                <p className="text-xl font-bold">3 / {limits.maxOrdersPerMonth} Pedidos</p>
             </div>
             <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{width: '30%'}}></div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Area */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Rendimiento Semanal</h3>
            <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <div className="text-center text-slate-400">
                  <BarChart width={500} height={300} data={[{name: 'L', v: 400}, {name: 'M', v: 300}, {name: 'X', v: 600}, {name: 'J', v: 200}, {name: 'V', v: 500}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Bar dataKey="v" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </div>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Predicción de Stock</h3>
               </div>
               <div className="space-y-4">
                  {predictions.slice(0, 3).map((p, i) => (
                     <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                        <div className="min-w-0">
                           <p className="text-sm font-bold text-slate-800 truncate">{p.productName}</p>
                           <p className="text-xs text-slate-500">Quedan {p.currentStock} u</p>
                        </div>
                        <span className={`text-xs font-bold ${p.daysUntilStockout < 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                           {p.daysUntilStockout} días
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 text-sm mb-4">Actividad Reciente</h3>
               <div className="space-y-4">
                  {notifications.slice(0, 3).map((n) => (
                     <div key={n.id} className="flex gap-3 items-start">
                        <div className="mt-0.5 p-1.5 bg-slate-50 rounded-lg flex-shrink-0">
                           {n.type === NotificationType.STOCK_ALERT ? <AlertTriangle size={14} className="text-rose-500"/> : <Tag size={14} className="text-indigo-500"/>}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-800">{n.title}</p>
                           <p className="text-[10px] text-slate-500 mt-1">{n.message}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
