import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Send, Loader2, Brain, Target, TrendingUp, Scale, Clock, User, MessageSquare, DollarSign, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { getApiUrl } from '@/config/api';
import { useScrollToTop } from '../hooks/useScrollToTop';

// Function to format response text with markdown support
function formatResponse(text: string | undefined | null) {
  if (!text || typeof text !== 'string') {
    return 'No response received';
  }
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert *italic* to <em>
    .replace(/\n/g, '<br>'); // Convert newlines to <br>
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  aiData?: {
    leadScore?: number;
    leadReasoning?: string;
    detectedIntent?: string;
    confidence?: number;
    caseAssessment?: string;
    caseScore?: number;
    attorneyMatch?: string;
    escalationNeeded?: boolean;
  };
}

interface ProcessingLog {
  id: string;
  message: string;
  type: 'normal' | 'processing' | 'complete' | 'error';
  timestamp: Date;
}

const LawFirmDemo: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI legal assistant. I can help assess your case and connect you with the right attorney. What legal matter can I help you with today?",
      sender: 'bot',
      timestamp: new Date(),
      aiData: {
        leadScore: 0,
        detectedIntent: 'GENERAL_INFO',
        caseAssessment: 'Not assessed'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [processingLog, setProcessingLog] = useState<ProcessingLog[]>([
    {
      id: '1',
      message: 'System ready - waiting for input',
      type: 'normal',
      timestamp: new Date()
    }
  ]);

  // Dashboard state
  const [currentLeadScore, setCurrentLeadScore] = useState(0);
  const [currentIntent, setCurrentIntent] = useState('GENERAL_INFO');
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [currentCaseAssessment, setCurrentCaseAssessment] = useState('Not assessed');
  const [currentCaseScore, setCurrentCaseScore] = useState(0);
  const [currentAttorneyMatch, setCurrentAttorneyMatch] = useState('No match yet');
  const [revenuePotential, setRevenuePotential] = useState('$0');
  const [priorityLevel, setPriorityLevel] = useState('STANDARD');
  const [actionRequired, setActionRequired] = useState('Monitor conversation');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addLogEntry = (message: string, type: ProcessingLog['type'] = 'normal') => {
    const newEntry: ProcessingLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date()
    };
    setProcessingLog(prev => [...prev.slice(-9), newEntry]); // Keep last 10 entries
  };

  const updateDashboard = (aiData: any, responseData: any) => {
    console.log('🔄 Updating dashboard with AI data:', aiData, 'Response data:', responseData);

    // Update Lead Score (check both aiData and top-level response)
    const leadScore = responseData?.lead_score || aiData?.lead_score;
    if (leadScore !== undefined) {
      setCurrentLeadScore(leadScore);
      const reasoning = aiData?.reasoning;
      if (reasoning) {
        addLogEntry(`Lead Score: ${leadScore}/100 - ${reasoning}`);
      }
    }

    // Update Intent Detection (check both aiData and top-level response)
    const intent = responseData?.intent || aiData?.detected_intent;
    if (intent) {
      setCurrentIntent(intent);
      const confidence = responseData?.confidence || aiData?.intent_confidence;
      if (confidence) {
        setCurrentConfidence(confidence);
        addLogEntry(`Intent: ${intent} (${Math.round(confidence * 100)}% confidence)`);
      }
    }

    // Update Case Assessment
    if (aiData?.case_strength) {
      setCurrentCaseAssessment(aiData.case_strength);
      if (leadScore) {
        setCurrentCaseScore(leadScore);
        addLogEntry(`Case Assessment: ${aiData.case_strength} (Score: ${leadScore}/100)`);
      }
    }

    // Update Attorney Matching
    if (aiData?.attorney_match) {
      setCurrentAttorneyMatch(aiData.attorney_match);
      addLogEntry(`Attorney Match: ${aiData.attorney_match}`);
    }

    // Update Business Intelligence
    updateBusinessMetrics(leadScore || 0);

    // Add a visual update indicator
    addLogEntry('🎯 Dashboard updated with latest AI analysis', 'complete');
  };

  const updateBusinessMetrics = (leadScore: number) => {
    let revenue = '$0';
    let priority = 'STANDARD';
    let action = 'Monitor conversation';

    if (leadScore >= 80) {
      revenue = '$50,000 - $150,000';
      priority = 'HIGH VALUE';
      action = 'Route to senior attorney immediately';
      addLogEntry('🚨 HIGH VALUE LEAD DETECTED - Immediate attention required', 'complete');
    } else if (leadScore >= 60) {
      revenue = '$10,000 - $50,000';
      priority = 'MEDIUM';
      action = 'Schedule consultation';
      addLogEntry('📋 Medium-value lead - Schedule consultation', 'complete');
    } else if (leadScore >= 40) {
      revenue = '$5,000 - $20,000';
      priority = 'STANDARD';
      action = 'Continue qualification';
    }

    setRevenuePotential(revenue);
    setPriorityLevel(priority);
    setActionRequired(action);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    addLogEntry('Processing user message...', 'processing');

    try {
      const response = await fetch(`${getApiUrl('tier2')}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          client_id: 'law-firm-demo',
          ...(conversationId && { session_id: conversationId })
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsLoading(false);

      console.log('📡 API Response received:', data);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        aiData: {
          leadScore: data.lead_score || data.aiData?.lead_score,
          leadReasoning: data.aiData?.reasoning,
          detectedIntent: data.intent || data.aiData?.detected_intent,
          confidence: data.confidence || data.aiData?.intent_confidence,
          caseAssessment: data.aiData?.case_strength,
          caseScore: data.lead_score || data.aiData?.lead_score,
          attorneyMatch: data.aiData?.attorney_match,
          escalationNeeded: data.aiData?.escalation_needed
        }
      };

      setMessages(prev => [...prev, botMessage]);
      updateDashboard(data.aiData, data);
      addLogEntry('Analysis complete', 'complete');

      if (!conversationId) {
        setConversationId(Date.now().toString());
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      addLogEntry('Error: Connection failed', 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetDemo = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm your AI legal assistant. I can help assess your case and connect you with the right attorney. What legal matter can I help you with today?",
      sender: 'bot',
      timestamp: new Date(),
      aiData: {
        leadScore: 0,
        detectedIntent: 'GENERAL_INFO',
        caseAssessment: 'Not assessed'
      }
    }]);
    setCurrentLeadScore(0);
    setCurrentIntent('GENERAL_INFO');
    setCurrentConfidence(0);
    setCurrentCaseAssessment('Not assessed');
    setCurrentCaseScore(0);
    setCurrentAttorneyMatch('No match yet');
    setRevenuePotential('$0');
    setPriorityLevel('STANDARD');
    setActionRequired('Monitor conversation');
    setProcessingLog([{
      id: '1',
      message: 'System ready - waiting for input',
      type: 'normal',
      timestamp: new Date()
    }]);
  };

  const loadSampleConversation = () => {
    resetDemo();

    setTimeout(() => {
      const sampleMessage = "I was in a car accident with a drunk driver. The other driver hit me from behind and I have neck pain and missed work.";
      setInputValue(sampleMessage);

      setTimeout(() => {
        sendMessage();
      }, 500);
    }, 1000);
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCaseStrengthColor = (strength: string) => {
    switch (strength?.toLowerCase()) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIntentColor = (intent: string) => {
    const colors: { [key: string]: string } = {
      'URGENT_MATTER': 'bg-red-500',
      'INJURY_DETAILS': 'bg-orange-500',
      'CONSULTATION_REQUEST': 'bg-blue-500',
      'CASE_INQUIRY': 'bg-purple-500',
      'FEE_QUESTIONS': 'bg-green-500',
      'GENERAL_INFO': 'bg-gray-500'
    };
    return colors[intent] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH VALUE': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-4">Tier 2 Demo</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Justice Partners Law Firm Chatbot Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our enhanced AI-powered legal assistant. This Tier 2 chatbot provides case assessment, lead scoring, attorney matching, and intelligent legal consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Split Screen Layout */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">

          {/* LEFT SIDE: Customer Experience */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">👤 Customer Experience</h3>
                <Badge variant="secondary">What your clients see</Badge>
              </div>
            </div>

            <div className="flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white px-6 py-4 text-center">
                <h4 className="text-xl font-semibold">⚖️ Justice Partners Law Firm</h4>
                <p className="text-blue-100">AI Legal Consultation</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatResponse(message.text) }}
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">AI is analyzing your case...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Integrated into chat interface */}
              <div className="border rounded-md p-4 bg-gray-50 mx-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your legal situation..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-4"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: AI Intelligence Dashboard */}
          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">🤖 AI Intelligence Dashboard</h3>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">What law firms get</Badge>
              </div>
            </div>

            <div className="p-4 space-y-4 h-[600px] overflow-y-auto">

              {/* Lead Qualification Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Lead Qualification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{currentLeadScore}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getLeadScoreColor(currentLeadScore)}`}
                        style={{ width: `${currentLeadScore}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intent Analysis Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Intent Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge className={`${getIntentColor(currentIntent)} text-white`}>
                      {currentIntent.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {Math.round(currentConfidence * 100)}% confidence
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Case Assessment Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Case Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Strength:</span>
                    <Badge className={`${getCaseStrengthColor(currentCaseAssessment)} text-white`}>
                      {currentCaseAssessment}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {currentCaseScore}/100
                  </div>
                </CardContent>
              </Card>

              {/* Attorney Matching Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Attorney Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{currentAttorneyMatch}</div>
                    <div className="text-sm text-gray-600">Recommended based on case analysis</div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Intelligence Section */}
              <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue Potential:</span>
                    <span className="font-semibold text-green-600">{revenuePotential}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Priority Level:</span>
                    <Badge className={getPriorityColor(priorityLevel)}>
                      {priorityLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Action Required:</span>
                    <span className="text-sm font-medium text-gray-900">{actionRequired}</span>
                  </div>
                </CardContent>
              </Card>

              {/* AI Processing Log */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Processing Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {processingLog.map((entry) => (
                      <div key={entry.id} className={`text-xs font-mono ${
                        entry.type === 'processing' ? 'text-blue-600' :
                        entry.type === 'complete' ? 'text-green-600' :
                        entry.type === 'error' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {entry.timestamp.toLocaleTimeString()}: {entry.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-6 text-center space-x-4">
          <Button onClick={resetDemo} variant="outline">
            Reset Demo
          </Button>
          <Button onClick={loadSampleConversation} className="bg-blue-600 hover:bg-blue-700">
            Load Sample Conversation
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LawFirmDemo;
