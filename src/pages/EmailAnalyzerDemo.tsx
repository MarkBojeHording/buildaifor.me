import React, { useState } from 'react';
import { ArrowLeft, Mail, Brain, Zap, Users, Clock, Download, MessageSquare, FileText, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import axios from 'axios';

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
    },
    {
      "id": 3,
      "subject": "EMERGENCY: Production database corrupted - all data lost",
      "sender": "David Rodriguez (DevOps Lead, CloudScale)",
      "preview": "Our production database shows corruption and we can't access any data...",
      "timestamp": "1 hour ago",
      "content": "EMERGENCY: Our production database shows corruption and we can't access any customer data. Account CS-6677. This affects 50,000+ active users and our entire business operations. We need immediate database recovery support. Our backup system also appears to be compromised. This is a complete business continuity crisis. David Rodriguez, DevOps Lead, david@cloudscale.com"
    },
    {
      "id": 4,
      "subject": "URGENT: Payment processing down - customers can't pay",
      "sender": "Amanda Foster (COO, EcommercePro)",
      "preview": "Payment gateway integration is completely broken, customers getting errors...",
      "timestamp": "30 minutes ago",
      "content": "URGENT: Our payment gateway integration is completely broken. Customers are getting 'Payment Failed' errors on every transaction. Account EP-3344. This is our peak shopping season and we're losing thousands in sales every minute. Need immediate technical support to restore payment processing. Amanda Foster, COO, amanda@ecommercepro.com"
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
    },
    {
      "id": 6,
      "subject": "Payment failed - need to update card urgently",
      "sender": "Robert Kim (Operations, GrowthCorp)",
      "preview": "Our payment method failed and services are suspended. Account GC-5567...",
      "timestamp": "6 hours ago",
      "content": "Our payment method on file failed and I see our services are now suspended. Account: GC-5567. We need to update our credit card information immediately as this is affecting our operations. Can you please temporarily reinstate service while we update payment details? We're a 3-year customer and this is just a card expiration issue. Contact: robert.kim@growthcorp.com"
    },
    {
      "id": 7,
      "subject": "Double billing this month - need refund",
      "sender": "Thomas Wilson (Finance Manager, RetailChain)",
      "preview": "We were charged twice for our monthly subscription. Invoice #INV-2024-556...",
      "timestamp": "3 days ago",
      "content": "We noticed we were charged twice for our monthly subscription this month. Invoice #INV-2024-556 and #INV-2024-557 both show $899 charges. Account: RC-7788. This is clearly a duplicate charge. Can you please process a refund for the duplicate payment? Thomas Wilson, Finance Manager, thomas@retailchain.com"
    },
    {
      "id": 8,
      "subject": "Annual plan renewal - pricing increase concerns",
      "sender": "Rachel Green (VP Finance, MarketingAgency)",
      "preview": "Our annual plan is up for renewal but the price increased 40%...",
      "timestamp": "1 week ago",
      "content": "Our annual plan is up for renewal next month, but I see the price has increased from $12,000 to $16,800 (40% increase). Account: MA-4455. This is a significant jump with no advance notice. We're a 5-year customer and this increase is not sustainable for our budget. Can we discuss pricing options or grandfather our current rate? Rachel Green, VP Finance, rachel@marketingagency.com"
    },
    {
      "id": 9,
      "subject": "Pro-rated refund request - downgraded plan",
      "sender": "Kevin Lee (Operations Director, TechStartup)",
      "preview": "We downgraded from Enterprise to Pro plan mid-month. Need pro-rated refund...",
      "timestamp": "4 days ago",
      "content": "We downgraded from Enterprise ($2,500/month) to Pro ($299/month) plan on the 15th of this month. Account: TS-6677. According to your terms, we should receive a pro-rated refund for the unused portion of the Enterprise plan. Can you please process this refund? Kevin Lee, Operations Director, kevin@techstartup.com"
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
    },
    {
      "id": 11,
      "subject": "Dashboard loading extremely slowly - performance issue",
      "sender": "Lisa Park (Product Manager, AnalyticsPro)",
      "preview": "The main dashboard is taking 45+ seconds to load, making it unusable...",
      "timestamp": "5 hours ago",
      "content": "The main dashboard is taking 45+ seconds to load for all our users, making it essentially unusable. Account: AP-7789. This started yesterday around 3 PM EST. We have 50+ daily active users who depend on real-time data visualization. Is there a known performance issue? Our users are getting frustrated. Lisa Park, Product Manager, lisa@analyticspro.com"
    },
    {
      "id": 12,
      "subject": "SSO authentication not working with Azure AD",
      "sender": "Maria Garcia (IT Manager, EnterpriseCorp)",
      "preview": "Single Sign-On integration with Azure AD stopped working this morning...",
      "timestamp": "4 hours ago",
      "content": "Our Single Sign-On integration with Azure AD stopped working this morning. Account: EC-1122. Users are getting 'Authentication Failed' errors when trying to log in. We've verified our Azure AD configuration is correct and hasn't changed. This affects 200+ employees. Can your SSO team investigate? Maria Garcia, IT Manager, maria@enterprisecorp.com"
    },
    {
      "id": 13,
      "subject": "Webhook notifications not being received",
      "sender": "James Brown (Integration Specialist, DataFlow)",
      "preview": "Our webhook endpoint is not receiving notifications from your system...",
      "timestamp": "2 days ago",
      "content": "Our webhook endpoint (https://api.dataflow.com/webhooks/events) is not receiving notifications from your system. Account: DF-8899. We've verified our endpoint is working and can receive test webhooks. This is critical for our real-time data synchronization. Can you check if there are any issues with webhook delivery? James Brown, Integration Specialist, james@dataflow.com"
    },
    {
      "id": 14,
      "subject": "Mobile app crashes on iOS 17.2",
      "sender": "Sophie Chen (Mobile Developer, AppWorks)",
      "preview": "Your mobile app crashes immediately on iOS 17.2 devices...",
      "timestamp": "1 day ago",
      "content": "Your mobile app crashes immediately when launched on iOS 17.2 devices. Account: AW-3344. We've tested on multiple devices and the issue is consistent. This affects 30% of our users who recently updated to iOS 17.2. Can you please release a hotfix? Sophie Chen, Mobile Developer, sophie@appworks.com"
    },
    {
      "id": 15,
      "subject": "Data export feature missing from admin panel",
      "sender": "Daniel Miller (Data Analyst, InsightCorp)",
      "preview": "The data export feature mentioned in documentation is not available...",
      "timestamp": "3 days ago",
      "content": "According to your documentation, there should be a data export feature in the admin panel, but I can't find it. Account: IC-5566. We need to export our historical data for compliance reporting. Is this feature available in our current plan? If not, how can we access it? Daniel Miller, Data Analyst, daniel@insightcorp.com"
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
    },
    {
      "id": 17,
      "subject": "Feature promised 6 months ago still not delivered",
      "sender": "Patricia Johnson (Product Director, InnovationLabs)",
      "preview": "You promised the advanced reporting feature would be available by Q4...",
      "timestamp": "1 week ago",
      "content": "Your sales team promised us the advanced reporting feature would be available by Q4 2023. Account: IL-7788. It's now Q1 2024 and there's still no timeline. We made our purchasing decision based on this promise. This is unacceptable for a $5,000/month enterprise customer. Either deliver the feature or provide a significant discount. Patricia Johnson, Product Director, patricia@innovationlabs.com"
    },
    {
      "id": 18,
      "subject": "Constant downtime - service reliability issues",
      "sender": "Carlos Mendez (CTO, ReliableTech)",
      "preview": "We've experienced 12 hours of downtime this month alone...",
      "timestamp": "4 days ago",
      "content": "We've experienced 12 hours of downtime this month alone. Account: RT-4455. Your SLA promises 99.9% uptime but we're nowhere close. This is affecting our business operations and customer trust. We need a detailed explanation of what's causing these outages and a plan to prevent them. Carlos Mendez, CTO, carlos@reliabletech.com"
    },
    {
      "id": 19,
      "subject": "Security audit failed - compliance concerns",
      "sender": "Nina Patel (Compliance Officer, SecureBank)",
      "preview": "Our security audit found several compliance issues with your platform...",
      "timestamp": "2 weeks ago",
      "content": "Our annual security audit found several compliance issues with your platform. Account: SB-6677. The auditor flagged concerns about data encryption, access controls, and audit logging. As a financial institution, we have strict regulatory requirements. We need immediate remediation or we'll have to terminate our contract. Nina Patel, Compliance Officer, nina@securebank.com"
    },
    {
      "id": 20,
      "subject": "Unprofessional support staff - need escalation",
      "sender": "Frank Anderson (VP Operations, ServiceCorp)",
      "preview": "Your support representative was rude and unhelpful. Ticket #89234...",
      "timestamp": "3 days ago",
      "content": "Your support representative (Agent ID: 8472) was extremely rude and unhelpful during our call yesterday. Ticket #89234. Account: SC-8899. They refused to escalate our issue and hung up on us. This is completely unacceptable for a $3,000/month enterprise customer. We need immediate escalation to management and a formal apology. Frank Anderson, VP Operations, frank@servicecorp.com"
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
    },
    {
      "id": 22,
      "subject": "Request for feature: Dark mode theme",
      "sender": "Ryan Taylor (UX Designer, CreativeAgency)",
      "preview": "Would love to see a dark mode theme option for the dashboard...",
      "timestamp": "5 days ago",
      "content": "Hi team, I'd love to see a dark mode theme option for the dashboard. Account: CA-3344. Many of our team members work late hours and would appreciate this feature. Is this something you're planning to add? If so, any timeline? Thanks, Ryan Taylor, UX Designer, ryan@creativeagency.com"
    },
    {
      "id": 23,
      "subject": "Training session request for new team members",
      "sender": "Hannah Wilson (HR Manager, GrowthStartup)",
      "preview": "We have 5 new team members who need training on your platform...",
      "timestamp": "1 week ago",
      "content": "We have 5 new team members who need training on your platform. Account: GS-5566. Is there a way to schedule a group training session? We'd prefer a live session rather than just documentation. What options do you offer for customer training? Hannah Wilson, HR Manager, hannah@growthstartup.com"
    },
    {
      "id": 24,
      "subject": "Documentation update needed - API reference",
      "sender": "Lucas Rodriguez (Senior Developer, TechInnovation)",
      "preview": "The API documentation is missing several endpoints and examples...",
      "timestamp": "3 days ago",
      "content": "The API documentation is missing several endpoints and doesn't include enough code examples. Account: TI-7788. Specifically, the webhook configuration and user management endpoints need better documentation. Can you update the docs or provide additional examples? Lucas Rodriguez, Senior Developer, lucas@techinnovation.com"
    },
    {
      "id": 25,
      "subject": "Partnership inquiry - integration opportunities",
      "sender": "Zoe Kim (Business Development, PlatformCorp)",
      "preview": "We're interested in exploring partnership opportunities with your platform...",
      "timestamp": "2 weeks ago",
      "content": "We're interested in exploring partnership opportunities with your platform. Account: PC-1122. Our company provides complementary services and we see potential for integration. Could we schedule a call to discuss partnership possibilities? Zoe Kim, Business Development, zoe@platformcorp.com"
    },
    {
      "id": 26,
      "subject": "Feedback on new dashboard design",
      "sender": "Oliver Thompson (Product Manager, UserExperience)",
      "preview": "The new dashboard design is great! A few suggestions for improvement...",
      "timestamp": "4 days ago",
      "content": "The new dashboard design is great! Much cleaner and more intuitive. Account: UE-4455. A few suggestions: could you add the ability to customize widget sizes and add more chart types? Also, the mobile version could use some improvements. Overall, really happy with the update! Oliver Thompson, Product Manager, oliver@userexperience.com"
    },
    {
      "id": 27,
      "subject": "Account upgrade request - need more storage",
      "sender": "Isabella Martinez (Operations Manager, ContentCreator)",
      "preview": "We're approaching our storage limit and need to upgrade our plan...",
      "timestamp": "1 day ago",
      "content": "We're approaching our storage limit and need to upgrade our plan. Account: CC-6677. Currently on Pro plan with 100GB, need at least 500GB. What are our upgrade options and pricing? Also, can we get a trial of the higher tier before committing? Isabella Martinez, Operations Manager, isabella@contentcreator.com"
    },
    {
      "id": 28,
      "subject": "Holiday schedule - support availability",
      "sender": "William Davis (IT Director, GlobalCorp)",
      "preview": "What are your support hours during the upcoming holiday season?",
      "timestamp": "1 week ago",
      "content": "What are your support hours during the upcoming holiday season? Account: GC-8899. We need to plan our maintenance windows and want to ensure support is available if we encounter issues. Do you offer 24/7 support for enterprise customers during holidays? William Davis, IT Director, william@globalcorp.com"
    }
  ]
};

const EmailAnalyzerDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('urgent');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualEmail, setManualEmail] = useState({
    subject: '',
    sender: '',
    content: ''
  });

  const categories = [
    { key: 'urgent', label: '🚨 Urgent', count: sampleEmails.urgent.length },
    { key: 'billing', label: '💰 Billing', count: sampleEmails.billing.length },
    { key: 'technical', label: '🔧 Technical', count: sampleEmails.technical.length },
    { key: 'complaints', label: '😠 Complaints', count: sampleEmails.complaints.length },
    { key: 'general', label: '📝 General', count: sampleEmails.general.length }
  ];

  const analyzeEmail = async (emailContent) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `
Analyze this customer support email and return JSON:

Email: "${emailContent}"

Return this exact JSON structure:
{
  "urgency": "Critical|High|Medium|Low",
  "importance": "High|Medium|Low",
  "category": "Technical|Billing|Account|Feature Request|Complaint|General",
  "subcategory": "specific issue type",
  "sentiment": "Angry|Frustrated|Confused|Neutral|Happy",
  "churnRisk": "High|Medium|Low",
  "customerName": "extracted name or Unknown",
  "company": "extracted company or Unknown",
  "accountNumber": "extracted account/order number or None",
  "responseTime": "15 minutes|1 hour|4 hours|24 hours",
  "routeTo": "L1 Support|L2 Technical|Billing|Management|Engineering",
  "reasoning": "brief explanation of classification",
  "confidence": 85
}`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = JSON.parse(response.data.choices[0].message.content);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze email. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    setAnalysis(null); // Clear previous analysis
    setShowManualInput(false); // Hide manual input
    analyzeEmail(email.content);
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
    analyzeEmail(manualEmail.content);
  };

  const resetManualInput = () => {
    setManualEmail({ subject: '', sender: '', content: '' });
    setShowManualInput(false);
    setError(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment) => {
    const negativeSentiments = ['angry', 'frustrated', 'confused'];
    return negativeSentiments.includes(sentiment.toLowerCase()) ? 'text-red-600' : 'text-green-600';
  };

  const filteredEmails = sampleEmails[selectedCategory]?.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Email Analyzer Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our advanced AI-powered email analysis system with intelligent priority detection and customer sentiment analysis. This system provides sophisticated customer support email understanding, automatic routing, and actionable insights for improved response times and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
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
                                  {analysis.urgency.toUpperCase()}
                                </div>
                                <p className="text-sm text-gray-600">Urgency</p>
                              </div>
                              <div className="text-center">
                                <div className={`${getPriorityColor(analysis.importance)} text-white text-lg font-bold px-4 py-2 rounded-lg mb-2`}>
                                  {analysis.importance.toUpperCase()}
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
                                <p className="text-lg">{analysis.category} → {analysis.subcategory}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Sentiment</h4>
                                <p className={`text-lg font-semibold ${getSentimentColor(analysis.sentiment)}`}>
                                  {analysis.sentiment} (Churn Risk: {analysis.churnRisk})
                                </p>
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
                        </div>
                      ) : null}
                    </div>
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

export default EmailAnalyzerDemo;
