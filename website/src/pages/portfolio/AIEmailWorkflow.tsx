import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mail, Brain, Zap, Shield, BarChart3, Clock, Users, CheckCircle, ExternalLink, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIEmailWorkflow = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Email Classification',
      description: 'Intelligent categorization of emails into urgent, sales, support, spam, and more with 95% accuracy'
    },
    {
      icon: Zap,
      title: 'Auto-Response Generation',
      description: 'Context-aware response generation using OpenAI GPT with tone matching and personalization'
    },
    {
      icon: Shield,
      title: 'Data Extraction',
      description: 'Extract contact info, invoices, meeting requests, and action items automatically'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into processing volume, accuracy metrics, and time savings'
    }
  ];

  const benefits = [
    '85% reduction in email processing time',
    '95% classification accuracy',
    'Automated response generation',
    'Contact information extraction',
    'Invoice and financial data processing',
    'Meeting scheduling automation',
    'Priority scoring and routing',
    'Comprehensive analytics and reporting'
  ];

  const techStack = [
    'OpenAI GPT-4',
    'Node.js & Express',
    'React & TypeScript',
    'SQLite Database',
    'IMAP/SMTP Integration',
    'Natural Language Processing',
    'Chart.js Analytics',
    'RESTful API Architecture'
  ];

  const metrics = [
    { label: 'Email Classification Accuracy', value: 95, color: 'bg-green-500' },
    { label: 'Response Time Reduction', value: 85, color: 'bg-blue-500' },
    { label: 'Data Extraction Success Rate', value: 92, color: 'bg-purple-500' },
    { label: 'User Satisfaction Score', value: 4.8, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
              <Button variant="outline" size="sm">
                <Github className="w-4 h-4 mr-2" />
                Source Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            AI Email Processing Workflow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive AI-powered email automation system that intelligently classifies, responds to, and extracts data from emails,
            dramatically reducing manual processing time and improving business efficiency.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm">Email Automation</Badge>
            <Badge variant="secondary" className="text-sm">AI Classification</Badge>
            <Badge variant="secondary" className="text-sm">Data Extraction</Badge>
            <Badge variant="secondary" className="text-sm">Workflow Automation</Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center`}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {typeof metric.value === 'number' && metric.value < 10 ? `${metric.value}/5` : `${metric.value}%`}
                </h3>
                <p className="text-gray-600 text-sm">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced AI capabilities that transform email management from a time-consuming task into an automated, intelligent system.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform your email workflow with intelligent automation that saves time and improves productivity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Architecture</h2>
            <p className="text-gray-600 mb-8">
              Built with modern technologies and best practices, the AI Email Processing Workflow provides a robust,
              scalable solution for email automation with enterprise-grade security and performance.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">System Architecture</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Processing Speed</span>
                <span className="text-sm font-medium">100+ emails/minute</span>
              </div>
              <Progress value={95} className="w-full" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classification Accuracy</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <Progress value={95} className="w-full" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Generation</span>
                <span className="text-sm font-medium">2-3 seconds</span>
              </div>
              <Progress value={90} className="w-full" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Extraction Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Use Cases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Perfect for businesses of all sizes looking to automate their email workflows and improve customer service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically classify support tickets, generate initial responses, and route urgent issues to the right team members.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Sales Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Extract contact information from sales inquiries, qualify leads, and automatically schedule follow-up meetings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Invoice Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically extract invoice data, amounts, and due dates, then integrate with accounting systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Email Workflow?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have already automated their email processing and saved countless hours of manual work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEmailWorkflow;
