import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Brain, Zap, Users, Clock, Download, MessageSquare, FileText, Plus, X, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://uqkzthavpupgpbusqhwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa3p0aGF2cHVwZ3BidXNxaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTM0MTgsImV4cCI6MjA2OTc4OTQxOH0.PKWpeC4dfdqUS25STLFEIzlwmW_ZDIyQ9ZezPcrnke8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced sample emails data with structured categories
const sampleEmails = {
  "urgent": [
    {
      "id": 1,
      "subject": "URGENT: System completely down - losing $10K/hour",
      "sender": "Sarah Johnson (CTO, TechCorp)",
      "preview": "Our entire platform has been down for 3 hours. Enterprise account ENT-4471...",
      "timestamp": "2 hours ago",
      "content": "URGENT: Our entire platform has been down for 3 hours. I'm Sarah Johnson, CTO at TechCorp (Account #ENT-4471, $4,200/month enterprise plan). This outage is costing us $10,000 per hour in lost revenue. We have 200+ users unable to access critical business functions. This is completely unacceptable for an enterprise customer. If not resolved within the next hour, we're activating our disaster recovery with your competitor. Need immediate escalation to your engineering leadership team."
    },
    {
      "id": 2,
      "subject": "CRITICAL: Data breach - customer PII exposed",
      "sender": "Michael Chen (CISO, DataSecure Inc)",
      "preview": "We discovered unauthorized access to customer data through your API...",
      "timestamp": "45 minutes ago",
      "content": "CRITICAL SECURITY INCIDENT: We discovered unauthorized access to customer PII data through your API integration. Account DS-8892. This affects 15,000+ customer records. We need immediate incident response, forensic analysis, and legal compliance support. This is a potential GDPR violation with massive financial implications. Need your security team and legal counsel involved immediately."
    }
  ],
  "billing": [
    {
      "id": 5,
      "subject": "Invoice discrepancy - charged $2,400 instead of $299",
      "sender": "Jennifer Martinez (CFO, StartupXYZ)",
      "preview": "Invoice #INV-2024-445 shows $2,400 but our plan should be $299/month...",
      "timestamp": "1 day ago",
      "content": "Hello, I received Invoice #INV-2024-445 for $2,400 but our Pro plan should only be $299/month. Account: SXZ-1123. This appears to be a significant billing error. Can you please review and provide a corrected invoice? We need this resolved before our monthly board meeting on Friday. Jennifer Martinez, CFO at StartupXYZ, jennifer@startupxyz.com"
    }
  ],
  "technical": [
    {
      "id": 10,
      "subject": "API integration returning 500 errors consistently",
      "sender": "Alex Thompson (Lead Developer, DevTools Inc)",
      "preview": "Our production API integration has been returning 500 errors for 2 hours...",
      "timestamp": "3 hours ago",
      "content": "Our production API integration has been returning 500 errors consistently for the past 2 hours. Account: DT-3344. This is affecting our customer-facing application and we're getting complaints. Error occurs on POST requests to /api/v2/data endpoint. We haven't changed anything on our end. Can your technical team investigate urgently? Alex Thompson, Lead Developer, alex@devtools.com"
    }
  ],
  "complaints": [
    {
      "id": 16,
      "subject": "Terrible customer service - considering cancellation",
      "sender": "Mark Williams (CEO, BusinessFlow)",
      "preview": "I've been trying to get support for 5 days with no real help...",
      "timestamp": "2 days ago",
      "content": "I've been trying to get support for 5 days and gotten nowhere. Ticket #78432. Your support team keeps asking me to restart my browser and clear cache - this is clearly a deeper technical issue. I'm the CEO of BusinessFlow (Account BF-9876, $1,200/month) and I'm seriously considering switching to your competitor. Your product is good but your support is terrible. Either escalate this properly or we're canceling. Mark Williams, CEO, mark@businessflow.com"
    }
  ],
  "general": [
    {
      "id": 21,
      "subject": "How to export data to CSV format?",
      "sender": "Emma Davis (Analyst, DataCorp)",
      "preview": "I need to export our monthly reports to CSV but can't find the option...",
      "timestamp": "1 day ago",
      "content": "Hi, I need to export our monthly reports to CSV format for our board presentation, but I can't find the export option in the dashboard. Account: DC-2211. Is this feature available in our Pro plan? If so, could you provide step-by-step instructions? Thanks, Emma Davis, Data Analyst, emma@datacorp.com"
    }
  ]
};

