
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock, Users, Dumbbell, Calendar } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! Welcome to Peak Fitness Studio! 💪 I'm here to help you with information about our classes, memberships, trainers, and more. How can I assist you today?",
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
    { text: "Show me class schedule", icon: Calendar },
    { text: "Membership pricing", icon: Users },
    { text: "Personal training info", icon: Dumbbell }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          config: { client_id: 'peak-fitness' },
          ...(conversationId && { conversation_id: conversationId })
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ChatResponse = await response.json();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Peak Fitness Studio</h1>
            <p className="text-blue-100 text-sm">Chat with our fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Studio Info Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium">
            📍 789 Fitness Blvd, Suite 200 | 📞 (555) 345-6789 |
            🕐 Mon-Fri 5AM-10PM, Weekends 6AM-8PM
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-200px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Assistant is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => {
              const IconComponent = reply.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply.text)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  <IconComponent className="w-4 h-4" />
                  {reply.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about classes, memberships, trainers..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Peak Fitness Studio Chatbot • Powered by AI • For immediate assistance call (555) 345-6789
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
