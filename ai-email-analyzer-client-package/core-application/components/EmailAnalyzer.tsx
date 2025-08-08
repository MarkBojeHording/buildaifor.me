import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Brain, Zap, Users, Clock, Download, MessageSquare, FileText, Plus, X, Search, Filter, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { EmailAnalysisAPI } from '../utils/emailAnalysisAPI';
import { sampleEmails } from '../data/sampleEmails';
import { EmailAnalysisResult, EmailData } from '../types/emailTypes';

interface EmailAnalyzerProps {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  customBranding?: {
    companyName?: string;
    logo?: string;
    primaryColor?: string;
  };
}

const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({
  supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  customBranding = {}
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('urgent');
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [analysis, setAnalysis] = useState<EmailAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [manualEmail, setManualEmail] = useState({
    subject: '',
    sender: '',
    content: ''
  });

  const emailAPI = new EmailAnalysisAPI(supabaseUrl, supabaseAnonKey);

  const categories = [
    { key: 'urgent', label: '🚨 Urgent', count: sampleEmails.urgent.length, color: 'text-red-600' },
    { key: 'billing', label: '💰 Billing', count: sampleEmails.billing.length, color: 'text-orange-600' },
    { key: 'technical', label: '🔧 Technical', count: sampleEmails.technical.length, color: 'text-blue-600' },
    { key: 'complaints', label: '😠 Complaints', count: sampleEmails.complaints.length, color: 'text-purple-600' },
    { key: 'general', label: '📝 General', count: sampleEmails.general.length, color: 'text-green-600' }
  ];

  const analyzeEmail = async (emailContent: string, emailSubject?: string, senderEmail?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await emailAPI.analyzeEmail({
        subject: emailSubject || 'Email Analysis',
        body: emailContent,
        senderEmail: senderEmail || 'user@example.com',
        receivedAt: new Date().toISOString()
      });

      if (result.success) {
        setAnalysis(result.analysis);
        // Load analytics after successful analysis
        loadAnalytics();
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Failed to analyze email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await emailAPI.getAnalytics('7d');
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  };

  const handleEmailSelect = (email: EmailData) => {
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

    const emailToAnalyze: EmailData = {
      id: 'manual-email',
      subject: manualEmail.subject || 'Manual Email Input',
      sender: manualEmail.sender || 'Unknown Sender',
      content: manualEmail.content,
      timestamp: new Date().toLocaleString(),
      preview: manualEmail.content.substring(0, 100) + '...'
    };

    setSelectedEmail(emailToAnalyze);
    setAnalysis(null);
    analyzeEmail(manualEmail.content, manualEmail.subject, manualEmail.sender);
  };

  const resetManualInput = () => {
    setManualEmail({ subject: '', sender: '', content: '' });
    setShowManualInput(false);
    setError(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    const negativeSentiments = ['angry', 'frustrated', 'confused', 'negative'];
    return negativeSentiments.includes(sentiment.toLowerCase()) ? 'text-red-600' : 'text-green-600';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return '✅';
      default: return '📧';
    }
  };

  const filteredEmails = sampleEmails[selectedCategory as keyof typeof sampleEmails]?.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    // Load initial analytics
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {customBranding.companyName || 'AI Email Analyzer'}
                </h1>
                <p className="text-sm text-gray-600">Customer Support Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
            {/* Left Side - Email Viewer */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Email Viewer
                  </CardTitle>
                  <div className="flex items-center space-x-2">
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
                        onClick={resetManualInput}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                          <Input
                            value={manualEmail.subject}
                            onChange={(e) => setManualEmail({...manualEmail, subject: e.target.value})}
                            placeholder="Email subject..."
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
                          <Input
                            value={manualEmail.sender}
                            onChange={(e) => setManualEmail({...manualEmail, sender: e.target.value})}
                            placeholder="Sender email..."
                            className="text-sm"
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
                          onClick={resetManualInput}
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleManualEmailSubmit}
                          disabled={!manualEmail.content.trim() || loading}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? (
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
                      <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Search emails..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 text-sm"
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
                    ) : loading ? (
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
                              <div className={`${getPriorityColor(analysis.urgency)} text-white text-lg font-bold px-4 py-2 rounded-lg mb-2`}>
                                {getPriorityIcon(analysis.urgency)} {analysis.urgency.toUpperCase()}
                              </div>
                              <p className="text-sm text-gray-600">Urgency</p>
                            </div>
                            <div className="text-center">
                              <div className={`${getPriorityColor(analysis.importance)} text-white text-lg font-bold px-4 py-2 rounded-lg mb-2`}>
                                {getPriorityIcon(analysis.importance)} {analysis.importance.toUpperCase()}
                              </div>
                              <p className="text-sm text-gray-600">Importance</p>
                            </div>
                            <div className="text-center">
                              <div className="bg-gray-100 text-gray-800 text-lg font-bold px-4 py-2 rounded-lg mb-2">
                                {analysis.confidence}%
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
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{analysis.category}</Badge>
                                <span className="text-gray-500">→</span>
                                <Badge variant="outline">{analysis.subcategory}</Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">Sentiment</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`text-lg font-semibold ${getSentimentColor(analysis.sentiment)}`}>
                                  {analysis.sentiment}
                                </span>
                                <Badge variant={analysis.churnRisk === 'High' ? 'destructive' : 'secondary'}>
                                  Churn Risk: {analysis.churnRisk}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Customer Profile */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            👤 Customer Profile
                          </h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                              <p className="text-lg">Name: {analysis.customerName}</p>
                              <p className="text-lg">Company: {analysis.company}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">Account Details</h4>
                              <p className="text-lg">Account: {analysis.accountNumber}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            ⚡ Action Items
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Response Time</h4>
                                <p className="text-lg font-semibold text-blue-600">{analysis.responseTime}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Route To</h4>
                                <p className="text-lg font-semibold text-green-600">{analysis.routeTo}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">AI Reasoning</h4>
                              <p className="text-gray-800">{analysis.reasoning}</p>
                            </div>
                          </div>
                        </div>

                        {/* Analytics Summary */}
                        {analytics && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              📈 Analytics Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{analytics.summary?.totalEmails || 0}</div>
                                <p className="text-sm text-gray-600">Total Emails</p>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{analytics.summary?.highPriorityCount || 0}</div>
                                <p className="text-sm text-gray-600">High Priority</p>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{analytics.summary?.avgProcessingTime || 0}ms</div>
                                <p className="text-sm text-gray-600">Avg Processing</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailAnalyzer;
