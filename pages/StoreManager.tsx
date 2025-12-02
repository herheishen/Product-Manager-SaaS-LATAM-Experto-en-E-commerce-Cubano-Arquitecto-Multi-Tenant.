
import React, { useState } from 'react';
import { Share2, Smartphone, Save, ExternalLink, MessageCircle, DollarSign, Wallet, Zap } from 'lucide-react';
import { StoreConfig, PlanTier } from '../types';

const StoreManager: React.FC = () => {
  const [config, setConfig] = useState<StoreConfig>({
    name: "Mi Kiosko Habana",
    subdomain: "tienda-habana.kiosko.cu",
    themeColor: "#0ea5e9",
    whatsappNumber: "+5355555555",
    products: [],
    planTier: PlanTier.FREE,
    acceptedPayments: {
      cash: true,
      transfermovil: true,
      zelle: false,
      usdt: false
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const togglePayment = (key: keyof typeof config.acceptedPayments) => {
    setConfig({
      ...config,
      acceptedPayments: {
        ...config.acceptedPayments,
        [key]: !config.acceptedPayments[key]
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración de Tienda</h1>
          <p className="text-slate-500">Personaliza tu vitrina digital y métodos de cobro.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm font-medium w-full md:w-auto justify-center"
        >
          {saving ? 'Guardando...' : <><Save size={18} className="mr-2" /> Guardar Cambios</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Identidad Visual</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={config.name}
                  onChange={e => setConfig({...config, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  placeholder="Ej: Variedades Marianao"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enlace Público (Subdominio)</label>
                <div className="flex shadow-sm rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                    kiosko.cu/
                  </span>
                  <input 
                    type="text" 
                    value={config.subdomain.split('.')[0]}
                    readOnly
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-slate-300 rounded-none rounded-r-md text-slate-900 font-medium sm:text-sm focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center">
                  <ExternalLink size={12} className="mr-1" /> Tu tienda es visible en esta dirección
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Métodos de Cobro (Cuba)</h2>
            <p className="text-sm text-slate-500 mb-4">Selecciona qué formas de pago aceptas. Esto aparecerá en el mensaje de pedido.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => togglePayment('cash')}
                className={`p-3 rounded-lg border text-left flex items-center transition-all ${config.acceptedPayments.cash ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`p-2 rounded-full mr-3 ${config.acceptedPayments.cash ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className={`block text-sm font-bold ${config.acceptedPayments.cash ? 'text-green-800' : 'text-slate-600'}`}>Efectivo (Contra Entrega)</span>
                  <span className="text-xs text-slate-500">Recomendado en La Habana</span>
                </div>
              </button>
              
              <button 
                onClick={() => togglePayment('transfermovil')}
                className={`p-3 rounded-lg border text-left flex items-center transition-all ${config.acceptedPayments.transfermovil ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`p-2 rounded-full mr-3 ${config.acceptedPayments.transfermovil ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Wallet size={20} />
                </div>
                <div>
                  <span className={`block text-sm font-bold ${config.acceptedPayments.transfermovil ? 'text-sky-800' : 'text-slate-600'}`}>Transfermóvil / EnZona</span>
                  <span className="text-xs text-slate-500">CUP / MLC</span>
                </div>
              </button>

              <button 
                onClick={() => togglePayment('zelle')}
                className={`p-3 rounded-lg border text-left flex items-center transition-all ${config.acceptedPayments.zelle ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
              >
                 <div className={`p-2 rounded-full mr-3 ${config.acceptedPayments.zelle ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Zap size={20} />
                </div>
                <div>
                  <span className={`block text-sm font-bold ${config.acceptedPayments.zelle ? 'text-purple-800' : 'text-slate-600'}`}>Zelle (USD)</span>
                  <span className="text-xs text-slate-500">Cobro en el exterior</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recepción de Pedidos</h2>
            <div className="p-4 bg-green-50 rounded-lg mb-4 border border-green-100 flex gap-3">
               <MessageCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
               <div>
                  <h3 className="text-sm font-bold text-green-900">Sistema "WhatsApp First"</h3>
                  <p className="text-xs text-green-700 mt-1 leading-relaxed">
                    Cuando un cliente finalice la compra, se abrirá su WhatsApp con un mensaje detallado listo para enviarte. 
                    Tú confirmas el pago y gestionas el envío desde aquí.
                  </p>
               </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu WhatsApp (Gestor)</label>
              <input 
                type="text" 
                value={config.whatsappNumber}
                onChange={e => setConfig({...config, whatsappNumber: e.target.value})}
                placeholder="+53 5xxx xxxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">Es vital incluir el código de país correcto (+53).</p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vista Previa Móvil</h3>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">iPhone 14</span>
            </div>
            
            <div className="border-[8px] border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white h-[640px] flex flex-col relative mx-auto max-w-[320px]">
               {/* Mobile Notch */}
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl z-20"></div>

               {/* Mobile Header */}
               <div className="bg-sky-600 text-white p-4 pt-10 text-center shadow-md relative z-10">
                 <h2 className="font-bold text-lg leading-tight">{config.name}</h2>
                 <p className="text-[10px] opacity-80 uppercase tracking-widest mt-0.5">Tienda Verificada</p>
               </div>
               
               {/* Mobile Content Mock */}
               <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 custom-scrollbar">
                 <div className="text-xs text-gray-400 text-center my-2 font-medium">-- Catálogo Destacado --</div>
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white p-2 rounded-lg shadow-sm flex gap-3 border border-gray-100">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2 mb-2"></div>
                        <div className="flex items-center justify-between">
                            <div className="h-3 bg-sky-100 rounded w-1/3"></div>
                            <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-[10px]">+</div>
                        </div>
                      </div>
                   </div>
                 ))}
                 
                 {/* Mock Cart Summary */}
                 <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold">4,500 CUP</span>
                    </div>
                    <div className="flex justify-between text-xs mb-3">
                        <span className="text-gray-600">Envío (Habana)</span>
                        <span className="font-bold">300 CUP</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-2 mb-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Pagos Aceptados:</p>
                        <div className="flex gap-1 flex-wrap">
                            {config.acceptedPayments.cash && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">Efectivo</span>}
                            {config.acceptedPayments.transfermovil && <span className="text-[9px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">Transfermóvil</span>}
                            {config.acceptedPayments.zelle && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">Zelle</span>}
                        </div>
                    </div>
                 </div>
               </div>

               {/* Sticky Cart Button Mock */}
               <div className="p-3 bg-white border-t border-gray-100 z-10">
                 <div className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer">
                   <MessageCircle size={18} fill="white" className="text-white" />
                   Enviar Pedido (4,800 CUP)
                 </div>
                 <p className="text-[9px] text-center text-gray-400 mt-1.5">Serás redirigido a WhatsApp</p>
               </div>
            </div>
            
            <button className="w-full mt-6 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm font-medium">
              <Share2 size={16} className="mr-2" /> Copiar Link de Tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManager;
