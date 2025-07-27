import { DollarSign, Brain, Shield, Search, BookOpen, AlertCircle, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import Header from '../../components/Header.tsx';
import Footer from '../../components/Footer.tsx';

const FinancialKnowledgeAssistant = () => {
  const queryExamples = [
    {
      question: "What are the current capital requirements for Tier 1 banks?",
      answer: "Under Basel III, Tier 1 capital requirements are set at 6% of risk-weighted assets, with an additional 2.5% capital conservation buffer, bringing the effective minimum to 8.5%.",
      source: "Basel III Framework, Section 4.2.1",
      confidence: 99.2
    },
    {
      question: "What's the maximum exposure limit for single counterparty risk?",
      answer: "The large exposure limit is generally 25% of eligible capital for a single counterparty or group of connected counterparties, as per EU CRR Article 395.",
      source: "EU Capital Requirements Regulation, Article 395",
      confidence: 97.8
    },
    {
      question: "How should we classify cryptocurrency holdings for regulatory reporting?",
      answer: "Cryptocurrency holdings should be classified as intangible assets under IFRS, with fair value measurement and specific disclosure requirements per the latest IASB guidance.",
      source: "IFRS Interpretation Committee, June 2023",
      confidence: 95.4
    }
  ];

  const knowledgeBase = [
    { category: 'Banking Regulations', documents: 1247, lastUpdated: '2 hours ago' },
    { category: 'Securities Law', documents: 892, lastUpdated: '4 hours ago' },
    { category: 'Tax Compliance', documents: 1156, lastUpdated: '1 hour ago' },
    { category: 'Risk Management', documents: 734, lastUpdated: '3 hours ago' },
    { category: 'Anti-Money Laundering', documents: 567, lastUpdated: '6 hours ago' },
    { category: 'International Standards', documents: 423, lastUpdated: '5 hours ago' }
  ];

  const complianceAlerts = [
    {
      type: 'Regulatory Update',
      title: 'New ESG Disclosure Requirements',
      description: 'Updated sustainability reporting standards effective Q1 2024',
      priority: 'high',
      deadline: '2024-01-15'
    },
    {
      type: 'Policy Change',
      title: 'Updated AML Transaction Thresholds',
      description: 'Revised suspicious transaction reporting limits',
      priority: 'medium',
      deadline: '2024-02-01'
    },
    {
      type: 'Compliance Check',
      title: 'Quarterly Risk Assessment Due',
      description: 'Submit Q4 operational risk assessment',
      priority: 'high',
      deadline: '2024-01-31'
    }
  ];

  const performanceMetrics = [
    { label: 'Query Accuracy', value: '99.2%', description: 'Validated against regulatory experts' },
    { label: 'Response Time', value: '0.8s', description: 'Average query processing time' },
    { label: 'Knowledge Base', value: '5,019', description: 'Regulatory documents indexed' },
    { label: 'Daily Queries', value: '247', description: 'Average queries processed per day' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial Knowledge Assistant
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Regulatory Intelligence </span>
                  & Compliance Assistant
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Navigate complex financial regulations with confidence. Our RAG-powered
                  assistant provides instant, accurate answers to compliance questions
                  from thousands of regulatory documents.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 text-lg">
                  Request Demo
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg">
                  View Case Study
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Regulatory Query Assistant</h3>
                    <Badge className="bg-green-100 text-green-700">Online</Badge>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Search className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Ask any regulatory question...</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-sm text-gray-700">
                        "What are the current Basel III capital requirements for systemically important banks?"
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">AI Response</span>
                    </div>
                    <div className="text-sm text-blue-700 mb-3">
                      "Systemically important banks must maintain a Common Equity Tier 1 (CET1) ratio of at least 7% plus a G-SIB buffer ranging from 1% to 3.5%, depending on their systemic importance score..."
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600">Source: Basel III Framework, Section 6.2</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">99.2% confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    Response generated in 0.8 seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Query Examples */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Regulatory Queries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI assistant provides accurate, source-backed answers to complex regulatory questions
            </p>
          </div>

          <div className="space-y-8">
            {queryExamples.map((example, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">Q</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{example.question}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-11 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-800">{example.answer}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Source: {example.source}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600">{example.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Regulatory Knowledge Base
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay current with thousands of regulatory documents and real-time compliance monitoring
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span>Knowledge Base Coverage</span>
                </CardTitle>
                <CardDescription>
                  Regulatory documents by category with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgeBase.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-600">{category.documents} documents</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-600">Updated {category.lastUpdated}</div>
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span>Compliance Alerts</span>
                </CardTitle>
                <CardDescription>
                  Important regulatory updates and compliance deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      alert.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          alert.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }>
                          {alert.type}
                        </Badge>
                        <div className="text-xs text-gray-600">Due: {alert.deadline}</div>
                      </div>
                      <div className="font-medium mb-1">{alert.title}</div>
                      <div className="text-sm text-gray-600">{alert.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Financial Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in compliance efficiency and accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle>99.2% Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Validated against regulatory experts, our AI provides highly accurate
                  answers to complex compliance questions with full source attribution.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Instant Compliance Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get immediate answers to regulatory questions instead of waiting
                  hours or days for legal team research and interpretation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle>5,000+ Documents Indexed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive coverage of financial regulations, updated in real-time
                  to ensure you always have access to the latest requirements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Streamline Your Compliance Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join financial institutions using AI to navigate complex regulations
            with confidence and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancialKnowledgeAssistant;
