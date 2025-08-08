import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  apiUrl: string;
  clientId: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  branding?: {
    name: string;
    logo?: string;
    description?: string;
  };
  quickReplies?: Array<{
    text: string;
    icon?: React.ComponentType<any>;
  }>;
  onMessageSend?: (message: string) => void;
  onMessageReceive?: (message: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  apiUrl,
  clientId,
  theme = {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  },
  branding = {
    name: 'AI Assistant',
    description: 'How can I help you today?'
  },
  quickReplies = [],
  onMessageSend,
  onMessageReceive
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! Welcome to ${branding.name}! I'm here to help you with information about our services, hours, and more. How can I assist you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    if (onMessageSend) {
      onMessageSend(messageText);
    }

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          config: { client_id: clientId }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I couldn\'t process your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (onMessageReceive) {
        onMessageReceive(botMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    <div
      className="flex flex-col h-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Chat Header */}
      <div
        className="px-6 py-4 text-white flex-shrink-0"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex items-center gap-3">
          {branding.logo && (
            <img src={branding.logo} alt="Logo" className="w-8 h-8 rounded-full" />
          )}
          <div>
            <h3 className="font-semibold">{branding.name}</h3>
            {branding.description && (
              <p className="text-sm opacity-90">{branding.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.isUser
                  ? 'text-white rounded-br-sm'
                  : 'border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}
              style={{
                backgroundColor: message.isUser ? theme.primaryColor : '#f9fafb'
              }}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">AI is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
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
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    '--tw-border-opacity': 1,
                    borderColor: `rgba(59, 130, 246, var(--tw-border-opacity))`
                  } as React.CSSProperties}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {reply.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex-shrink-0 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              '--tw-ring-color': theme.primaryColor,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-3 rounded-2xl hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ backgroundColor: theme.primaryColor, color: 'white' }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
