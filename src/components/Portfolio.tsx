import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ExternalLink, Github, ArrowRight, MessageSquare, Clock, Users, Dumbbell, Calendar, Building, Car, Scissors, Stethoscope, Home, Scale, ShoppingCart, Monitor, Store, Heart, FileText, BarChart3, Workflow, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalendlyPopup from './CalendlyPopup.tsx';

const Portfolio = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('examples');

  const filters = [
    { id: 'examples', label: 'AI Project Examples' },
    { id: 'chatbots', label: 'Chatbots' },
    { id: 'document', label: 'Document Processing' },
    { id: 'data', label: 'Data Analysis' },
    { id: 'workflow', label: 'Workflow Automation' },
    { id: 'rag', label: 'RAG Systems' }
  ];

  const allProjects = [
    {
      id: 1,
      title: 'E-commerce Store Chatbot',
      description: 'AI chatbot for product assistance, order support, and customer service',
      category: 'chatbots',
      tags: ['E-commerce', 'Customer Service', 'Product Support'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['90% query resolution', '50% support ticket reduction', '4.9/5 satisfaction'],
      link: '/demo/ecommerce'
    },
    {
      id: 2,
      title: 'Legal Document Analyzer',
      description: 'Automated contract analysis and risk assessment system',
      category: 'document',
      tags: ['Legal Tech', 'Document Analysis', 'Risk Assessment'],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['95% accuracy', '70% time saved', '500+ contracts processed/day'],
      link: '/portfolio/legal-document-analyzer'
    },
    {
      id: 3,
      title: 'E-commerce Sales Intelligence',
      description: 'Predictive analytics for inventory and sales optimization',
      category: 'data',
      tags: ['E-commerce', 'Predictive Analytics', 'Inventory'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['25% revenue increase', '30% inventory optimization', 'Real-time insights'],
      link: '/portfolio/ecommerce-sales-intelligence'
    },
    {
      id: 4,
      title: 'AI Email Processing Workflow',
      description: 'Intelligent email classification, auto-responses, and data extraction system',
      category: 'workflow',
      tags: ['Email Automation', 'AI Classification', 'Data Extraction'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['85% email classification accuracy', '70% response time reduction', 'Automated data extraction'],
      link: '/portfolio/ai-email-workflow'
    },
    {
      id: 5,
      title: 'Technical Documentation RAG',
      description: 'AI-powered code documentation search with vector embeddings and intelligent code understanding',
      category: 'rag',
      tags: ['Technical Docs', 'Code Search', 'Vector Database'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['94.2% search accuracy', '3,892 code snippets indexed', '0.6s avg response time'],
      link: '/portfolio/technical-documentation-rag'
    },

  ];

  const tier1Chatbots = [
    {
      id: 't1-1',
      title: 'Dental Office',
      icon: Stethoscope,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Hours & Contact', 'Services Overview', 'Insurance Info'],
      demoLink: '/demo/dental-office'
    },
    {
      id: 't1-2',
      title: 'Restaurant',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Menu & Hours', 'Location Info', 'Policies'],
      demoLink: '/demo/restaurant'
    },
    {
      id: 't1-3',
      title: 'Hair Salon',
      icon: Scissors,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Service Menu', 'Hours & Contact', 'Stylist Info'],
      demoLink: '/demo/hair-salon'
    },
    {
      id: 't1-4',
      title: 'Fitness Studio',
      icon: Dumbbell,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Class Schedule', 'Membership Info', 'Contact Details'],
      demoLink: '/demo/fitness-studio'
    }
  ];

  const tier2Chatbots = [
    {
      id: 't2-3',
      title: 'Real Estate Office',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Property Information', 'Agent Matching', 'Lead Qualification'],
      demoLink: '/demo/real-estate'
    },
    {
      id: 't2-4',
      title: 'Law Firm',
      icon: Scale,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Practice Areas', 'Consultation Requests', 'Attorney Profiles'],
      demoLink: '/demo/law-firm'
    },
    {
      id: 't2-5',
      title: 'E-commerce Store',
      icon: ShoppingCart,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Product Assistance', 'Order Support', 'Return Guidance'],
      demoLink: '/demo/ecommerce'
    }
  ];

  const tier3Chatbots = [
    {
      id: 't3-1',
      title: 'Enterprise AI Assistant',
      icon: Workflow,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Multi-Modal Processing', 'Workflow Automation', 'Real-time Analytics'],
      demoLink: '/demo/enterprise-ai-assistant'
    }
  ];

  const filteredProjects = activeFilter === 'examples'
    ? allProjects.slice(0, 4)
    : allProjects.filter(project => project.category === activeFilter).slice(0, 4);

  const renderChatbotTiers = () => {
    return (
      <div className="space-y-16">
        {/* Tier 1 */}
        <div>
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">Tier 1</Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic FAQ Chatbots</h3>
            <p className="text-gray-600">Perfect for small businesses needing 24/7 basic information</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tier1Chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <chatbot.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{chatbot.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <img
                      src={chatbot.image}
                      alt={chatbot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                    {chatbot.features.map((feature, index) => (
                      <div key={index} className="text-xs text-green-600 font-medium">
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                    onClick={() => {
                      if (chatbot.title === 'Dental Office') {
                        navigate('/demo/dental-office');
                        window.scrollTo(0, 0);
                      } else if (chatbot.title === 'Restaurant') {
                        navigate('/demo/restaurant');
                        window.scrollTo(0, 0);
                      } else if (chatbot.title === 'Hair Salon') {
                        navigate('/demo/hair-salon');
                        window.scrollTo(0, 0);
                      } else if (chatbot.title === 'Fitness Studio') {
                        navigate('/demo/fitness-studio');
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    Try Live Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div>
          <div className="text-center mb-8">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-4">Tier 2</Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enhanced Business Chatbots</h3>
            <p className="text-gray-600">Perfect for growing businesses needing customer engagement</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tier2Chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <chatbot.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{chatbot.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <img
                      src={chatbot.image}
                      alt={chatbot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                    {chatbot.features.map((feature, index) => (
                      <div key={index} className="text-xs text-blue-600 font-medium">
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    onClick={() => {
                      if (chatbot.title === 'Real Estate Office') {
                        navigate('/demo/real-estate');
                        window.scrollTo(0, 0);
                      } else if (chatbot.title === 'E-commerce Store') {
                        navigate('/demo/ecommerce');
                        window.scrollTo(0, 0);
                      } else if (chatbot.title === 'Law Firm') {
                        navigate('/demo/law-firm');
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    Try Live Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div>
          <div className="text-center mb-8">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-4">Tier 3</Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise AI Assistant</h3>
            <p className="text-gray-600">Advanced automation platform with multi-modal processing and workflow management</p>
          </div>
          <div className="flex justify-center">
            <div className="grid md:grid-cols-1 gap-6 max-w-md">
              {tier3Chatbots.map((chatbot) => (
                <Card key={chatbot.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                      <chatbot.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{chatbot.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <img
                        src={chatbot.image}
                        alt={chatbot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                      {chatbot.features.map((feature, index) => (
                        <div key={index} className="text-xs text-purple-600 font-medium">
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                      onClick={() => {
                        if (chatbot.title === 'Enterprise AI Assistant') {
                          navigate('/demo/enterprise-ai-assistant');
                          window.scrollTo(0, 0);
                        }
                      }}
                    >
                      Try Live Demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectCards = () => {
    // Determine grid columns based on number of projects
    const projectCount = filteredProjects.length;
    const gridCols = projectCount === 1 ? 'md:grid-cols-1 lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2';

    return (
      <div className={`grid ${gridCols} gap-8 max-w-6xl mx-auto justify-items-center`}>
        {filteredProjects.map((project) => (
          <Card key={project.id} className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
            projectCount === 1 ? 'w-full max-w-2xl' : 'w-full'
          }`}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                {project.category === 'chatbots' && <MessageSquare className="w-6 h-6 text-blue-600" />}
                {project.category === 'document' && <FileText className="w-6 h-6 text-blue-600" />}
                {project.category === 'data' && project.title === 'E-commerce Sales Intelligence' && <ShoppingCart className="w-6 h-6 text-blue-600" />}

                {project.category === 'workflow' && <Workflow className="w-6 h-6 text-blue-600" />}
                {project.category === 'rag' && <Search className="w-6 h-6 text-blue-600" />}
                {project.category === 'examples' && <ExternalLink className="w-6 h-6 text-blue-600" />}
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                {project.tags.map((tag, index) => (
                  <div key={index} className="text-xs text-blue-600 font-medium">
                    ✓ {tag}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Key Results:</h4>
                {project.metrics.map((metric, index) => (
                  <div key={index} className="text-xs text-blue-600 font-medium">
                    ✓ {metric}
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                onClick={() => {
                  if (project.title === 'Legal Document Analyzer') {
                    navigate('/demo/document-analyzer');
                    window.scrollTo(0, 0);
                  } else if (project.link) {
                    navigate(project.link);
                    window.scrollTo(0, 0);
                  }
                }}
              >
                Try Live Demo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of AI automation projects that have transformed businesses across various industries and use cases.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Content based on filter */}
        {activeFilter === 'chatbots' ? renderChatbotTiers() : renderProjectCards()}

        {/* Ready to Get Started Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your AI automation needs and learn how we can transform your business processes.
            </p>
            <CalendlyPopup>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Book Free Consultation
              </button>
            </CalendlyPopup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
