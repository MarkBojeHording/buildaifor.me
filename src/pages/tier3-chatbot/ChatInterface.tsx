import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Mic, Bot, User, Calendar, Mail, FileText } from 'lucide-react';
import io from 'socket.io-client';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:8003');
    setSocket(newSocket);

    newSocket.on('bot_response', (data) => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.message,
        actions: data.actions,
        timestamp: data.timestamp
      }]);
      setIsTyping(false);
    });

    // Add welcome message
    setMessages([{
      type: 'bot',
      content: "Hello! I'm your Advanced AI Assistant. I can help with customer inquiries, automate workflows, integrate with your CRM, and much more. What can I help you with today?",
      actions: [
        { type: 'crm', label: 'Check Customer Data', icon: User },
        { type: 'schedule', label: 'Schedule Meeting', icon: Calendar },
        { type: 'email', label: 'Send Email', icon: Mail }
      ]
    }]);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    socket?.emit('chat_message', { message: input, userId: 'demo_user' });
  };

  const executeAction = (action) => {
    setMessages(prev => [...prev, {
      type: 'system',
      content: `Executing: ${action.label}...`,
      timestamp: new Date()
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `✅ ${action.label} completed successfully! Task has been automated and relevant stakeholders have been notified.`,
        timestamp: new Date()
      }]);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-green-600">● Online - Advanced Mode</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : message.type === 'system'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{message.content}</p>

                  {/* Action Buttons */}
                  {message.actions && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => executeAction(action)}
                          className="flex items-center space-x-2 w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <action.icon className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="space-y-6">
        {/* Customer Context */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Customer Context</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium">Enterprise</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Contact</span>
              <span className="font-medium">2 days ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sentiment</span>
              <span className="text-green-600 font-medium">Positive</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Priority</span>
              <span className="text-orange-600 font-medium">High</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              📧 Send Follow-up Email
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              📅 Schedule Call
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              🎫 Create Support Ticket
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Active Workflows */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Active Workflows</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Customer Onboarding</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Follow-up Sequence</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Renewal Process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
