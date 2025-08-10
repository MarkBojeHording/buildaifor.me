import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Clock, MapPin, Phone, Home } from 'lucide-react';
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
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert *italic* to <em>
    .replace(/\n/g, '<br>')
    .replace(/(?!^)<br>• /g, '<br><br>• ')
    .replace(/^• /gm, '<br>• ')
    .trim();
}

const quickReplies = [
  { text: 'Show me available properties', icon: Home },
  { text: 'What\'s the current market like?', icon: MessageSquare },
  { text: 'I want to buy a home', icon: MessageSquare },
  { text: 'Schedule a viewing', icon: Clock },
];

const RealEstateDemo = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🏠 Welcome to Dream Homes Realty! I'm here to help you with property searches, market info, lead qualification, and connecting you with agents. How can I assist you today?",
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
      client_id: 'real-estate-demo',
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
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.session_id) setSessionId(data.session_id);

      // Handle nested response structure from fallback responses
      const responseText = data.response?.response || data.response || 'No response received';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to the Supabase Edge Function right now. Please try again in a moment.",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">Tier 2 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dream Homes Realty Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our enhanced rule-based chatbot for real estate. This Tier 2 chatbot provides property search, market info, lead qualification, and agent connection.
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
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Dream Homes Realty</CardTitle>
                      <CardDescription className="text-blue-100">
                        Enhanced Rule-Based Chatbot
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
                              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-br-sm'
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
                          <p className="text-xs text-gray-500 mt-2">Real estate assistant is typing...</p>
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
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
                        placeholder="Ask about properties, market trends, or schedule a viewing..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <MapPin className="w-5 h-5 text-green-600" />
                    Office Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Address:</p>
                    <p className="text-sm text-gray-600">456 Real Estate Blvd, Suite 200, Downtown City, ST 12345</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Hours:</p>
                    <p className="text-sm text-gray-600">Mon-Sun: 9:00 AM - 7:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone:</p>
                    <p className="text-sm text-gray-600">(555) 987-6543</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email:</p>
                    <p className="text-sm text-gray-600">info@dreamhomesrealty.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">24/7 Support:</p>
                    <p className="text-sm text-gray-600">Available for urgent property inquiries</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    Tier 2 Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Property search assistance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Market analysis and trends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Lead qualification and routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Agent matching by specialization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Appointment scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">24/7 availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Instant responses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    Demo Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Ask about available properties</p>
                    <p>• Inquire about market trends</p>
                    <p>• Request agent matching</p>
                    <p>• Schedule a property viewing</p>
                    <p>• Ask about office hours or contact info</p>
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

export default RealEstateDemo;
