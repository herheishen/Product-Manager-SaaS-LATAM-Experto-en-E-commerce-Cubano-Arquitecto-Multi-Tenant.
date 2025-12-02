
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '👋 ¡Hola! Soy KioskoBot. ¿En qué puedo ayudarte hoy? Puedo explicarte sobre pagos, envíos o cómo mejorar tus ventas.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Response Logic (Context-Aware for Cuba)
    setTimeout(() => {
      let botResponse = "Lo siento, no entendí bien. ¿Podrías reformularlo?";
      const lower = userMsg.toLowerCase();

      if (lower.includes('pago') || lower.includes('zelle') || lower.includes('cobrar')) {
        botResponse = "💳 **Pagos:** Aceptamos efectivo contra entrega en La Habana. Para provincias o pagos desde el exterior, puedes usar Zelle, Transfermóvil (CUP/MLC) o USDT. Configura tus métodos en 'Mi Tienda'.";
      } else if (lower.includes('envio') || lower.includes('transporte') || lower.includes('mensajeria')) {
        botResponse = "🛵 **Envíos:** Los proveedores gestionan su propia mensajería. En La Habana suele demorar 24-48h. Para provincias, se utiliza correo postal o camiones particulares (demora 3-7 días).";
      } else if (lower.includes('precio') || lower.includes('ganancia') || lower.includes('dinero')) {
        botResponse = "💰 **Precios:** Tú decides el precio final (Retail). Tu ganancia es la diferencia entre tu precio y el costo mayorista. ¡Usa nuestra herramienta de 'IA Precio' en el catálogo para sugerencias!";
      } else if (lower.includes('hola') || lower.includes('buenas')) {
        botResponse = "¡Hola! ¿Listo para vender más hoy? 🚀";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 group"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Asistente Kiosko
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden font-sans">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                 <Bot size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-sm">KioskoBot AI</h3>
                 <p className="text-[10px] text-indigo-200 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> En línea
                 </p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'bot' && <Sparkles size={12} className="inline-block text-indigo-400 mr-1 mb-0.5" />}
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda..."
                className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
