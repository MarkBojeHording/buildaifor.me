import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Clock, MapPin, Phone, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
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
    .replace(/\n/g, '<br>')
    .replace(/(?!^)<br>• /g, '<br><br>• ') // double break before bullets except at start
    .replace(/^• /gm, '<br>• ') // ensure bullet at start of line gets a break
    .trim();
}

const HairSalonDemo = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Welcome to Elegance Hair Salon! We're here to help you look and feel your best. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    { text: "What are your hours?", icon: Clock },
    { text: "What services do you offer?", icon: Scissors },
    { text: "How much do haircuts cost?", icon: MessageSquare },
    { text: "Do you take appointments?", icon: Phone }
  ];

  const scrollToBottom = () => {
    // Only scroll within the chat messages container, not the entire page
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll to bottom when there are messages, not on initial load
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);



  const sendMessage = async (messageText: string) => {
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

    // Custom hair salon responses
    let customBotMessage: string | null = null;
    if (/what.*services|services.*what|offer.*services/i.test(messageText)) {
      customBotMessage =
        "💇‍♀️ Our Services:\n\n• Haircuts & Styling\n• Hair Coloring & Highlights\n• Hair Extensions\n• Keratin Treatments\n• Hair & Scalp Treatments\n• Bridal & Special Occasion Styling\n\nWe offer a full range of hair services!";
    } else if (/how.*much|price|cost|expensive|cheap/i.test(messageText)) {
      customBotMessage =
        "💰 Pricing:\n\n• Haircut: $45-75\n• Hair Color: $85-150\n• Highlights: $120-200\n• Hair Extensions: $200-500\n• Keratin Treatment: $150-300\n\nPrices vary based on hair length and complexity!";
    } else if (/who.*stylists|stylists.*who|staff/i.test(messageText)) {
      customBotMessage =
        "👩‍🎨 Our Stylists:\n\n• Sarah - Master Colorist (10+ years)\n• Mike - Cutting Specialist (8+ years)\n• Emma - Styling Expert (5+ years)\n• Lisa - Extension Specialist (12+ years)\n\nAll our stylists are licensed and experienced!";
    } else if (/appointment|book.*appointment|schedule/i.test(messageText)) {
      customBotMessage =
        "📅 Appointments:\n\n• Call us at (555) 123-4567\n• Book online at elegancehair.com\n• Walk-ins welcome (subject to availability)\n• We recommend booking 1-2 weeks in advance\n\nWe'll help you find the perfect time!";
    } else if (/what.*hours|hours.*what|open.*time/i.test(messageText)) {
      customBotMessage =
        "🕒 Our Hours:\n\n• Tuesday - Friday: 9:00 AM - 8:00 PM\n• Saturday: 9:00 AM - 6:00 PM\n• Sunday: 10:00 AM - 4:00 PM\n• Monday: Closed\n\nWe're here to make you beautiful!";
    } else if (/contact|phone|call|address/i.test(messageText)) {
      customBotMessage =
        "📞 Contact Information:\n\n• Phone: (555) 123-4567\n• Address: 789 Beauty Lane, Downtown\n• Email: info@elegancehair.com\n• Website: elegancehair.com\n\nWe'd love to hear from you!";
    } else if (/consultation|consult/i.test(messageText)) {
      customBotMessage =
        "💡 Consultations:\n\n• Free consultations available\n• Color consultations: 30 minutes\n• Style consultations: 15 minutes\n• Book your consultation today!\n\nLet's discuss your hair goals!";
    }

    if (customBotMessage) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: customBotMessage!,
            isUser: false,
            timestamp: new Date()
          }
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Fallback response for unmatched questions
    const fallbackMessage = "I don't have specific information about that, but I can help you with:\n\n• Our services and pricing\n• Stylist information\n• Appointments and hours\n• Contact information\n\nOr call us directly at (555) 123-4567 for personalized assistance!";

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: fallbackMessage,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 1000);
    return;

    try {
      const response = await fetch(`${getApiUrl('tier1')}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          config: { client_id: 'demo-salon' },
          ...(conversationId && { conversation_id: conversationId })
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please check that the Supabase Edge Function is deployed or try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              // Clear saved scroll position for main page
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
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">Tier 1 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Elegance Hair Salon Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our basic FAQ chatbot in action. This Tier 1 chatbot provides essential information about services, pricing, appointments, and stylists.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Elegance Hair Salon</CardTitle>
                      <CardDescription className="text-pink-100">
                        Basic FAQ Chatbot • Powered by AI
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
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-br-sm'
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

                    {/* Typing Indicator */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Salon assistant is typing...</p>
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
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
                        placeholder="Ask about our services, pricing, appointments..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-pink-600 text-white p-3 rounded-2xl hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <MapPin className="w-5 h-5 text-pink-600" />
                    Salon Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Address:</p>
                    <p className="text-sm text-gray-600">789 Beauty Lane, Shopping District</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Hours:</p>
                    <p className="text-sm text-gray-600">Tue-Sat 9AM-8PM, Sun 10AM-6PM, Mon Closed</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone:</p>
                    <p className="text-sm text-gray-600">(555) 987-6543</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-600" />
                    Tier 1 Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Service Menu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Hours & Contact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Stylist Info</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-pink-600" />
                    Demo Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Ask about salon hours</p>
                    <p>• Inquire about services</p>
                    <p>• Check pricing information</p>
                    <p>• Ask about appointments</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HairSalonDemo;
