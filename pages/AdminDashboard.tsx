
import React, { useEffect, useState } from 'react';
import { 
  Users, CheckCircle, XCircle, AlertTriangle, FileText, 
  DollarSign, Truck, Search, Activity, Eye, CreditCard, ShieldCheck, X, Rocket, Calendar, MapPin, Package
} from 'lucide-react';
import { 
  getAdminStats, getSupplierRequests, getPendingPayouts, 
  validateCubanCI, validateCubanPhone, verifySupplier 
} from '../services/api';
import { KPI, SupplierRequest, SupplierStatus, Payout, PayoutStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<KPI[]>([]);
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SUPPLIERS' | 'FINANCE' | 'LOGISTICS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  // Verification Modal State
  const [selectedRequest, setSelectedRequest] = useState<SupplierRequest | null>(null);
  const [auditResult, setAuditResult] = useState<{validCI: boolean, validPhone: boolean} | null>(null);

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

  const handleAudit = (request: SupplierRequest) => {
    const validCI = validateCubanCI(request.documentId);
    const validPhone = validateCubanPhone(request.phone);
    setAuditResult({ validCI, validPhone });
    setSelectedRequest(request);
  };

  const confirmVerification = async (approved: boolean) => {
    if (!selectedRequest) return;
    const status = approved ? SupplierStatus.VERIFIED : SupplierStatus.REJECTED;
    await verifySupplier(selectedRequest.id, status);
    
    // Update local state
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status } : r));
    setSelectedRequest(null);
    setAuditResult(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
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
    </div>
  );

  const renderSuppliers = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Control de Proveedores (KYC)</h2>
        <div className="relative">
          <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-3">Negocio / Dueño</th>
            <th className="px-6 py-3">Legalidad</th>
            <th className="px-6 py-3">Documento ID</th>
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
              <td className="px-6 py-4">
                 <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">{req.legalType}</span>
              </td>
              <td className="px-6 py-4 font-mono text-slate-600">{req.documentId}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  req.status === SupplierStatus.VERIFIED ? 'bg-green-100 text-green-700' : 
                  req.status === SupplierStatus.PENDING ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {req.status === SupplierStatus.PENDING && (
                   <button onClick={() => handleAudit(req)} className="text-indigo-600 font-bold text-xs">Auditar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-emerald-500" /> Liquidaciones Pendientes
         </h2>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                     <th className="px-6 py-3">Proveedor</th>
                     <th className="px-6 py-3">Periodo</th>
                     <th className="px-6 py-3">Monto</th>
                     <th className="px-6 py-3">Estado</th>
                     <th className="px-6 py-3 text-right">Acción</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {payouts.map(pay => (
                     <tr key={pay.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-900">{pay.supplierName}</td>
                        <td className="px-6 py-4 text-slate-600">{pay.period}</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                           {pay.amount.toLocaleString()} {pay.currency}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                              pay.status === PayoutStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                           }`}>
                              {pay.status === PayoutStatus.PAID ? 'Pagado' : 'Pendiente'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {pay.status !== PayoutStatus.PAID && (
                              <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800">
                                 Liquidar
                              </button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Truck className="text-blue-500" /> Envíos en Curso (La Habana)
          </h2>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                         <Package size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-slate-900 text-sm">ORD-{1000+i}</p>
                         <p className="text-xs text-slate-500">Destino: Playa, Calle 60</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">En Ruta</span>
                      <p className="text-[10px] text-slate-400 mt-1">Mensajero: Y. Pérez</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
       <div className="bg-slate-900 text-white p-6 rounded-xl">
          <h3 className="font-bold mb-4">Métricas Logísticas</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-sm text-slate-400">Tiempo Promedio</span>
                <span className="font-bold">28h</span>
             </div>
             <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-sm text-slate-400">Incidencias</span>
                <span className="font-bold text-red-400">2%</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Entregados Hoy</span>
                <span className="font-bold text-green-400">14</span>
             </div>
          </div>
       </div>
    </div>
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900">Panel Maestro</h1>
         <div className="flex bg-white rounded-lg p-1 border border-slate-200">
           {['OVERVIEW', 'SUPPLIERS', 'FINANCE', 'LOGISTICS'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === tab ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {tab}
             </button>
           ))}
         </div>
      </div>

      {activeTab === 'OVERVIEW' && renderOverview()}
      {activeTab === 'SUPPLIERS' && renderSuppliers()}
      {activeTab === 'FINANCE' && renderFinance()}
      {activeTab === 'LOGISTICS' && renderLogistics()}

      {/* Audit Modal */}
      {selectedRequest && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Auditoría: {selectedRequest.businessName}</h3>
                 <button onClick={() => setSelectedRequest(null)}><X size={20}/></button>
              </div>
              <div className="space-y-4 mb-6">
                 <div className={`p-3 rounded-lg flex justify-between items-center ${auditResult.validCI ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="text-sm font-medium">Formato Carnet ID</span>
                    {auditResult.validCI ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                 </div>
                 <div className={`p-3 rounded-lg flex justify-between items-center ${auditResult.validPhone ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="text-sm font-medium">Formato Teléfono (+53)</span>
                    {auditResult.validPhone ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => confirmVerification(false)} className="flex-1 py-3 border border-slate-300 rounded-lg font-bold hover:bg-slate-50">Rechazar</button>
                 <button onClick={() => confirmVerification(true)} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Aprobar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
