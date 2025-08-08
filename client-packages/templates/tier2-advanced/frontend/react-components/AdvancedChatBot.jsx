import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Calendar, FileText, User, TrendingUp, Clock, Phone, Mail } from 'lucide-react';

const AdvancedChatBot = ({
  apiUrl,
  clientId,
  theme = {
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  },
  branding = {
    name: 'AI Assistant',
    description: 'How can I help you today?'
  },
  features = {
    leadScoring: true,
    appointmentScheduling: true,
    fileUpload: true,
    crmIntegration: true
  }
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [leadScore, setLeadScore] = useState(0);
  const [leadQualification, setLeadQualification] = useState('cold');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [conversationStage, setConversationStage] = useState('initial');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize session
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);

    // Add welcome message
    setMessages([{
      id: '1',
      text: `Hi! Welcome to ${branding.name}! I'm here to help you with advanced assistance, lead qualification, and appointment scheduling. How can I assist you today?`,
      isUser: false,
      timestamp: new Date(),
      type: 'welcome'
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          client_id: clientId,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Update lead score and qualification
      if (data.lead_score !== undefined) {
        setLeadScore(data.lead_score);
        setLeadQualification(data.leadQualificationLevel || 'cold');
      }

      if (data.conversationStage) {
        setConversationStage(data.conversationStage);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        type: 'bot',
        aiData: data.aiData,
        leadScore: data.lead_score,
        intent: data.intent,
        confidence: data.confidence
      };

      setMessages(prev => [...prev, botMessage]);

      // Show lead capture for qualified leads
      if (data.lead_score >= 60 && !showLeadCapture) {
        setShowLeadCapture(true);
      }

      // Show appointment scheduler for hot leads
      if (data.lead_score >= 80 && !showAppointmentScheduler) {
        setShowAppointmentScheduler(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return '#dc2626'; // Red for hot
    if (score >= 60) return '#ea580c'; // Orange for warm
    return '#6b7280'; // Gray for cold
  };

  const getLeadScoreLabel = (score) => {
    if (score >= 80) return 'Hot Lead';
    if (score >= 60) return 'Warm Lead';
    return 'Cold Lead';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div
          className="px-6 py-4 text-white flex-shrink-0"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{branding.name}</h3>
                <p className="text-sm opacity-90">{branding.description}</p>
              </div>
            </div>

            {/* Lead Score Indicator */}
            {features.leadScoring && (
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">{leadScore}/100</div>
                  <div
                    className="text-xs"
                    style={{ color: getLeadScoreColor(leadScore) }}
                  >
                    {getLeadScoreLabel(leadScore)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

                {/* AI Data for bot messages */}
                {!message.isUser && message.aiData && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div>Intent: {message.intent}</div>
                      <div>Confidence: {Math.round(message.confidence * 100)}%</div>
                      {message.aiData.suggestedActions && (
                        <div className="mt-1">
                          <div className="font-medium">Suggested Actions:</div>
                          <ul className="list-disc list-inside text-xs">
                            {message.aiData.suggestedActions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs bg-gray-50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">AI is analyzing your message...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
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
              }}
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

      {/* Sidebar - Lead Information & Actions */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Lead Information */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Lead Information</h3>

          {/* Lead Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Lead Score</span>
              <span
                className="text-sm font-bold"
                style={{ color: getLeadScoreColor(leadScore) }}
              >
                {leadScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${leadScore}%`,
                  backgroundColor: getLeadScoreColor(leadScore)
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getLeadScoreLabel(leadScore)}
            </div>
          </div>

          {/* Conversation Stage */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Stage</div>
            <div className="text-sm text-gray-900 capitalize">{conversationStage}</div>
          </div>

          {/* Session Info */}
          <div className="text-xs text-gray-500">
            Session: {sessionId?.slice(-8)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>

          <div className="space-y-2">
            {features.appointmentScheduling && (
              <button
                onClick={() => setShowAppointmentScheduler(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule Appointment
              </button>
            )}

            {features.fileUpload && (
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Upload Documents
              </button>
            )}

            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </button>

            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        {/* Lead Capture Form */}
        {showLeadCapture && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Capture Lead</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Save Lead
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Lead score updated to {leadScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Conversation started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChatBot;
