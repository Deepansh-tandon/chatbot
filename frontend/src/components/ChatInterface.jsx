import { useState, useRef, useEffect } from 'react';
import { Send, Flame, Package, CreditCard, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { DealCard, OrderCard, PaymentCard } from './cards';

const QUICK_OPTIONS = [
  { id: 'deals', label: 'New Deals', icon: Flame, message: 'Show me new deals', color: 'text-orange-500' },
  { id: 'orders', label: 'Orders', icon: Package, message: 'Show my orders', color: 'text-amber-500' },
  { id: 'status', label: 'Status', icon: CreditCard, message: 'Show payment status', color: 'text-[#1c9cf0]' },
  { id: 'other', label: 'Other', icon: MessageCircle, message: 'Help', color: 'text-purple-500' },
];

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInputMessage('');
    
    setMessages((prev) => [...prev, { 
      role: 'user', 
      content: userMessage,
      type: 'text'
    }]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(userMessage);
      
      if (response.success && response.data) {
        const { type, cardType, message, cards, quickActions } = response.data;
        
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: message,
          type: type || 'text',
          cardType: cardType,
          cards: cards || [],
          quickActions: quickActions || []
        }]);
      } else {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I didn\'t understand that. Could you please rephrase?',
          type: 'text'
        }]);
      }
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('401') || errorMessage.includes('token') || errorMessage.includes('login') || errorMessage.includes('Authentication required')) {
        errorMessage = 'Authentication required. Please login to use this feature.';
      }
      
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option) => {
    sendMessage(option.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const renderCards = (cards, cardType) => {
    if (!cards || cards.length === 0) return null;

    const cardWidth = 280;

    return (
      <div className="relative mt-4">
        <div 
          className="overflow-x-auto pb-3 custom-scrollbar horizontal"
          style={{ 
            maxWidth: '1168px',
            scrollbarWidth: 'thin',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {cards.map((card, index) => {
              switch (cardType) {
                case 'deal':
                  return (
                    <div 
                      key={card.id || index} 
                      style={{ 
                        minWidth: `${cardWidth}px`, 
                        maxWidth: `${cardWidth}px`, 
                        flexShrink: 0 
                      }}
                    >
                      <DealCard deal={card} />
                    </div>
                  );
                case 'order':
                  return (
                    <div 
                      key={card.id || index} 
                      style={{ 
                        minWidth: `${cardWidth}px`, 
                        maxWidth: `${cardWidth}px`, 
                        flexShrink: 0 
                      }}
                    >
                      <OrderCard order={card} />
                    </div>
                  );
                case 'payment':
                  return (
                    <div 
                      key={card.id || index} 
                      style={{ 
                        minWidth: `${cardWidth}px`, 
                        maxWidth: `${cardWidth}px`, 
                        flexShrink: 0 
                      }}
                    >
                      <PaymentCard payment={card} />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    );
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#17181c] rounded-2xl border border-[#061622]">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-0 bg-[#000000]"
      >
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
             
              <h2 className="text-2xl font-semibold text-[#e7e9ea] mb-2">
                Hi! I'm your shopping assistant.
              </h2>
              <p className="text-[#72767a]">
                Ask me for "New Deals" or "My Orders"
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Message bubble */}
                <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-[#061622] flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-[#1c9cf0]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#1c9cf0] text-white'
                        : 'bg-[#17181c] text-[#e7e9ea] border border-[#061622]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-[#181818] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#72767a] text-sm font-medium">U</span>
                    </div>
                  )}
                </div>

                {/* Render cards if present */}
                {msg.role === 'assistant' && msg.cards && msg.cards.length > 0 && (
                  <div className="ml-13 mt-4">
                    {renderCards(msg.cards, msg.cardType)}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#061622] flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#1c9cf0]" />
                </div>
                <div className="bg-[#17181c] text-[#e7e9ea] rounded-2xl px-4 py-3 border border-[#061622]">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-[#72767a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#72767a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#72767a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Buttons */}
      <div className="px-6 py-3 bg-[#17181c] border-t border-[#061622]">
        <div className="flex justify-center gap-2 flex-wrap">
          {QUICK_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleQuickOption(option)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#000000] border border-[#061622] text-[#e7e9ea] text-sm hover:bg-[#061622] hover:border-[#1c9cf0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon className={`h-4 w-4 ${option.color}`} />
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-6 pt-4 bg-[#17181c] border-t border-[#061622]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-[#000000] rounded-full border border-[#061622] px-5 py-3 focus-within:border-[#1c9cf0] focus-within:ring-2 focus-within:ring-[#1c9cf0]/20 transition-all">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for 'New Deals'..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-[#e7e9ea] placeholder:text-[#72767a] focus:outline-none text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex items-center justify-center rounded-full bg-[#1c9cf0] text-white p-2 transition-all hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1c9cf0]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
