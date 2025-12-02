
import React, { useEffect, useState } from 'react';
import { 
  Users, CheckCircle, XCircle, AlertTriangle, FileText, 
  DollarSign, Truck, Search, Activity, Eye, CreditCard
} from 'lucide-react';
import { 
  getAdminStats, getSupplierRequests, getPendingPayouts 
} from '../services/api';
import { KPI, SupplierRequest, SupplierStatus, Payout, PayoutStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<KPI[]>([]);
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SUPPLIERS' | 'FINANCE' | 'LOGISTICS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, reqData, payoutData] = await Promise.all([
        getAdminStats(),
        getSupplierRequests(),
        getPendingPayouts()
      ]);
      setStats(statsData);
      setRequests(reqData);
      setPayouts(payoutData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Cargando Panel Maestro...</div>;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className={`text-xs mt-1 font-medium ${stat.isPositive ? 'text-green-600' : 'text-orange-500'}`}>
                {stat.subtext}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stat.isPositive ? 'bg-slate-50' : 'bg-orange-50'}`}>
              <Activity size={20} className={stat.isPositive ? 'text-slate-600' : 'text-orange-500'} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-indigo-600" /> 
              Verificaciones Pendientes
            </h3>
            <button onClick={() => setActiveTab('SUPPLIERS')} className="text-sm text-indigo-600 hover:underline">Ver todas</button>
          </div>
          <div className="space-y-3">
            {requests.filter(r => r.status === SupplierStatus.PENDING).slice(0, 3).map(req => (
              <div key={req.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                   <p className="font-bold text-slate-900 text-sm">{req.businessName}</p>
                   <p className="text-xs text-slate-500">{req.ownerName} • CI: {req.documentId}</p>
                </div>
                <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">
                  Revisar
                </button>
              </div>
            ))}
            {requests.filter(r => r.status === SupplierStatus.PENDING).length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">Todo al día. No hay solicitudes pendientes.</p>
            )}
          </div>
        </div>

        {/* Payout Alert Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800 flex items-center">
               <DollarSign className="w-5 h-5 mr-2 text-green-600" />
               Liquidación Semanal
             </h3>
             <button onClick={() => setActiveTab('FINANCE')} className="text-sm text-indigo-600 hover:underline">Gestionar</button>
          </div>
          <div className="space-y-3">
             {payouts.map(pay => (
                <div key={pay.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                      <p className="font-bold text-slate-900 text-sm">{pay.supplierName}</p>
                      <p className="text-xs text-slate-500">{pay.pendingOrders} pedidos • {pay.period}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{pay.currency === 'USD' ? '$' : ''}{pay.amount} <span className="text-[10px] text-slate-500">{pay.currency}</span></p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-bold uppercase">Pendiente</span>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Control de Proveedores (KYC)</h2>
        <div className="relative">
          <input type="text" placeholder="Buscar por CI o nombre..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-3">Negocio / Dueño</th>
            <th className="px-6 py-3">Documento ID</th>
            <th className="px-6 py-3">Inventario Inicial</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{req.businessName}</div>
                <div className="text-xs text-slate-500">{req.ownerName}</div>
              </td>
              <td className="px-6 py-4 font-mono text-slate-600">{req.documentId}</td>
              <td className="px-6 py-4">{req.inventoryCount} items</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  req.status === SupplierStatus.VERIFIED ? 'bg-green-100 text-green-700' : 
                  req.status === SupplierStatus.PENDING ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {req.status === SupplierStatus.PENDING ? 'Pendiente' : req.status === SupplierStatus.VERIFIED ? 'Verificado' : 'Rechazado'}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="text-slate-400 hover:text-indigo-600"><Eye size={18} /></button>
                {req.status === SupplierStatus.PENDING && (
                  <>
                    <button className="text-green-500 hover:text-green-700"><CheckCircle size={18} /></button>
                    <button className="text-red-500 hover:text-red-700"><XCircle size={18} /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <span className="bg-indigo-600 text-white p-1 rounded">
                <Activity size={20} /> 
             </span>
             Panel Super Admin
           </h1>
           <p className="text-slate-500 text-sm mt-1">Gestión centralizada de KioskoCubano</p>
        </div>
        
        {/* Module Navigation Tabs */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 mt-4 md:mt-0">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'OVERVIEW' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Resumen
          </button>
          <button 
             onClick={() => setActiveTab('SUPPLIERS')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'SUPPLIERS' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Proveedores
          </button>
          <button 
             onClick={() => setActiveTab('FINANCE')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'FINANCE' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Finanzas
          </button>
          <button 
             onClick={() => setActiveTab('LOGISTICS')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'LOGISTICS' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Logística
          </button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && renderOverview()}
      {activeTab === 'SUPPLIERS' && renderSuppliers()}
      {activeTab === 'FINANCE' && (
        <div className="bg-white p-10 text-center rounded-xl border border-slate-100 text-slate-500">
           <CreditCard className="mx-auto h-12 w-12 text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">Módulo Financiero</h3>
           <p className="max-w-md mx-auto mt-2">Gestión de liquidaciones semanales y control de fees de la plataforma. (Vista detallada en desarrollo para MVP)</p>
        </div>
      )}
      {activeTab === 'LOGISTICS' && (
        <div className="bg-white p-10 text-center rounded-xl border border-slate-100 text-slate-500">
           <Truck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">Torre de Control Logística</h3>
           <p className="max-w-md mx-auto mt-2">Monitoreo en tiempo real de mensajeros privados y entregas. Mapa de calor de zonas de entrega.</p>
        </div>
      )}
    </div>
  );
};

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default AdminDashboard;
