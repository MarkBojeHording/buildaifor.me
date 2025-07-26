import {
  MessageSquare,
  FileText,
  Database,
  Workflow,
  Brain,
  Plug,
  BarChart3,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: MessageSquare,
      title: 'AI Chatbots',
      description: '24/7 AI-powered customer service and support.',
      link: '/services/custom-chatbots'
    },
    {
      icon: FileText,
      title: 'Document Processing & Analysis',
      description: 'Automate data extraction with 99%+ accuracy.',
      link: '/services/document-processing'
    },
    {
      icon: Database,
      title: 'Data Automation',
      description: 'Streamline data collection and reporting tasks.',
      link: '/services/data-automation'
    },
    {
      icon: Workflow,
      title: 'Workflow Optimization',
      description: 'Automate repetitive tasks for efficiency.',
      link: '/services/workflow-optimization'
    },
    {
      icon: Brain,
      title: 'RAG Systems',
      description: 'Instant answers from your company documents.',
      link: '/services/rag-systems'
    },
    {
      icon: BarChart3,
      title: 'Business Intelligence Tools',
      description: 'Actionable insights from AI-driven analytics.',
      link: '/services/business-intelligence'
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive AI Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business with AI automation tools for efficiency and growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
                                                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 group"
                  onClick={() => {
                    navigate(service.link);
                    window.scrollTo(0, 0);
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
