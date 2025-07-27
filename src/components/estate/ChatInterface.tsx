import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Home, TrendingUp, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Message, ChatResponse, PropertyReference, PropertySource } from '../../types/index.ts';
import { apiClient } from '../../api/client.ts';

interface ChatInterfaceProps {
  onEscalate: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEscalate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI real estate assistant. I can help you with property searches, market analysis, and answer questions about real estate. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      confidence: 0.95,
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiClient.sendMessage(inputMessage);
      const chatResponse = response as ChatResponse;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: chatResponse.message,
        sender: 'ai',
        timestamp: new Date(),
        confidence: chatResponse.confidence,
        sources: chatResponse.sources,
        propertyReferences: chatResponse.propertyReferences,
      };

      setMessages(prev => [...prev, aiMessage]);

      if (chatResponse.needsEscalation) {
        onEscalate();
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team.',
        sender: 'ai',
        timestamp: new Date(),
        confidence: 0,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircle;
    if (confidence >= 0.6) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Real Estate Assistant</h2>
            <p className="text-blue-100 text-sm">Powered by AI • Market Expert</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end space-x-3">
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.sender === 'ai' && message.confidence !== undefined && (
                    <div className="mt-2 flex items-center space-x-2 text-sm">
                      {React.createElement(getConfidenceIcon(message.confidence), {
                        className: `w-4 h-4 ${getConfidenceColor(message.confidence)}`
                      })}
                      <span className={getConfidenceColor(message.confidence)}>
                        Confidence: {Math.round(message.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Property References */}
              {message.propertyReferences && message.propertyReferences.length > 0 && (
                <div className="mt-3 ml-11 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    Related Properties
                  </h4>
                  {message.propertyReferences.map((property) => (
                    <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{property.address}</p>
                          <p className="text-sm text-gray-600">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft.toLocaleString()} sqft
                          </p>
                          <p className="text-xs text-gray-500 mt-1">MLS# {property.mlsId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            property.status === 'Active' ? 'bg-green-100 text-green-800' :
                            property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 ml-11">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Sources</h4>
                  <div className="space-y-1">
                    {message.sources.map((source) => (
                      <div key={source.id} className="flex items-center space-x-2 text-sm text-gray-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>{source.title}</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{source.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-1 ml-11 text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about properties, market conditions, or real estate advice..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
