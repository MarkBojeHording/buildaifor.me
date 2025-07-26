import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Scale, Briefcase, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickReplies = [
  { text: 'Practice areas', icon: Scale },
  { text: 'Request a consultation', icon: Briefcase },
  { text: 'Attorney profiles', icon: FileText },
  { text: 'Contact information', icon: Phone },
];

function formatResponse(text: string) {
  return text.replace(/\n/g, '<br>');
}

const LawFirmDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "⚖️ Welcome to Justice Partners Law Firm! I'm here to help you with legal inquiries, practice areas, attorney profiles, and consultation requests. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          clientId: 'law-firm-demo',
          ...(conversationId && { conversationId })
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
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
        text: "I'm sorry, I'm having trouble connecting right now. Please check that the backend server is running or try again in a moment.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>
          <div className="text-center mb-8">
            <Badge className="bg-gray-100 text-gray-800 border-gray-300 mb-4">Tier 2 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Justice Partners Law Firm Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our enhanced rule-based chatbot for law firms. This Tier 2 chatbot provides legal information, attorney profiles, and consultation requests.
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
                <CardHeader className="bg-gradient-to-r from-gray-700 to-blue-600 text-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Justice Partners Law Firm</CardTitle>
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
                              ? 'bg-gradient-to-r from-gray-700 to-blue-600 text-white rounded-br-sm'
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
                  </div>
                  {/* Quick Replies */}
                  <div className="flex flex-wrap gap-2 px-4 pb-2">
                    {quickReplies.map((qr, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-gray-400 text-gray-700 hover:bg-gray-50"
                        onClick={() => handleQuickReply(qr.text)}
                        disabled={isLoading}
                      >
                        <qr.icon className="w-4 h-4" />
                        {qr.text}
                      </Button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex-shrink-0 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about legal services, attorneys, or consultations..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gray-700 text-white p-3 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="hidden lg:block">
              <Card className="h-[700px] flex flex-col bg-white/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-700" />
                    Law Firm Chatbot Features
                  </CardTitle>
                  <CardDescription>
                    What can Justice Partners AI do for your clients?
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
                    <li>Practice area information</li>
                    <li>Attorney profiles and bios</li>
                    <li>Consultation requests and scheduling</li>
                    <li>Case status updates</li>
                    <li>Contact and office details</li>
                  </ul>
                  <div className="mt-6">
                    <Badge className="bg-gray-100 text-gray-800">Tier 2 Rule-Based</Badge>
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

export default LawFirmDemo;
