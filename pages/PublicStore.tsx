
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, MessageCircle, X, ChevronLeft, MapPin, DollarSign, Wallet, Zap } from 'lucide-react';
import { StoreProduct, CartItem, CheckoutDetails } from '../types';
import { getMyStoreProducts, submitPublicOrder } from '../services/api';
import { CURRENCY_RATES, MUNICIPIOS_HABANA } from '../constants';

const PublicStore: React.FC = () => {
  // Store Config (Mocked from URL params in real app)
  const storeConfig = {
    name: "Mi Kiosko Habana",
    color: "#0ea5e9", // Sky-500
    whatsapp: "+5355555555"
  };

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'DETAILS' | 'SUCCESS'>('CART');
  
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    customerName: '',
    phone: '+53 ',
    address: '',
    municipality: MUNICIPIOS_HABANA[0],
    paymentMethod: 'Efectivo',
    notes: ''
  });

  useEffect(() => {
    getMyStoreProducts().then(data => {
      setProducts(data.filter(p => p.isActive));
      setLoading(false);
    });
  }, []);

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
    // Basic approximation to CUP for display
    let totalCUP = 0;
    cart.forEach(item => {
      let priceInCUP = item.price;
      if (item.currency === 'USD') priceInCUP = item.price * CURRENCY_RATES.USD_TO_CUP;
      if (item.currency === 'MLC') priceInCUP = item.price * CURRENCY_RATES.MLC_TO_CUP;
      totalCUP += priceInCUP * item.quantity;
    });
    return totalCUP;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPublicOrder({ items: cart, details: checkoutDetails });
    setCheckoutStep('SUCCESS');
    
    // Construct WhatsApp Message
    const itemsList = cart.map(i => `- ${i.quantity}x ${i.name} (${i.price} ${i.currency})`).join('\n');
    const totalEstimated = calculateTotal().toLocaleString();
    const message = `Hola! Quiero pedir en *${storeConfig.name}*:\n\n${itemsList}\n\n*Total Aprox: ${totalEstimated} CUP*\n\nDatos de Entrega:\nNombre: ${checkoutDetails.customerName}\nMunicipio: ${checkoutDetails.municipality}\nDirección: ${checkoutDetails.address}\nPago por: ${checkoutDetails.paymentMethod}\nNota: ${checkoutDetails.notes || 'Ninguna'}`;
    
    const url = `https://wa.me/${storeConfig.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    
    // In real app, we would redirect. Here we show a link button in success screen.
    // window.location.href = url; 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Cargando tienda...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg text-slate-800">{storeConfig.name}</h1>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ShoppingCart size={20} className="text-slate-700" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Product Grid */}
      <main className="p-4 grid grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-slate-100">
            <div className="aspect-square bg-slate-200 relative">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
               {product.stock < 5 && (
                 <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">Poco Stock</span>
               )}
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{product.category}</p>
              <div className="mt-auto flex justify-between items-end">
                <span className="font-bold text-slate-900">{product.customRetailPrice} <span className="text-[10px] font-normal text-slate-500">{product.currency}</span></span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-sky-600 shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
               {checkoutStep === 'DETAILS' ? (
                 <button onClick={() => setCheckoutStep('CART')} className="flex items-center text-slate-500 font-medium">
                   <ChevronLeft size={20} /> Volver
                 </button>
               ) : (
                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <ShoppingCart size={20} /> Tu Pedido
                 </h2>
               )}
               <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                 <X size={20} />
               </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              {checkoutStep === 'CART' && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <ShoppingCart size={48} className="mb-4 opacity-20" />
                      <p>Tu carrito está vacío</p>
                      <button onClick={() => setIsCartOpen(false)} className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg font-bold">
                        Ver Productos
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.productId} className="flex gap-3 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                          <img src={item.image} alt="" className="w-16 h-16 rounded-md object-cover bg-slate-200" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">{item.price} {item.currency}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => item.quantity > 1 ? updateQuantity(item.productId, -1) : removeItem(item.productId)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600"><Minus size={14} /></button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600"><Plus size={14} /></button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500"><X size={16} /></button>
                            <span className="font-bold text-sm">{item.price * item.quantity} {item.currency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'DETAILS' && (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                   <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <h3 className="font-bold text-slate-800 mb-3 flex items-center"><MapPin size={16} className="mr-2 text-sky-500"/> Datos de Entrega</h3>
                     
                     <div className="space-y-3">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                         <input required type="text" value={checkoutDetails.customerName} onChange={e => setCheckoutDetails({...checkoutDetails, customerName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Quien recibe" />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Municipio</label>
                            <select value={checkoutDetails.municipality} onChange={e => setCheckoutDetails({...checkoutDetails, municipality: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none">
                              {MUNICIPIOS_HABANA.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input required type="tel" value={checkoutDetails.phone} onChange={e => setCheckoutDetails({...checkoutDetails, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" placeholder="+53" />
                         </div>
                       </div>
                       
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección Exacta</label>
                         <textarea required rows={2} value={checkoutDetails.address} onChange={e => setCheckoutDetails({...checkoutDetails, address: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" placeholder="Calle, Número, Apto, Entre calles..." />
                       </div>
                     </div>
                   </div>

                   <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <h3 className="font-bold text-slate-800 mb-3 flex items-center"><Wallet size={16} className="mr-2 text-green-500"/> Método de Pago</h3>
                     <div className="grid grid-cols-2 gap-2">
                        {['Efectivo', 'Transfermóvil', 'Zelle', 'USDT'].map(method => (
                          <button 
                            key={method}
                            type="button"
                            onClick={() => setCheckoutDetails({...checkoutDetails, paymentMethod: method})}
                            className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${checkoutDetails.paymentMethod === method ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          >
                            {method}
                          </button>
                        ))}
                     </div>
                   </div>
                </form>
              )}

              {checkoutStep === 'SUCCESS' && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                      <MessageCircle size={40} className="text-green-600" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Casi Listo!</h2>
                   <p className="text-slate-600 mb-8 max-w-xs mx-auto">
                     Tu pedido ha sido generado. Para confirmarlo, debes enviar los detalles por WhatsApp al vendedor.
                   </p>
                   
                   <button 
                     onClick={() => {
                        const itemsList = cart.map(i => `- ${i.quantity}x ${i.name} (${i.price} ${i.currency})`).join('\n');
                        const totalEstimated = calculateTotal().toLocaleString();
                        const message = `Hola! Quiero pedir en *${storeConfig.name}*:\n\n${itemsList}\n\n*Total Aprox: ${totalEstimated} CUP*\n\nDatos de Entrega:\nNombre: ${checkoutDetails.customerName}\nMunicipio: ${checkoutDetails.municipality}\nDirección: ${checkoutDetails.address}\nPago por: ${checkoutDetails.paymentMethod}\nNota: ${checkoutDetails.notes || 'Ninguna'}`;
                        const url = `https://wa.me/${storeConfig.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
                        window.open(url, '_blank');
                     }}
                     className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                   >
                     <MessageCircle size={24} /> Enviar Pedido
                   </button>
                   <p className="text-xs text-slate-400 mt-4">Se abrirá WhatsApp automáticamente</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            {checkoutStep !== 'SUCCESS' && cart.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900">{calculateTotal().toLocaleString()} CUP</span>
                    <p className="text-[10px] text-slate-400">Puede variar según tasa de cambio</p>
                  </div>
                </div>
                
                {checkoutStep === 'CART' ? (
                  <button onClick={() => setCheckoutStep('DETAILS')} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                    Continuar Compra
                  </button>
                ) : (
                  <button form="checkout-form" type="submit" className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                    Finalizar Pedido
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
