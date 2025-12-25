import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { getResellerKPIs, getResellerOrders, getPlanLimits, getRecentNotifications, getInventoryPredictions } from '../services/api';
import { KPI, Notification, NotificationType, AIPrediction, PlanTier } from '../types';
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Tag, BrainCircuit, Rocket, Check, Store, ShoppingBag, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Using Link for internal navigation

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 1, title: 'Personaliza tu Tienda', desc: 'Sube tu logo y elige colores.', done: true, icon: Store, path: '/my-store' },
    { id: 2, title: 'Agrega tu Primer Producto', desc: 'Explora el Marketplace.', done: false, icon: ShoppingBag, path: '/marketplace' },
    { id: 3, title: 'Comparte en WhatsApp', desc: 'Consigue tu primera venta.', done: false, icon: Share2, path: '/my-store' }, // Path to Marketing tab
  ]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const currentPlan = PlanTier.FREE;
  const limits = getPlanLimits(currentPlan);

  useEffect(() => {
    const fetchData = async () => {
      const [kpiData, ordersData, notifData, predData] = await Promise.all([
        getResellerKPIs(),
        // Fix: Changed `getOrders()` to `getResellerOrders()`
        getResellerOrders(), // To check if user has orders
        getRecentNotifications(),
        getInventoryPredictions(),
      ]);
      setKpis(kpiData);
      setNotifications(notifData);
      setPredictions(predData);
      setLoading(false);

      // Determine onboarding status
      const hasProducts = (await (await fetch('/api/my-store-products')).json()).length > 0; // Simulate actual data check
      const hasOrders = ordersData.length > 0;
      
      const updatedSteps = [...onboardingSteps];
      if (hasProducts) updatedSteps[1].done = true;
      if (hasOrders) updatedSteps[2].done = true; // Assuming sharing leads to orders
      setOnboardingSteps(updatedSteps);

      if (updatedSteps.every(step => step.done)) {
        setOnboardingCompleted(true);
      }
    };
    fetchData();
  }, []);

  const handleOnboardingStepClick = (stepId: number, path: string) => {
    // For demo purposes, we'll mark the step as done after navigation,
    // in a real app, this would be triggered by actual data (e.g., product added)
    const updatedSteps = onboardingSteps.map(step => 
      step.id === stepId ? { ...step, done: true } : step
    );
    setOnboardingSteps(updatedSteps);
    if (updatedSteps.every(step => step.done)) {
      setOnboardingCompleted(true);
    }
    onNavigate(path);
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Cargando...</div>;

  const renderOnboarding = () => (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 mb-8 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-10 opacity-10"><Rocket size={120} /></div>
       <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">🚀 ¡Tu viaje comienza aquí!</h2>
          <p className="text-indigo-100 mb-6 max-w-lg">Completa estos pasos para lanzar tu negocio en Cuba sin invertir un centavo.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {onboardingSteps.map((step) => (
                <button 
                  key={step.id} 
                  onClick={() => !step.done && handleOnboardingStepClick(step.id, step.path)}
                  className={`bg-white/10 backdrop-blur-md border ${step.done ? 'border-emerald-400/50 bg-emerald-900/20' : 'border-white/10'} p-4 rounded-xl flex items-start gap-3 transition-all hover:bg-white/20 cursor-pointer text-left`}
                >
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
                      {step.done ? <Check size={16} /> : <span className="font-bold text-sm">{step.id}</span>}
                   </div>
                   <div>
                      <h3 className={`font-bold text-sm ${step.done ? 'text-emerald-200' : 'text-white'}`}>{step.title}</h3>
                      <p className="text-xs text-indigo-200 mt-0.5">{step.desc}</p>
                   </div>
                </button>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buenos días, Gestor</h1>
           <p className="text-slate-500 mt-1 font-medium">Aquí tienes el pulso de tu negocio hoy.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> Sistema Operativo
            </span>
        </div>
      </div>

      {!onboardingCompleted && renderOnboarding()}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-500 transition-colors">{kpi.label}</p>
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {kpi.isPositive ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                     {kpi.trend}%
                  </span>
               </div>
               <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
               <p className="text-xs text-slate-400 font-medium mt-2">{kpi.subtext}</p>
            </div>
         ))}
         
         <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={100} /></div>
             <div>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Plan {currentPlan}</span>
                   <button 
                     onClick={() => onNavigate('/subscription')}
                     className="text-[10px] bg-white/10 px-2 py-1 rounded text-white group-hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     Mejorar Plan
                   </button>
                </div>
                <p className="text-2xl font-bold mt-2">3 / {limits.maxOrdersPerMonth} Pedidos</p>
                <p className="text-xs text-slate-400 mt-1">Renueva en 12 días</p>
             </div>
             <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{width: '30%'}}></div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Area */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Rendimiento Semanal</h3>
                <button 
                  onClick={() => console.log('Navegar a reporte completo')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                    Ver Reporte <ArrowRight size={12} className="ml-1"/>
                </button>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center">
               <div className="w-full h-full">
                  <React.Fragment> {/* Recharts Wrapper */}
                    <div className="w-full h-full text-xs">
                        {/* Placeholder for Recharts - In real app use ResponsiveContainer */}
                        <div className="flex items-end justify-between h-full px-4 pb-4 gap-2">
                            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                <div key={i} className="w-full bg-indigo-50 rounded-t-lg relative group">
                                    <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-all"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </React.Fragment>
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
                     <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                        <div className="min-w-0">
                           <p className="text-sm font-bold text-slate-800 truncate">{p.productName}</p>
                           <p className="text-xs text-slate-500">Quedan {p.currentStock} u</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.daysUntilStockout < 5 && p.daysUntilStockout > 0 ? 'bg-rose-100 text-rose-700' : p.daysUntilStockout === 0 ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                           {p.daysUntilStockout > 0 ? `${p.daysUntilStockout} días` : 'Agotado'}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 text-sm mb-4">Actividad Reciente</h3>
               <div className="space-y-4 relative">
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  {notifications.slice(0, 3).map((n) => (
                     <div key={n.id} className="flex gap-3 items-start relative z-10">
                        <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 border-2 border-white shadow-sm ${n.type === NotificationType.STOCK_ALERT ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                           {n.type === NotificationType.STOCK_ALERT ? <AlertTriangle size={10} /> : <Tag size={10} />}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-800">{n.title}</p>
                           <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                           <span className="text-[9px] text-slate-400 mt-1 block">{n.date}</span>
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