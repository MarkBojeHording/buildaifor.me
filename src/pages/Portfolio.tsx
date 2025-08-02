import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'chatbots', label: 'Chatbots' },
    { id: 'document', label: 'Document Processing' },
    { id: 'data', label: 'Data Analysis' },
    { id: 'workflow', label: 'Workflow Automation' },
    { id: 'rag', label: 'RAG Systems' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Healthcare Patient Assistant',
      description: 'AI chatbot for patient queries, appointment scheduling, and medical information',
      category: 'chatbots',
      tags: ['Healthcare', 'NLP', 'Appointment Booking'],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['85% query resolution', '40% call reduction', '4.8/5 satisfaction'],
      link: '/portfolio/healthcare-patient-assistant'
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
      title: 'HR Recruitment Automation',
      description: 'AI-powered candidate screening and interview scheduling',
      category: 'workflow',
      tags: ['HR Tech', 'Recruitment', 'Process Automation'],
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['60% screening time reduced', '90% scheduling automation', '2x faster hiring'],
      link: '/portfolio/hr-recruitment-automation'
    },
    {
      id: 5,
      title: 'Financial Knowledge Assistant',
      description: 'RAG system for financial regulations and compliance queries',
      category: 'rag',
      tags: ['Finance', 'Compliance', 'Knowledge Management'],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      metrics: ['99.2% accuracy', '1000+ regulations indexed', 'Instant compliance checks'],
      link: '/portfolio/financial-knowledge-assistant'
    },

  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="mb-6 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete AI Solutions Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Explore our comprehensive collection of AI automation projects that have transformed businesses across various industries and use cases.
            </p>
          </div>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(project.link);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle
                    className="group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(project.link);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your AI Project?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                See how we can transform your business with custom AI solutions.
                Get started with our template solutions in just 24-48 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started Today
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
