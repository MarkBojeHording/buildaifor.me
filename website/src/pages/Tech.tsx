import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  MessageSquare,
  Database,
  FileText,
  BarChart3,
  Plug,
  ArrowRight,
  Cpu,
  Eye,
  Code,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Layers
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Tech = () => {
  const [activeSection, setActiveSection] = useState('ai-fundamentals');

  const sections = [
    { id: 'ai-fundamentals', label: 'AI Fundamentals', icon: Brain },
    { id: 'chatbots', label: 'Chatbot Technologies', icon: MessageSquare },
    { id: 'rag', label: 'RAG Systems', icon: Database },
    { id: 'document-processing', label: 'Document Processing', icon: FileText },
    { id: 'business-intelligence', label: 'Business Intelligence', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations & APIs', icon: Plug }
  ];

  const aiFundamentals = [
    {
      title: 'What is Artificial Intelligence?',
      description: 'AI is the simulation of human intelligence in machines, enabling them to learn, reason, and make decisions.',
      icon: Brain,
      features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Robotics']
    },
    {
      title: 'Machine Learning vs Deep Learning',
      description: 'Machine learning uses algorithms to learn from data, while deep learning uses neural networks with multiple layers.',
      icon: Cpu,
      features: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Feature Engineering']
    },
    {
      title: 'Natural Language Processing (NLP)',
      description: 'NLP enables computers to understand, interpret, and generate human language naturally.',
      icon: MessageSquare,
      features: ['Text Analysis', 'Language Generation', 'Sentiment Analysis', 'Translation']
    },
    {
      title: 'Computer Vision',
      description: 'Computer vision allows machines to interpret and understand visual information from the world.',
      icon: Eye,
      features: ['Image Recognition', 'Object Detection', 'Facial Recognition', 'Video Analysis']
    }
  ];

  const chatbotTechnologies = [
    {
      title: 'Rule-based vs AI-powered Chatbots',
      description: 'Rule-based chatbots follow predefined scripts, while AI-powered chatbots learn and adapt from conversations.',
      icon: Code,
      features: ['Predefined Responses', 'Natural Conversations', 'Learning Capability', 'Context Awareness']
    },
    {
      title: 'GPT and Large Language Models',
      description: 'GPT (Generative Pre-trained Transformer) models can understand and generate human-like text.',
      icon: Brain,
      features: ['Text Generation', 'Conversation', 'Code Generation', 'Translation']
    },
    {
      title: 'Conversational AI',
      description: 'Advanced AI systems that can engage in natural, context-aware conversations with users.',
      icon: MessageSquare,
      features: ['Context Memory', 'Intent Recognition', 'Entity Extraction', 'Multi-turn Dialogues']
    },
    {
      title: 'Chatbot Architecture',
      description: 'The technical foundation that powers modern chatbot systems and their capabilities.',
      icon: Layers,
      features: ['Frontend Interface', 'Backend Processing', 'AI Models', 'Integration Layer']
    }
  ];

  const ragSystems = [
    {
      title: 'What is RAG?',
      description: 'Retrieval-Augmented Generation combines information retrieval with text generation for accurate, up-to-date responses.',
      icon: Database,
      features: ['Information Retrieval', 'Text Generation', 'Knowledge Base', 'Real-time Updates']
    },
    {
      title: 'How RAG Works',
      description: 'RAG systems retrieve relevant information from a knowledge base and use it to generate accurate responses.',
      icon: Zap,
      features: ['Query Processing', 'Vector Search', 'Context Retrieval', 'Response Generation']
    },
    {
      title: 'Vector Databases and Embeddings',
      description: 'Vector databases store and search through high-dimensional representations of text for semantic similarity.',
      icon: Target,
      features: ['Semantic Search', 'Similarity Matching', 'Scalable Storage', 'Fast Retrieval']
    },
    {
      title: 'Benefits over Traditional Chatbots',
      description: 'RAG systems provide more accurate, up-to-date, and contextually relevant responses than traditional chatbots.',
      icon: TrendingUp,
      features: ['Higher Accuracy', 'Current Information', 'Source Attribution', 'Custom Knowledge']
    }
  ];

  const documentProcessing = [
    {
      title: 'OCR (Optical Character Recognition)',
      description: 'OCR technology converts images of text into machine-readable text data.',
      icon: Eye,
      features: ['Text Extraction', 'Image Processing', 'Multi-language Support', 'Accuracy Optimization']
    },
    {
      title: 'Document Classification',
      description: 'AI systems that automatically categorize and organize documents based on their content and structure.',
      icon: FileText,
      features: ['Content Analysis', 'Category Prediction', 'Metadata Extraction', 'Automated Sorting']
    },
    {
      title: 'Data Extraction',
      description: 'Intelligent systems that extract specific information from documents with high accuracy.',
      icon: Database,
      features: ['Field Extraction', 'Table Recognition', 'Form Processing', 'Data Validation']
    },
    {
      title: 'Workflow Automation',
      description: 'Automated processes that streamline document handling and business workflows.',
      icon: Zap,
      features: ['Process Automation', 'Approval Workflows', 'Integration', 'Monitoring']
    }
  ];

  const businessIntelligence = [
    {
      title: 'Data Visualization',
      description: 'Interactive charts and dashboards that make complex data easy to understand and analyze.',
      icon: BarChart3,
      features: ['Interactive Charts', 'Real-time Dashboards', 'Custom Reports', 'Mobile Access']
    },
    {
      title: 'Predictive Analytics',
      description: 'AI-powered forecasting that helps businesses make data-driven decisions about the future.',
      icon: TrendingUp,
      features: ['Trend Analysis', 'Forecasting Models', 'Risk Assessment', 'Scenario Planning']
    },
    {
      title: 'Real-time Dashboards',
      description: 'Live monitoring systems that provide instant insights into business performance and metrics.',
      icon: Globe,
      features: ['Live Data', 'KPI Monitoring', 'Alert Systems', 'Performance Tracking']
    },
    {
      title: 'AI-driven Insights',
      description: 'Advanced analytics that uncover hidden patterns and provide actionable business intelligence.',
      icon: Brain,
      features: ['Pattern Recognition', 'Anomaly Detection', 'Recommendations', 'Automated Insights']
    }
  ];

  const integrations = [
    {
      title: 'REST APIs',
      description: 'Standardized interfaces that allow different systems to communicate and exchange data.',
      icon: Plug,
      features: ['HTTP Methods', 'JSON Data', 'Authentication', 'Rate Limiting']
    },
    {
      title: 'Webhooks',
      description: 'Real-time communication between systems that trigger actions based on events.',
      icon: Zap,
      features: ['Event-driven', 'Real-time Updates', 'Custom Triggers', 'Reliable Delivery']
    },
    {
      title: 'Third-party Integrations',
      description: 'Connections to popular business tools and platforms for seamless data flow.',
      icon: Globe,
      features: ['CRM Systems', 'Email Platforms', 'Payment Processors', 'Social Media']
    },
    {
      title: 'Custom API Development',
      description: 'Tailored API solutions designed specifically for your business needs and workflows.',
      icon: Code,
      features: ['Custom Endpoints', 'Business Logic', 'Security', 'Scalability']
    }
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'ai-fundamentals':
        return aiFundamentals;
      case 'chatbots':
        return chatbotTechnologies;
      case 'rag':
        return ragSystems;
      case 'document-processing':
        return documentProcessing;
      case 'business-intelligence':
        return businessIntelligence;
      case 'integrations':
        return integrations;
      default:
        return aiFundamentals;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Technology Explained
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understand the technologies powering modern AI automation. From chatbots to RAG systems,
              learn how these innovations can transform your business.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </Button>
            ))}
          </div>

          {/* Content Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {getSectionContent().map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Implement AI in Your Business?
                </h3>
                <p className="text-blue-100 mb-6">
                  Let's discuss how these technologies can solve your specific challenges and drive growth.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tech;
