import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, Clock, MapPin, Phone, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function formatResponse(text: string) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/(?!^)<br>• /g, '<br><br>• ') // double break before bullets except at start
    .replace(/^• /gm, '<br>• ') // ensure bullet at start of line gets a break
    .trim();
}

const DentalOfficeDemo = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! Welcome to ABC Dental Office! 🦷 I'm here to help you with information about our services, hours, insurance, and appointments. How can I assist you today?",
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
    { text: "How do I book an appointment?", icon: Phone },
    { text: "What services do you offer?", icon: MessageSquare },
    { text: "What is the address to the dental clinic?", icon: MessageSquare }
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

  // Add effect to ensure page starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update the sendMessage function to handle the new quick replies with custom answers
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

    // Custom quick reply answers
    let customBotMessage: string | null = null;
    if (/what services do you offer/i.test(messageText)) {
      customBotMessage =
        "🦷 Our Dental Services:\n\n• Cleanings\n• Exams\n• Fillings\n• Emergency Care\n\nLet us know if you have a specific dental need!";
    } else if (/what is the address to the dental clinic/i.test(messageText)) {
      customBotMessage =
        "📍 Our Address:\n\n123 Main Street\nCity, State 12345\n\nCall us at (555) 123-4567 if you need directions!";
    } else if (/how do i book an appointment/i.test(messageText)) {
      customBotMessage =
        "📅 Booking an Appointment:\n\n• Call us at (555) 123-4567\n• Visit our website to book online\n• Or stop by our clinic at 123 Main Street\n\nLet us know if you need a specific date or time!";
    } else if (/what are your hours/i.test(messageText)) {
      customBotMessage =
        "🕒 Our Hours:\n\n• Monday - Friday: 8:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 3:00 PM\n• Sunday: Closed\n\nWe're here to serve you during these hours!";
    } else if (/do you accept insurance/i.test(messageText)) {
      customBotMessage =
        "💳 Insurance & Payment:\n\n• We accept most major insurance plans\n• Call us to verify your coverage\n• We also offer payment plans\n• Contact us at (555) 123-4567 for details";
    } else if (/how much does a cleaning cost/i.test(messageText)) {
      customBotMessage =
        "💰 Pricing Information:\n\n• Regular Cleaning: $120\n• Deep Cleaning: $200\n• Exam & X-rays: $150\n\n*Prices may vary based on insurance coverage. Call us for a personalized quote!";
    } else if (/emergency/i.test(messageText)) {
      customBotMessage =
        "🚨 Emergency Care:\n\n• We offer emergency dental services\n• Call us immediately at (555) 123-4567\n• After hours: (555) 999-8888\n\nDon't wait - dental emergencies need immediate attention!";
    } else if (/contact|phone|call/i.test(messageText)) {
      customBotMessage =
        "📞 Contact Information:\n\n• Phone: (555) 123-4567\n• Address: 123 Main Street, City, State 12345\n• Email: info@abcdental.com\n\nWe're here to help!";
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
    const fallbackMessage = "I don't have specific information about that, but I can help you with:\n\n• Our services and treatments\n• Hours and appointments\n• Insurance and pricing\n• Contact information\n\nOr call us directly at (555) 123-4567 for personalized assistance!";
    
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
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          config: { client_id: 'demo-dental' },
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
        text: "I'm sorry, I'm having trouble connecting right now. Please check that the backend server is running at http://localhost:8001 or try again in a moment.",
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>

          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">Tier 1 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ABC Dental Office Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our basic FAQ chatbot in action. This Tier 1 chatbot provides essential information about hours, services, and insurance.
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
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-white">ABC Dental Office</CardTitle>
                      <CardDescription className="text-green-100">
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
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-sm'
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
                          <p className="text-xs text-gray-500 mt-2">Dental assistant is typing...</p>
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
                        placeholder="Ask about our services, hours, insurance..."
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
                    <p className="text-sm text-gray-600">123 Main Street, City, State 12345</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Hours:</p>
                    <p className="text-sm text-gray-600">Mon-Fri 8AM-5PM, Sat 9AM-2PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone:</p>
                    <p className="text-sm text-gray-600">(555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    Tier 1 Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Hours & Contact Info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Services Overview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Insurance Information</span>
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
                    <p>• Ask about office hours</p>
                    <p>• Inquire about dental services</p>
                    <p>• Check insurance acceptance</p>
                    <p>• Request appointment information</p>
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

export default DentalOfficeDemo;
