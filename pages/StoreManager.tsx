import React, { useState, useEffect } from 'react';
import { Share2, Save, ExternalLink, MessageCircle, DollarSign, Wallet, Zap, Package, Edit2, Eye, EyeOff, Search, ArrowRight, Wand2, Calculator, X, Rocket, Send, Copy, Image as ImageIcon, Download, AlertTriangle, Check } from 'lucide-react';
import { StoreConfig, PlanTier, StoreProduct, AIPriceSuggestion } from '../types';
import { getMyStoreProducts, generateSmartCopy, getSmartPriceSuggestion, generateSocialAsset, updateResellerStoreConfig, updateResellerStoreProductPrice, getResellerStoreConfig } from '../services/api';
import { MUNICIPIOS_HABANA } from '../constants';

interface StoreManagerProps {
  onViewPublicStore: (storeId: string) => void;
  // currentUserStoreId: string; // From App.tsx state
}

const StoreManager: React.FC<StoreManagerProps> = ({ onViewPublicStore }) => {
  const currentUserStoreId = 'tienda-pepe'; // Mock current user's store

  const [activeTab, setActiveTab] = useState<'CONFIG' | 'CATALOG' | 'MARKETING'>('CONFIG');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // AI Modal States
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProductForAI, setCurrentProductForAI] = useState<StoreProduct | null>(null);
  
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<AIPriceSuggestion | null>(null);

  // Marketing States
  const [assetGenerating, setAssetGenerating] = useState<string | null>(null);
  const [generatedAssetUrl, setGeneratedAssetUrl] = useState<string | null>(null);

  const [config, setConfig] = useState<StoreConfig>({
    ownerId: 'reseller-pepe', // Mock ID
    name: "Mi Kiosko Habana",
    subdomain: currentUserStoreId,
    themeColor: "#0ea5e9", // Default Sky 500
    whatsappNumber: "+5355555555",
    products: [],
    planTier: PlanTier.FREE,
    acceptedPayments: {
      cash: true,
      transfermovil: true,
      zelle: false,
      usdt: false
    },
    storeStatus: 'ACTIVE'
  });

  const [saving, setSaving] = useState(false);
  const [hasPriceErrors, setHasPriceErrors] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);


  useEffect(() => {
    const fetchStoreData = async () => {
      if (currentUserStoreId) {
        const storeConfig = await getResellerStoreConfig(currentUserStoreId);
        if (storeConfig) {
          setConfig(storeConfig);
        }
      }
    };
    fetchStoreData();
  }, [currentUserStoreId]);

  useEffect(() => {
    if (activeTab === 'CATALOG' || activeTab === 'MARKETING') {
      setLoadingProducts(true);
      getMyStoreProducts(currentUserStoreId).then(data => {
        setProducts(data);
        setLoadingProducts(false);
      });
    }
  }, [activeTab, currentUserStoreId]);

  // Validation Effect
  useEffect(() => {
    const error = products.some(p => p.isActive && p.customRetailPrice < p.priceWholesale * 1.05);
    setHasPriceErrors(error);
  }, [products]);

  const handleSave = async () => {
    if (hasPriceErrors) {
       alert("Tienes productos con margen de ganancia inseguro (< 5%). Corrígelos antes de guardar.");
       return;
    }
    setSaving(true);
    await updateResellerStoreConfig(currentUserStoreId, config);
    // Update product prices if they were edited
    for (const p of products) {
      // In a real app, only changed prices would be sent
      await updateResellerStoreProductPrice(currentUserStoreId, p.id, p.customRetailPrice);
    }
    
    setTimeout(() => {
      setSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1000); // Simulate API call
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

  const handlePriceChange = (id: string, newPrice: string) => {
    const val = parseFloat(newPrice);
    setProducts(products.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          customRetailPrice: val,
          profitMargin: val - p.priceWholesale
        };
      }
      return p;
    }));
  };

  const toggleProductActive = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // AI Actions
  const handleGenerateCopy = async (product: StoreProduct) => {
    setCurrentProductForAI(product);
    setIsGenerating(true);
    setCopyModalOpen(true);
    setGeneratedCopy('');
    
    const text = await generateSmartCopy(product.name, product.customRetailPrice, product.currency, product.description);
    setGeneratedCopy(text);
    setIsGenerating(false);
  };

  const handleSmartPrice = async (product: StoreProduct) => {
    setCurrentProductForAI(product);
    setIsGenerating(true);
    setPriceModalOpen(true);
    setPriceSuggestion(null);

    // Mock zone selection for demo
    const suggestion = await getSmartPriceSuggestion(product.id, product.priceWholesale, MUNICIPIOS_HABANA[0]); // Using first municipality as mock zone
    setPriceSuggestion(suggestion);
    setIsGenerating(false);
  };

  const applySuggestedPrice = () => {
    if (priceSuggestion && currentProductForAI) {
      handlePriceChange(currentProductForAI.id, priceSuggestion.suggestedPrice.toString());
      setPriceModalOpen(false);
    }
  };

  const handleGenerateAsset = async (productId: string) => {
    setAssetGenerating(productId);
    setGeneratedAssetUrl(null); // Clear previous asset
    const url = await generateSocialAsset(productId, 'STORY');
    setGeneratedAssetUrl(url);
    setAssetGenerating(null);
  };

  const renderConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
      {/* Settings Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Identidad Visual</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre Comercial</label>
              <input 
                type="text" 
                value={config.name}
                onChange={e => setConfig({...config, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                placeholder="Ej: Variedades Marianao"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Enlace Público (Subdominio)</label>
              <div className="flex shadow-sm rounded-xl overflow-hidden">
                <span className="inline-flex items-center px-4 bg-slate-100 border-r border-slate-200 text-slate-500 text-sm font-medium">
                  {config.subdomain.split('.')[1] || 'kiosko.cu'}/
                </span>
                <input 
                  type="text" 
                  value={config.subdomain.split('.')[0]}
                  readOnly // Should be readOnly or managed via a separate flow
                  className="flex-1 min-w-0 block w-full px-4 py-3 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center font-medium">
                <ExternalLink size={12} className="mr-1" /> Tu tienda es visible en esta dirección
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Métodos de Cobro</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => togglePayment('cash')}
              className={`p-4 rounded-xl border text-left flex items-center transition-all ${config.acceptedPayments.cash ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-2.5 rounded-full mr-3 ${config.acceptedPayments.cash ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <DollarSign size={20} />
              </div>
              <div>
                <span className={`block text-sm font-bold ${config.acceptedPayments.cash ? 'text-emerald-800' : 'text-slate-600'}`}>Efectivo (Contra Entrega)</span>
                <span className="text-xs text-slate-500">Recomendado en La Habana</span>
              </div>
            </button>
            
            <button 
              onClick={() => togglePayment('transfermovil')}
              className={`p-4 rounded-xl border text-left flex items-center transition-all ${config.acceptedPayments.transfermovil ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`p-2.5 rounded-full mr-3 ${config.acceptedPayments.transfermovil ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                <Wallet size={20} />
              </div>
              <div>
                <span className={`block text-sm font-bold ${config.acceptedPayments.transfermovil ? 'text-sky-800' : 'text-slate-600'}`}>Transfermóvil / EnZona</span>
                <span className="text-xs text-slate-500">CUP / MLC</span>
              </div>
            </button>

            <button 
              onClick={() => togglePayment('zelle')}
              className={`p-4 rounded-xl border text-left flex items-center transition-all ${config.acceptedPayments.zelle ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
               <div className={`p-2.5 rounded-full mr-3 ${config.acceptedPayments.zelle ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                <Zap size={20} />
              </div>
              <div>
                <span className={`block text-sm font-bold ${config.acceptedPayments.zelle ? 'text-purple-800' : 'text-slate-600'}`}>Zelle (USD)</span>
                <span className="text-xs text-slate-500">Cobro en el exterior</span>
              </div>
            </button>

            <button 
              onClick={() => togglePayment('usdt')}
              className={`p-4 rounded-xl border text-left flex items-center transition-all ${config.acceptedPayments.usdt ? 'border-green-500 bg-green-50/50 ring-1 ring-green-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
               <div className={`p-2.5 rounded-full mr-3 ${config.acceptedPayments.usdt ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                <Zap size={20} />
              </div>
              <div>
                <span className={`block text-sm font-bold ${config.acceptedPayments.usdt ? 'text-green-800' : 'text-slate-600'}`}>USDT (TRC20)</span>
                <span className="text-xs text-slate-500">Criptomoneda</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recepción de Pedidos</h2>
          <div className="p-4 bg-emerald-50 rounded-xl mb-4 border border-emerald-100 flex gap-3">
             <MessageCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
             <div>
                <h3 className="text-sm font-bold text-emerald-900">Sistema "WhatsApp First"</h3>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Cuando un cliente finalice la compra, se abrirá su WhatsApp con un mensaje detallado listo para enviarte. 
                </p>
             </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tu WhatsApp (Gestor)</label>
            <input 
              type="text" 
              value={config.whatsappNumber}
              onChange={e => setConfig({...config, whatsappNumber: e.target.value})}
              placeholder="+53 5xxx xxxx"
              className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-mono font-medium text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1 hidden lg:block sticky top-6 h-full">
          <div className="border-[8px] border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white h-[640px] flex flex-col relative mx-auto max-w-[320px]">
             {/* Mobile Notch */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl z-20"></div>

             {/* Mobile Header */}
             <div className="bg-indigo-600 text-white p-4 pt-10 text-center shadow-md relative z-10">
               <h2 className="font-bold text-lg leading-tight">{config.name}</h2>
               <p className="text-[10px] opacity-80 uppercase tracking-widest mt-0.5">Tienda Verificada</p>
             </div>
             
             {/* Mobile Content Mock */}
             <div className="flex-1 p-3 overflow-y-auto bg-slate-50 space-y-3 custom-scrollbar">
               <div className="text-xs text-slate-400 text-center my-2 font-medium">-- Catálogo Destacado --</div>
               {products.slice(0, 3).map(p => (
                 <div key={p.id} className="bg-white p-2 rounded-lg shadow-sm flex gap-3 border border-slate-100">
                    <img src={p.imageUrl} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-slate-100 rounded w-1/2 mb-2"></div>
                      <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-indigo-600">{p.customRetailPrice} {p.currency}</p>
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px]">+</div>
                      </div>
                    </div>
                 </div>
               ))}
               
               {/* Sticky Cart Button Mock */}
               <div className="p-3 bg-white border-t border-slate-100 z-10 mt-auto">
                 <button className="w-full bg-slate-900 text-white py-2.5 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
                   <MessageCircle size={18} fill="white" className="text-white" />
                   Enviar Pedido
                 </button>
               </div>
            </div>
          </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">Control de Precios y Margen</h3>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed max-w-2xl">
              Aquí decides cuánto ganas. El "Costo Mayorista" es fijo, pero puedes subir tu "Precio de Venta" tanto como quieras. 
              <span className="font-bold"> El sistema bloqueará precios que generen menos del 5% de margen.</span>
            </p>
          </div>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800 text-lg">Tus Productos</h2>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{products.length}</span>
             </div>
             <div className="relative w-full md:w-64">
               <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-slate-900" />
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             </div>
          </div>
          
          {loadingProducts ? (
            <div className="p-20 text-center text-slate-500">Cargando inventario...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 w-20">Imagen</th>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4">Costo (Mayorista)</th>
                    <th className="px-6 py-4 w-48">Tu Precio (Retail)</th>
                    <th className="px-6 py-4">Tu Ganancia</th>
                    <th className="px-6 py-4">Herramientas IA</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(product => {
                    const isMarginLow = product.customRetailPrice < product.priceWholesale * 1.05;
                    
                    return (
                      <tr key={product.id} className={`hover:bg-slate-50/80 transition-colors ${!product.isActive ? 'opacity-60 bg-slate-50' : ''}`}>
                        <td className="px-6 py-4">
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100" />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{product.category} • {product.supplierName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-slate-600 font-medium">
                            {product.priceWholesale.toFixed(2)} {product.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="relative">
                              <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                              <input 
                                type="number" 
                                value={product.customRetailPrice.toFixed(2)}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className={`w-full pl-6 pr-3 py-2 border rounded-lg font-bold text-slate-800 focus:ring-2 outline-none transition-all ${isMarginLow ? 'border-rose-300 bg-rose-50 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500/20'}`}
                              />
                           </div>
                           {isMarginLow && <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center"><AlertTriangle size={10} className="mr-1"/> Margen bajo</p>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-base ${product.profitMargin > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                             {product.profitMargin > 0 ? '+' : ''}{product.profitMargin.toFixed(2)} {product.currency}
                          </span>
                          <div className="text-[10px] text-slate-400 font-medium">Margen: {Math.round((product.profitMargin / product.priceWholesale) * 100)}%</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                             <button 
                               onClick={() => handleGenerateCopy(product)}
                               className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
                               title="Generar Copy de Venta"
                             >
                               <Wand2 size={16} />
                             </button>
                             <button 
                               onClick={() => handleSmartPrice(product)}
                               className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
                               title="Sugerir Precio IA"
                             >
                               <Calculator size={16} />
                             </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleProductActive(product.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${product.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                          >
                            {product.isActive ? <Eye size={14}/> : <EyeOff size={14}/>}
                            {product.isActive ? 'Visible' : 'Oculto'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
       </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Viraliza tu Tienda */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Rocket className="text-indigo-500" /> Viraliza tu Tienda
             </h2>
             <p className="text-sm text-slate-500 mb-6">Comparte el enlace de tu tienda en tus redes sociales favoritas para atraer clientes.</p>
             
             <div className="space-y-3">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`¡Visita mi tienda en Kiosko.cu! Los mejores productos al mejor precio:\n${config.subdomain}`)}`, '_blank')}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-200"
                >
                  <MessageCircle size={20} /> Compartir en WhatsApp
                </button>
                <button 
                  onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(config.subdomain)}&text=${encodeURIComponent('¡Mira mi tienda en Kiosko.cu!')}`, '_blank')}
                  className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-200"
                >
                  <Send size={20} /> Compartir en Telegram
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(config.subdomain)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Copy size={20} /> Copiar Enlace
                </button>
             </div>
          </div>

          {/* Generador de Contenido */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <ImageIcon className="text-pink-500" /> Creador de Stories
             </h2>
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 h-64 flex flex-col items-center justify-center">
                {generatedAssetUrl ? (
                   <div className="relative w-full h-full group">
                      <img src={generatedAssetUrl} alt="Story Generated" className="w-full h-full object-cover rounded-lg shadow-sm" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                         <a href={generatedAssetUrl} download={`kiosko-story-${assetGenerating}.jpg`} className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Download size={18} /> Descargar
                         </a>
                      </div>
                   </div>
                ) : assetGenerating ? (
                   <div className="text-center">
                      <Wand2 className="animate-spin text-pink-500 mx-auto mb-3" size={32} />
                      <p className="text-sm text-slate-500 font-medium">Diseñando tu Story...</p>
                   </div>
                ) : (
                   <div className="text-center text-slate-400">
                      <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">Selecciona un producto abajo</p>
                   </div>
                )}
             </div>

             <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Elige un Producto</label>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                   {products.slice(0, 5).map(p => (
                      <button 
                        key={p.id}
                        onClick={() => handleGenerateAsset(p.id)}
                        disabled={!!assetGenerating}
                        className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-slate-100 relative overflow-hidden hover:border-pink-500 transition-all shadow-sm"
                      >
                         <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Tienda</h1>
          <p className="text-slate-500 font-medium">Administra tu vitrina y catálogo de productos.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => onViewPublicStore(config.subdomain.split('.')[0])}
            className="flex items-center justify-center px-5 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-bold flex-1 md:flex-none"
          >
            <ExternalLink size={18} className="mr-2" /> Ver Tienda
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || hasPriceErrors}
            className={`flex items-center justify-center px-6 py-2.5 rounded-xl text-white shadow-lg transition-all font-bold flex-1 md:flex-none ${hasPriceErrors ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
          >
            {saving ? 'Guardando...' : hasPriceErrors ? 'Corrige Errores' : <><Save size={18} className="mr-2" /> Guardar Todo</>}
          </button>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-right">
          <Check size={20} />
          <span className="font-medium text-sm">¡Cambios guardados con éxito!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
              activeTab === 'CONFIG'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center ${
              activeTab === 'CATALOG'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Package size={16} className="mr-2" /> Mi Catálogo
          </button>
          <button
            onClick={() => setActiveTab('MARKETING')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center ${
              activeTab === 'MARKETING'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Rocket size={16} className="mr-2" /> Marketing & Viral
          </button>
        </nav>
      </div>

      {activeTab === 'CONFIG' && renderConfig()}
      {activeTab === 'CATALOG' && renderCatalog()}
      {activeTab === 'MARKETING' && renderMarketing()}

      {/* Copy Generator Modal */}
       {copyModalOpen && currentProductForAI && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCopyModalOpen(false)}></div>
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                 <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Wand2 size={20} /> Generador de Copy (Revolico)
                 </h3>
                 <button onClick={() => setCopyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-indigo-400"/></button>
              </div>
              <div className="p-6">
                 {isGenerating ? (
                   <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Wand2 className="animate-spin mb-4 text-indigo-500" size={32} />
                      <p className="font-medium text-sm">Creando el texto perfecto para Cuba...</p>
                   </div>
                 ) : (
                   <>
                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">Producto: {currentProductForAI.name}</p>
                     <textarea 
                        className="w-full h-48 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none font-mono bg-slate-50 text-slate-900"
                        value={generatedCopy}
                        readOnly
                     />
                     <div className="mt-4 flex gap-3">
                       <button onClick={() => {navigator.clipboard.writeText(generatedCopy); setCopyModalOpen(false)}} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Copiar Texto</button>
                     </div>
                   </>
                 )}
              </div>
           </div>
         </div>
       )}

      {/* Price Suggestion Modal */}
       {priceModalOpen && currentProductForAI && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPriceModalOpen(false)}></div>
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                 <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Calculator size={20} /> Sugerencia de Precio IA
                 </h3>
                 <button onClick={() => setPriceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-indigo-400"/></button>
              </div>
              <div className="p-6">
                 {isGenerating ? (
                   <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Calculator className="animate-bounce mb-4 text-indigo-500" size={32} />
                      <p className="font-medium text-sm">Calculando el precio óptimo...</p>
                   </div>
                 ) : (
                   <>
                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">Producto: {currentProductForAI.name}</p>
                     {priceSuggestion && (
                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 flex justify-between items-center">
                          <div>
                             <p className="text-sm text-slate-500">Precio Sugerido (USD)</p>
                             <p className="text-2xl font-bold text-indigo-600 mt-1">${priceSuggestion.suggestedPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-slate-500">Tu Costo: ${currentProductForAI.priceWholesale.toFixed(2)}</p>
                             <p className="text-xs text-emerald-600 font-bold">Ganancia: ${(priceSuggestion.suggestedPrice - currentProductForAI.priceWholesale).toFixed(2)}</p>
                          </div>
                       </div>
                     )}
                     <p className="text-xs text-slate-500 mb-4">{priceSuggestion?.reasoning}</p>

                     <div className="mt-4 flex gap-3">
                       <button onClick={applySuggestedPrice} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Aplicar Sugerencia</button>
                     </div>
                   </>
                 )}
              </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default StoreManager;