const EmailAnalyzerSupabase: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop();

  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analyzer');

  // Email analysis state
  const [selectedCategory, setSelectedCategory] = useState('urgent');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualEmail, setManualEmail] = useState({
    subject: '',
    sender: '',
    content: ''
  });

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');

  const categories = [
    { key: 'urgent', label: '🚨 Urgent', count: sampleEmails.urgent.length },
    { key: 'billing', label: '💰 Billing', count: sampleEmails.billing.length },
    { key: 'technical', label: '🔧 Technical', count: sampleEmails.technical.length },
    { key: 'complaints', label: '😠 Complaints', count: sampleEmails.complaints.length },
    { key: 'general', label: '📝 General', count: sampleEmails.general.length }
  ];

  // Authentication effects
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Email analysis functions
  const analyzeEmail = async (emailContent: string, subject: string, senderEmail: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/analyze-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body: emailContent,
          senderEmail,
          receivedAt: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAnalysis(result.analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze email');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEmailSelect = (email: any) => {
    setSelectedEmail(email);
    setAnalysis(null);
    setShowManualInput(false);
    analyzeEmail(email.content, email.subject, email.sender);
  };

  const handleManualEmailSubmit = () => {
    if (!manualEmail.content.trim()) {
      setError('Please enter email content to analyze.');
      return;
    }

    const emailToAnalyze = {
      id: 'manual-email',
      subject: manualEmail.subject || 'Manual Email Input',
      sender: manualEmail.sender || 'Unknown Sender',
      content: manualEmail.content,
      timestamp: new Date().toLocaleString(),
      preview: manualEmail.content.substring(0, 100) + '...'
    };

    setSelectedEmail(emailToAnalyze);
    setAnalysis(null);
    analyzeEmail(manualEmail.content, emailToAnalyze.subject, emailToAnalyze.sender);
  };

  // Analytics functions
  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/get-analytics?period=${analyticsPeriod}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load analytics');
      }

      setAnalytics(result.analytics);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [user, activeTab, analyticsPeriod]);

  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    const negativeSentiments = ['angry', 'frustrated', 'confused', 'negative'];
    return negativeSentiments.includes(sentiment.toLowerCase()) ? 'text-red-600' : 'text-green-600';
  };

  const filteredEmails = sampleEmails[selectedCategory as keyof typeof sampleEmails]?.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">AI Email Analyzer</h1>
            <p className="mt-2 text-gray-600">
              Intelligent customer support email analysis and routing
            </p>
          </div>
          <button
            onClick={signInAnonymously}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Demo (No Account Required)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to AI Solutions
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Email Analyzer (Supabase)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Production-ready AI-powered email analysis system with real-time analytics, database persistence, and enterprise features.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="flex justify-between items-center p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Email Analyzer Dashboard
                </h2>

                <div className="flex items-center space-x-4">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('analyzer')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'analyzer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Email Analyzer
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'analytics'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Analytics
                    </button>
                  </nav>

                  <button
                    onClick={signOut}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'analyzer' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
                {/* Left Side - Email Viewer */}
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Email Viewer
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowManualInput(!showManualInput)}
                        className="text-xs px-3 py-1 h-8"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {showManualInput ? 'Cancel' : 'New Email'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="h-full">
                    {/* Manual Email Input */}
                    {showManualInput && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-blue-900">Add New Email</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setManualEmail({ subject: '', sender: '', content: '' })}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                              <input
                                type="text"
                                value={manualEmail.subject}
                                onChange={(e) => setManualEmail({...manualEmail, subject: e.target.value})}
                                placeholder="Email subject..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
                              <input
                                type="text"
                                value={manualEmail.sender}
                                onChange={(e) => setManualEmail({...manualEmail, sender: e.target.value})}
                                placeholder="Sender email..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
                            <Textarea
                              value={manualEmail.content}
                              onChange={(e) => setManualEmail({...manualEmail, content: e.target.value})}
                              placeholder="Paste or type your email content here..."
                              className="w-full min-h-[120px] resize-none"
                              rows={5}
                            />
                          </div>

                          <div className="flex justify-end space-x-3">
                            <Button
                              variant="outline"
                              onClick={() => setManualEmail({ subject: '', sender: '', content: '' })}
                              size="sm"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleManualEmailSubmit}
                              disabled={!manualEmail.content.trim() || analyzing}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {analyzing ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Brain className="w-4 h-4 mr-2" />
                                  Analyze Email
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                      <TabsList className="grid w-full grid-cols-5">
                        {categories.map((category) => (
                          <TabsTrigger key={category.key} value={category.key} className="text-xs">
                            {category.label.split(' ')[1]}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {categories.map((category) => (
                        <TabsContent key={category.key} value={category.key} className="mt-4">
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Search emails..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <ScrollArea className="h-[500px] w-full border rounded-md p-4">
                            <div className="space-y-3">
                              {filteredEmails.map((email) => (
                                <div
                                  key={email.id}
                                  onClick={() => handleEmailSelect(email)}
                                  className={`p-4 rounded-md border transition-all duration-300 cursor-pointer ${
                                    selectedEmail?.id === email.id
                                      ? 'bg-blue-100 border-blue-300 shadow-md'
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 line-clamp-2">{email.subject}</h4>
                                    <span className="text-xs text-gray-500 ml-2">{email.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{email.sender}</p>
                                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{email.preview}</p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Right Side - AI Analysis Results */}
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        AI Analysis Results
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEmail(null);
                          setAnalysis(null);
                          setError(null);
                          setShowManualInput(false);
                        }}
                        className="text-xs px-3 py-1 h-8"
                      >
                        Clear Analysis
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col min-h-0 p-6">
                    {/* Analysis Content */}
                    <div className="flex-1 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-0">
                      <div className="flex-1 p-4 overflow-y-auto min-h-0">
                        {!selectedEmail ? (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-md">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="text-gray-600 font-medium mb-2">Ready to analyze emails</div>
                              <div className="text-sm text-gray-500">Select an email from the left panel or add a new one to see AI analysis results</div>
                            </div>
                          </div>
                        ) : analyzing ? (
                          <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm text-gray-600">AI is analyzing...</span>
                              </div>
                              <p className="text-sm text-gray-500">Processing: {selectedEmail.subject}</p>
                            </div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">{error}</p>
                          </div>
                        ) : analysis ? (
                          <div className="space-y-6">
                            {/* Priority Analysis */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                🚨 Priority Analysis
                              </h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className={`${getPriorityColor(analysis.priority_level)} text-white text-lg font-bold px-4 py-2 rounded-lg mb-2`}>
                                    {analysis.priority_level.toUpperCase()}
                                  </div>
                                  <p className="text-sm text-gray-600">Priority</p>
                                </div>
                                <div className="text-center">
                                  <div className="bg-gray-100 text-gray-800 text-lg font-bold px-4 py-2 rounded-lg mb-2">
                                    {analysis.urgency_score}/10
                                  </div>
                                  <p className="text-sm text-gray-600">Urgency</p>
                                </div>
                                <div className="text-center">
                                  <div className="bg-gray-100 text-gray-800 text-lg font-bold px-4 py-2 rounded-lg mb-2">
                                    {Math.round(analysis.analysis_confidence * 100)}%
                                  </div>
                                  <p className="text-sm text-gray-600">Confidence</p>
                                </div>
                              </div>
                            </div>

                            {/* Classification */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                📊 Classification
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
                                  <p className="text-lg">{analysis.primary_category}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Sentiment</h4>
                                  <p className={`text-lg font-semibold ${getSentimentColor(analysis.sentiment_label)}`}>
                                    {analysis.sentiment_label} (Score: {analysis.sentiment_score?.toFixed(2)})
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* AI Insights */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                🤖 AI Insights
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                                  <p className="text-gray-800">{analysis.summary}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Key Issues</h4>
                                  <ul className="list-disc list-inside text-gray-800">
                                    {analysis.key_issues?.map((issue: string, index: number) => (
                                      <li key={index}>{issue}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Recommended Department</h4>
                                  <p className="text-lg font-semibold text-blue-600">{analysis.recommended_department}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Suggested Response</h4>
                                  <p className="text-gray-800 italic">{analysis.suggested_response}</p>
                                </div>
                              </div>
                            </div>

                            {/* Processing Info */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                ⚙️ Processing Info
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Processing Time</h4>
                                  <p className="text-lg">{analysis.processing_time_ms}ms</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2">Model Version</h4>
                                  <p className="text-lg">{analysis.model_version}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Analytics Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                    <div className="flex items-center space-x-4">
                      <select
                        value={analyticsPeriod}
                        onChange={(e) => setAnalyticsPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                      </select>
                      <Button
                        onClick={loadAnalytics}
                        disabled={analyticsLoading}
                        size="sm"
                      >
                        {analyticsLoading ? 'Loading...' : 'Refresh'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Analytics Content */}
                {analyticsLoading ? (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                  </div>
                ) : analytics ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Summary Cards */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Emails</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.summary.totalEmails}</p>
                          </div>
                          <Mail className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">High Priority</p>
                            <p className="text-2xl font-bold text-red-600">{analytics.summary.highPriorityCount}</p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.summary.avgSentiment.toFixed(2)}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Processing Time</p>
                            <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.summary.avgProcessingTime)}ms</p>
                          </div>
                          <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No analytics data available</p>
                    <Button onClick={loadAnalytics} className="mt-4">
                      Load Analytics
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EmailAnalyzerSupabase;
