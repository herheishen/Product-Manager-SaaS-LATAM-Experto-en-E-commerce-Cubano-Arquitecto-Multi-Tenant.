
import React, { useEffect, useState } from 'react';
import { Check, Star, Zap, Shield, Globe, BarChart3, Users, HelpCircle, AlertCircle } from 'lucide-react';
import { PlanDetails, PlanTier } from '../types';
import { getSubscriptionPlans } from '../services/api';

const Subscription: React.FC = () => {
  const [plans, setPlans] = useState<PlanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPlan = PlanTier.FREE; // Mock current plan

  useEffect(() => {
    getSubscriptionPlans().then(data => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-500">Cargando planes...</div>;

  const getPlanIcon = (id: PlanTier) => {
    switch (id) {
      case PlanTier.FREE: return <Zap className="w-6 h-6" />;
      case PlanTier.PRO: return <Star className="w-6 h-6" />;
      case PlanTier.ULTRA: return <Shield className="w-6 h-6" />;
    }
  };

  const getPlanColor = (id: PlanTier) => {
    switch (id) {
      case PlanTier.FREE: return 'bg-slate-500';
      case PlanTier.PRO: return 'bg-sky-500';
      case PlanTier.ULTRA: return 'bg-indigo-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Elige el plan ideal para tu negocio</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Escala desde "Vendedor de WhatsApp" hasta "Distribuidor Mayorista" con nuestras herramientas SaaS.
          Sin tarjetas de crédito requeridas para empezar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
              plan.id === PlanTier.PRO 
                ? 'bg-white shadow-2xl ring-2 ring-sky-500 scale-105 z-10' 
                : 'bg-white shadow-md border border-slate-100'
            }`}
          >
            {plan.id === PlanTier.PRO && (
              <div className="bg-sky-500 text-white text-xs font-bold uppercase py-1 text-center tracking-widest">
                Más Popular
              </div>
            )}

            <div className="p-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white ${getPlanColor(plan.id)}`}>
                {getPlanIcon(plan.id)}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{plan.description}</p>
              
              <div className="mt-6 flex items-baseline">
                {plan.priceUSD === 0 ? (
                  <span className="text-4xl font-extrabold text-slate-900">Gratis</span>
                ) : (
                  <>
                    <span className="text-4xl font-extrabold text-slate-900">${plan.priceUSD}</span>
                    <span className="text-slate-500 font-medium ml-1">/mes</span>
                  </>
                )}
              </div>
              {plan.priceCUP > 0 && (
                <p className="text-xs text-slate-400 mt-1">aprox {plan.priceCUP} CUP</p>
              )}

              <button 
                className={`w-full mt-8 py-3 px-4 rounded-xl font-bold transition-colors ${
                  plan.id === currentPlan
                    ? 'bg-slate-100 text-slate-500 cursor-default'
                    : plan.id === PlanTier.PRO
                      ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.id === currentPlan ? 'Plan Actual' : 'Seleccionar Plan'}
              </button>
            </div>

            <div className="bg-slate-50 p-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4">Qué incluye:</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-600">
                    <strong className="text-slate-900">{plan.limits.maxStores === 9999 ? 'Tiendas Ilimitadas' : `${plan.limits.maxStores} Tienda(s)`}</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-600">
                    <strong className="text-slate-900">{plan.limits.maxProducts === 9999 ? 'Productos Ilimitados' : `Hasta ${plan.limits.maxProducts} Productos`}</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-600">
                    {plan.limits.maxOrdersPerMonth === 9999 ? 'Pedidos Ilimitados' : `${plan.limits.maxOrdersPerMonth} Pedidos/mes`}
                  </span>
                </li>

                {plan.limits.features.customDomain ? (
                  <li className="flex items-start">
                    <Globe className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-600 font-medium">Dominio Propio (.cu)</span>
                  </li>
                ) : (
                   <li className="flex items-start opacity-50">
                    <XIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-500">Subdominio Kiosko</span>
                  </li>
                )}

                {plan.limits.features.removeBranding ? (
                   <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Sin marca de agua</span>
                  </li>
                ) : (
                  <li className="flex items-start opacity-50">
                    <XIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-500">Con marca "Kiosko"</span>
                  </li>
                )}

                 {plan.limits.features.apiAccess && (
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-600 font-bold">API para Desarrolladores</span>
                  </li>
                )}
                 
                 {plan.limits.features.localDropshipping && (
                  <li className="flex items-start">
                    <Users className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-600 font-bold">Gestión de Multi-Vendedores</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ / Info Section */}
      <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <HelpCircle className="mr-2 text-slate-400" /> Preguntas Frecuentes (Cuba)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">¿Cómo puedo pagar el plan PRO?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Aceptamos pagos a través de saldo en tu billetera Kiosko. Puedes recargar usando 
                Transferencia Bancaria (CUP/MLC), Zelle (USD) o Criptomonedas (USDT).
              </p>
           </div>
           <div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">¿Qué pasa si supero los 10 pedidos del plan GRATIS?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                No bloqueamos tus ventas. Sin embargo, se aplicará una comisión de servicio del 10% 
                a los pedidos adicionales hasta que actualices tu plan o comience el siguiente mes.
              </p>
           </div>
           <div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">¿Necesito licencia TCP para el plan ULTRA?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                No es obligatorio para usar el software, pero para operar legalmente como importador/distribuidor 
                en Cuba recomendamos tener tu documentación en regla.
              </p>
           </div>
           <div>
              <h4 className="font-bold text-slate-800 text-sm mb-2">¿Puedo cancelar cuando quiera?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Sí. No hay contratos forzosos. Si cancelas, tu cuenta volverá al plan FREE al finalizar el ciclo de facturación.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
);

export default Subscription;
