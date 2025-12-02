
import React, { useEffect, useState } from 'react';
import { 
  Users, CheckCircle, XCircle, AlertTriangle, FileText, 
  DollarSign, Truck, Search, Activity, Eye, CreditCard, ShieldCheck, X, Rocket, Calendar, CheckSquare
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
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
                <button 
                  onClick={() => handleAudit(req)}
                  className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700"
                >
                  Revisar
                </button>
              </div>
            ))}
            {requests.filter(r => r.status === SupplierStatus.PENDING).length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">Todo al día. No hay solicitudes pendientes.</p>
            )}
          </div>
        </div>

        {/* Roadmap Widget (MVP Status) */}
        <div className="lg:col-span-1 bg-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket size={100} />
           </div>
           <div className="relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                 <Rocket className="text-sky-400" size={20} /> Roadmap MVP
              </h3>
              <p className="text-slate-400 text-xs mb-4">Progreso del lanzamiento (90 Días)</p>
              
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className="text-sky-400">Fase 1: Core (Beta)</span>
                       <span className="text-white">95%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-sky-500 w-[95%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">✓ Panel, Tienda, Auth, Catálogo</p>
                 </div>

                 <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className="text-slate-300">Fase 2: Financiero</span>
                       <span className="text-slate-400">40%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-500 w-[40%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">En proceso: Wallet, Comisiones Auto</p>
                 </div>

                 <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className="text-slate-500">Fase 3: Logística</span>
                       <span className="text-slate-600">10%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-600 w-[10%]"></div>
                    </div>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400"/>
                    <span className="text-xs font-mono text-slate-300">Día 24/90</span>
                 </div>
                 <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">EN CURSO</span>
              </div>
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
                 <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">{req.address}</div>
              </td>
              <td className="px-6 py-4 font-mono text-slate-600">{req.documentId}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  req.status === SupplierStatus.VERIFIED ? 'bg-green-100 text-green-700' : 
                  req.status === SupplierStatus.PENDING ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {req.status === SupplierStatus.PENDING ? 'Pendiente' : req.status === SupplierStatus.VERIFIED ? 'Verificado' : 'Rechazado'}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {req.status === SupplierStatus.PENDING ? (
                   <button 
                    onClick={() => handleAudit(req)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                   >
                     Auditar
                   </button>
                ) : (
                  <button className="text-slate-400 hover:text-indigo-600"><Eye size={18} /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 relative">
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

      {/* AUDIT MODAL */}
      {selectedRequest && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-600" /> Auditoría de Proveedor
                 </h3>
                 <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Supplier Identity */}
                 <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0"></div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-lg">{selectedRequest.businessName}</h4>
                       <p className="text-sm text-slate-500">{selectedRequest.legalType} • {selectedRequest.address}</p>
                       <p className="text-xs text-slate-400 mt-1">Registrado el {selectedRequest.registeredDate}</p>
                    </div>
                 </div>

                 {/* Automated Checks */}
                 <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Validaciones Automáticas</p>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">Formato Carnet (CI)</span>
                       </div>
                       {auditResult.validCI ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold flex items-center"><CheckCircle size={12} className="mr-1"/> Válido</span>
                       ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> Inválido</span>
                       )}
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">Teléfono Cubano (+53)</span>
                       </div>
                       {auditResult.validPhone ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold flex items-center"><CheckCircle size={12} className="mr-1"/> Válido</span>
                       ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> Inválido</span>
                       )}
                    </div>
                 </div>

                 {/* Disclaimer */}
                 {!auditResult.validCI || !auditResult.validPhone ? (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-800">
                       ⚠️ Advertencia: Los datos proporcionados no cumplen con el formato legal cubano. Se recomienda rechazar la solicitud.
                    </div>
                 ) : (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">
                       ✅ Todo parece correcto. Puedes proceder con la aprobación manual.
                    </div>
                 )}
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                 <button 
                    onClick={() => confirmVerification(false)}
                    className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-white transition-colors"
                 >
                    Rechazar
                 </button>
                 <button 
                    onClick={() => confirmVerification(true)}
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                 >
                    Aprobar Proveedor
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default AdminDashboard;
