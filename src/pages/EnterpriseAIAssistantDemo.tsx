import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Workflow, BarChart3, Settings, Brain, Zap, Users, Bot, Shield, Globe, Cpu, Database, Cloud, Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

// Import the Tier 3 chatbot components
import ChatInterface from './tier3-chatbot/ChatInterface';
import WorkflowBuilder from './tier3-chatbot/WorkflowBuilder';
import Analytics from './tier3-chatbot/Analytics';
import MultiModal from './tier3-chatbot/MultiModal';

const EnterpriseAIAssistantDemo: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'AI Chat', icon: MessageSquare, component: ChatInterface },
    { id: 'workflow', name: 'Workflows', icon: Workflow, component: WorkflowBuilder },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, component: Analytics },
    { id: 'multimodal', name: 'Multi-Modal', icon: Settings, component: MultiModal }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            Back to Portfolio
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise AI Assistant Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Experience the future of enterprise automation with our advanced AI assistant platform. This comprehensive solution combines intelligent conversation management, workflow automation, real-time analytics, and multi-modal processing to transform how businesses operate and serve their customers.
            </p>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interactive Platform Demo
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore the Enterprise AI Assistant platform with full functionality. Switch between tabs to experience different aspects of the system.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Automated Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">3,892</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">96.8%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                    <p className="text-2xl font-bold text-gray-900">$847K</p>
                  </div>
                  <Workflow className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Component */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Enterprise-Grade AI Automation Platform
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced AI</h3>
                <p className="text-gray-600">State-of-the-art language models with enterprise-grade accuracy and contextual understanding</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Automation</h3>
                <p className="text-gray-600">Visual workflow builder with drag-and-drop automation for complex business processes</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Comprehensive dashboards with business impact metrics and performance insights</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Modal Processing</h3>
                <p className="text-gray-600">Support for documents, images, audio, and video with intelligent analysis</p>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Core Capabilities</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <Shield className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enterprise Security</h4>
                      <p className="text-gray-600">SOC 2 Type II compliant with end-to-end encryption and role-based access control</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Globe className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Global Scalability</h4>
                      <p className="text-gray-600">Multi-region deployment with 99.99% uptime SLA and automatic scaling</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Cpu className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI-Powered Intelligence</h4>
                      <p className="text-gray-600">Advanced NLP, sentiment analysis, and predictive analytics for business insights</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                      <Database className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Data Integration</h4>
                      <p className="text-gray-600">Seamless integration with CRM, ERP, and business intelligence platforms</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Increased Efficiency</h4>
                      <p className="text-gray-600">Automate 80% of repetitive tasks and reduce response times by 90%</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Users className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enhanced Customer Experience</h4>
                      <p className="text-gray-600">24/7 intelligent support with personalized interactions and proactive assistance</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Zap className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Cost Optimization</h4>
                      <p className="text-gray-600">Reduce operational costs by 60% while improving service quality</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                      <Lock className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Compliance & Governance</h4>
                      <p className="text-gray-600">Built-in compliance frameworks for GDPR, HIPAA, and industry regulations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EnterpriseAIAssistantDemo;
