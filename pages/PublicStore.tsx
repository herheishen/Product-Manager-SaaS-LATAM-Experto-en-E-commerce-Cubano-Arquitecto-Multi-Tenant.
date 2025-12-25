

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, MessageCircle, X, ChevronLeft, MapPin, DollarSign, Wallet, Zap, Phone, User, CheckCircle2, Home } from 'lucide-react';
import { StoreProduct, CartItem, CheckoutDetails, StoreConfig, OrderStatus, PaymentMethod } from '../types';
import { getPublicStoreProducts, submitPublicOrder, getPublicStoreDetails } from '../services/api';
import { MUNICIPIOS_HABANA } from '../constants';

interface PublicStoreProps {
  storeId: string;
  onExitPublicStore: () => void;
}

const PublicStore: React.FC<PublicStoreProps> = ({ storeId, onExitPublicStore }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'DETAILS' | 'SUCCESS'>('CART');
  const [orderSubmitted, setOrderSubmitted] = useState<string | null>(null); // To store order ID
  
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    customerName: '',
    phone: '+53 ',
    address: '',
    municipality: MUNICIPIOS_HABANA[0],
    paymentMethod: PaymentMethod.CASH,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [configData, productsData] = await Promise.all([
        getPublicStoreDetails(storeId),
        getPublicStoreProducts(storeId)
      ]);
      setStoreConfig(configData || null);
      setProducts(productsData.filter(p => p.isActive && p.stock > 0));
      setLoading(false);
    };
    fetchData();
  }, [storeId]);

  const addToCart = (product: StoreProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.customRetailPrice,
        quantity: 1,
        image: product.imageUrl,
        currency: product.currency,
        supplierId: product.supplierId
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    let totalUSD = 0;
    cart.forEach(item => {
      // For simplicity, converting everything to USD base in public store
      totalUSD += item.price * item.quantity;
    });
    return totalUSD;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutDetails.customerName || !checkoutDetails.phone || !checkoutDetails.address || !checkoutDetails.municipality) {
      alert('Por favor, rellena todos los campos de contacto y entrega.');
      return;
    }
    if (!storeConfig) {
      alert('Error: No se pudo obtener la configuración de la tienda.');
      return;
    }
    if (!validateCubanPhone(checkoutDetails.phone)) {
        alert('Formato de teléfono incorrecto. Usa +53 5xxxxxxx.');
        return;
    }

    const result = await submitPublicOrder(storeId, { items: cart, details: checkoutDetails });
    if (result.success) {
      setOrderSubmitted(result.orderId);
      setCheckoutStep('SUCCESS');
      setCart([]); // Clear cart after successful order
    } else {
      alert('Hubo un error al procesar tu pedido. Intenta de nuevo.');
    }
  };

  const validateCubanPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    return /^\+53[56]\d{7}$/.test(cleaned);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium">Cargando tienda...</div>;
  if (!storeConfig) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-rose-500 font-bold p-4 text-center">Tienda no encontrada o inactiva.<br/><button onClick={onExitPublicStore} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Volver</button></div>;


  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-4 py-3">
        <div className="max-w-xl mx-auto flex justify-between items-center">
           <button onClick={onExitPublicStore} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors">
             <Home size={20} />
           </button>
           <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight">{storeConfig.name}</h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Abierto ahora
              </p>
           </div>
           <button 
             onClick={() => setIsCartOpen(true)}
             className="relative p-2.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
           >
             <ShoppingCart size={20} className="text-slate-700" />
             {cart.length > 0 && (
               <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border border-white">
                 {cart.reduce((a, b) => a + b.quantity, 0)}
               </span>
             )}
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-xl mx-auto p-4 space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl p-3 shadow-card border border-slate-100 flex gap-4 items-center">
             <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                {product.stock < 5 && product.stock > 0 && <span className="absolute bottom-1 left-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 rounded-sm">Pocos</span>}
                {product.stock === 0 && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-bold">Agotado</span>}
             </div>
             <div className="flex-1 min-w-0 py-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{product.category}</p>
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                   <p className="text-lg font-bold text-slate-900">{product.customRetailPrice.toFixed(2)} <span className="text-xs font-medium text-slate-500">{product.currency}</span></p>
                   <button 
                     onClick={() => addToCart(product)}
                     disabled={product.stock === 0}
                     className="bg-slate-900 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Plus size={18} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </main>

      {/* Floating Cart Button (Mobile Only) */}
      {cart.length > 0 && !isCartOpen && (
         <div className="fixed bottom-6 left-0 right-0 px-4 z-20 md:hidden animate-in slide-in-from-bottom-4">
            <button 
               onClick={() => setIsCartOpen(true)}
               className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-slate-900/20 flex justify-between items-center px-6"
            >
               <span className="flex items-center gap-2 text-sm"><ShoppingCart size={18}/> Ver Pedido</span>
               <span className="text-base">{calculateTotal().toFixed(2)} USD</span>
            </button>
         </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
               <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                 {checkoutStep === 'DETAILS' && <button onClick={() => setCheckoutStep('CART')} className="text-slate-500 hover:text-slate-700"><ChevronLeft size={20} /></button>}
                 {checkoutStep === 'CART' ? 'Tu Carrito' : 'Finalizar Compra'}
               </h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
               {checkoutStep === 'CART' && (
                 <div className="space-y-4">
                    {cart.map(item => (
                       <div key={item.productId} className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-3">
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt={item.name}/>
                          <div className="flex-1">
                             <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                             <p className="text-xs text-slate-500 font-medium">{item.price.toFixed(2)} {item.currency}</p>
                             <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                   <button onClick={() => item.quantity > 1 ? updateQuantity(item.productId, -1) : removeItem(item.productId)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600"><Minus size={12}/></button>
                                   <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                                   <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600"><Plus size={12}/></button>
                                </div>
                                <span className="ml-auto font-bold text-slate-900 text-sm">{(item.price * item.quantity).toFixed(2)} {item.currency}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                    {cart.length === 0 && (
                       <div className="text-center py-20 opacity-40">
                          <ShoppingCart size={64} className="mx-auto mb-4 text-slate-400"/>
                          <p className="text-slate-500">Tu carrito está vacío</p>
                       </div>
                    )}
                 </div>
               )}

               {checkoutStep === 'DETAILS' && (
                  <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                           <User size={16} className="text-indigo-600"/>
                           <h3 className="font-bold text-slate-900 text-sm">Tus Datos</h3>
                        </div>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                              <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" placeholder="Ej. Juan Pérez" value={checkoutDetails.customerName} onChange={e => setCheckoutDetails({...checkoutDetails, customerName: e.target.value})} />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                              <div className="relative">
                                 <Phone className="absolute left-4 top-3.5 text-slate-400" size={16}/>
                                 <input 
                                   required type="tel" 
                                   className={`w-full bg-slate-50 border ${!validateCubanPhone(checkoutDetails.phone) && checkoutDetails.phone !== '+53 ' ? 'border-rose-500' : 'border-slate-200'} rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900`} 
                                   placeholder="+53 5xxx xxxx" 
                                   value={checkoutDetails.phone} 
                                   onChange={e => setCheckoutDetails({...checkoutDetails, phone: e.target.value})} />
                                 {!validateCubanPhone(checkoutDetails.phone) && checkoutDetails.phone !== '+53 ' && <p className="text-[10px] text-rose-500 mt-1">Formato incorrecto. Ej: +53 51234567</p>}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                           <MapPin size={16} className="text-indigo-600"/>
                           <h3 className="font-bold text-slate-900 text-sm">Entrega</h3>
                        </div>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Municipio</label>
                              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none text-slate-900" value={checkoutDetails.municipality} onChange={e => setCheckoutDetails({...checkoutDetails, municipality: e.target.value})}>
                                 {MUNICIPIOS_HABANA.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dirección Exacta</label>
                              <textarea required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none text-slate-900" placeholder="Calle, #, Entre calles..." value={checkoutDetails.address} onChange={e => setCheckoutDetails({...checkoutDetails, address: e.target.value})} />
                           </div>
                        </div>
                     </div>

                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                           <Wallet size={16} className="text-indigo-600"/>
                           <h3 className="font-bold text-slate-900 text-sm">Pago</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {Object.values(PaymentMethod).map(m => (
                              <button 
                                 key={m} type="button" 
                                 onClick={() => setCheckoutDetails({...checkoutDetails, paymentMethod: m})}
                                 className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${checkoutDetails.paymentMethod === m ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                              >
                                 {m}
                              </button>
                           ))}
                        </div>
                     </div>
                  </form>
               )}

               {checkoutStep === 'SUCCESS' && (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
                     <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                        <CheckCircle2 size={48} className="text-emerald-600" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Pedido #{orderSubmitted?.split('-')[1]} Recibido!</h2>
                     <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs">
                        Para confirmar tu compra, envía el resumen generado por WhatsApp al vendedor.
                     </p>
                     <button 
                        onClick={() => {
                           const itemsList = cart.map(i => `- ${i.quantity}x ${i.name} (${i.price.toFixed(2)} ${i.currency})`).join('\n');
                           const total = calculateTotal().toFixed(2);
                           const msg = `Hola! Quiero pedir en *${storeConfig?.name || 'tu tienda'}*:\n\n${itemsList}\n\n*Total Aprox: ${total} USD*\n\nDatos:\n${checkoutDetails.customerName}\n${checkoutDetails.address}, ${checkoutDetails.municipality}\nPago: ${checkoutDetails.paymentMethod}`;
                           window.open(`https://wa.me/${storeConfig?.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors"
                     >
                        <MessageCircle size={20} /> Confirmar en WhatsApp
                     </button>
                     <button 
                       onClick={onExitPublicStore} 
                       className="mt-4 w-full py-3 border border-slate-200 bg-white text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                     >
                       Volver al Panel
                     </button>
                  </div>
               )}
            </div>
            
            {/* Footer Action */}
            {checkoutStep !== 'SUCCESS' && cart.length > 0 && (
               <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                  <div className="flex justify-between items-end mb-4 px-2">
                     <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Total Estimado</span>
                     <div className="text-right">
                        <span className="text-2xl font-bold text-slate-900 leading-none">{calculateTotal().toFixed(2)} USD</span>
                     </div>
                  </div>
                  {checkoutStep === 'CART' ? (
                     <button onClick={() => setCheckoutStep('DETAILS')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                        Continuar
                     </button>
                  ) : (
                     <button type="submit" form="checkout-form" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]">
                        Realizar Pedido
                     </button>
                  )}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicStore;
