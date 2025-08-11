import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Clock, ShoppingCart, Package, Star, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import Header from '../components/Header.tsx';
import FooterDemo from '../components/FooterDemo.tsx';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function formatResponse(text: string | undefined | null) {
  if (!text || typeof text !== 'string') {
    return 'No response received';
  }

  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/(?!^)<br>• /g, '<br><br>• ')
    .replace(/^• /gm, '<br>• ')
    .trim();
}

const quickReplies = [
  { text: 'Show me trending products', icon: TrendingUp },
  { text: 'What\'s on sale today?', icon: ShoppingCart },
  { text: 'I need product recommendations', icon: Star },
  { text: 'Track my order', icon: Package },
];

const ShopSmartDemo = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🛍️ Welcome to ShopSmart! I'm your AI shopping assistant. I can help you find products, track orders, provide recommendations, and answer any questions about our store. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  async function sendMessage(messageText: string) {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const payload: Record<string, unknown> = {
      message: messageText,
      client_id: 'ecommerce-demo',
    };
    if (sessionId) payload.session_id = sessionId;

    try {
      const response = await fetch(`${getApiUrl('tier2')}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I couldn\'t process your request.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m experiencing technical difficulties. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              const savedPositions = sessionStorage.getItem('scrollPositions');
              if (savedPositions) {
                try {
                  const positions = JSON.parse(savedPositions);
                  delete positions['/'];
                  sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
                } catch (error) {
                  console.warn('Failed to clear scroll position:', error);
                }
              }
              navigate('/');
            }}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to AI Solutions
          </Button>
          <div className="text-center mb-8">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-4">Tier 2 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ShopSmart AI Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our advanced AI shopping assistant with product recommendations, order tracking, and intelligent customer support.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white">ShopSmart AI Assistant</CardTitle>
                      <CardDescription className="text-purple-100">
                        Advanced E-commerce Chatbot
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container min-h-0 max-h-96">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            message.isUser
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                          }`}
                        >
                          <div
                            className="chat-message text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatResponse(message.text) }}
                          />
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">ShopSmart assistant is typing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Quick Replies */}
                  <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => {
                        const IconComponent = reply.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply.text)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                          >
                            <IconComponent className="w-4 h-4" />
                            {reply.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex-shrink-0 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about products, track orders, or get recommendations..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-purple-600 text-white p-3 rounded-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                      >
                        <MessageSquare className="w-6 h-6" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                    ShopSmart Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Product recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Order tracking & status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Inventory availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Price comparisons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Return & refund info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">24/7 customer support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Personalized shopping</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm font-medium text-green-600">0.8s avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Query Resolution</span>
                      <span className="text-sm font-medium text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <span className="text-sm font-medium text-green-600">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-sm font-medium text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Demo Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Ask for product recommendations</p>
                    <p>• Inquire about trending items</p>
                    <p>• Request order tracking</p>
                    <p>• Ask about sales and discounts</p>
                    <p>• Get help with returns or refunds</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <FooterDemo />
    </div>
  );
};

export default ShopSmartDemo;
