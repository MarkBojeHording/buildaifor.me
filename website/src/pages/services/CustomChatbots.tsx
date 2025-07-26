import { MessageSquare, Clock, Users, BarChart3, ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const CustomChatbots = () => {
  useScrollToTop();
  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Language Processing',
      description: 'Advanced NLP that understands context, intent, and provides human-like responses'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock customer support without human intervention'
    },
    {
      icon: Users,
      title: 'Multi-Platform Integration',
      description: 'Deploy across websites, WhatsApp, Facebook Messenger, and more'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Detailed conversation analytics and customer behavior insights'
    }
  ];

  const useCases = [
    {
      title: 'Customer Support',
      description: 'Handle common inquiries, troubleshooting, and ticket routing',
      results: '85% query resolution, 60% support cost reduction'
    },
    {
      title: 'Lead Generation',
      description: 'Qualify prospects, collect contact information, and schedule demos',
      results: '3x more qualified leads, 40% higher conversion rates'
    },
    {
      title: 'Appointment Booking',
      description: 'Automated scheduling with calendar integration and reminders',
      results: '90% booking automation, 50% fewer no-shows'
    },
    {
      title: 'E-commerce Assistant',
      description: 'Product recommendations, order tracking, and purchase assistance',
      results: '25% increase in sales, 70% faster order processing'
    }
  ];

  const pricingOptions = [
    {
      name: 'Template Chatbot',
      price: '$149 setup + $19.99/month',
      features: ['Pre-built industry templates', 'Basic customization', 'Single platform deployment', '7-day support'],
      timeline: '24-48 hours'
    },
    {
      name: 'Enhanced Chatbot',
      price: '$399 setup + $19.99/month',
      features: ['Custom conversation flows', 'Multi-platform deployment', 'CRM integration', '30-day support'],
      timeline: '1-2 weeks'
    },
    {
      name: 'Custom Chatbot',
      price: '$40/hour + $19.99/month',
      features: ['Fully custom development', 'Advanced AI capabilities', 'Complex integrations', 'Ongoing development'],
      timeline: '2-4 weeks'
    }
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
            Back to Services
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Custom Chatbots
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Intelligent Chatbots That
                  <span className="text-blue-600"> Actually Help </span>
                  Your Customers
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Deploy AI-powered chatbots that understand context, provide accurate answers,
                  and seamlessly hand off to humans when needed. Available 24/7 across all your platforms.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Get Your Chatbot
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hi! How can I help you today?</p>
                    </div>
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">I need help with my order</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">I'd be happy to help! Can you provide your order number?</p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Customer Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our chatbots go beyond simple Q&A to provide intelligent, contextual assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Use Cases Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses are using chatbots to improve efficiency and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span>{useCase.title}</span>
                  </CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">Results:</span>
                    </div>
                    <p className="text-green-700 text-sm">{useCase.results}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Chatbot Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From quick templates to fully custom solutions - we have options for every business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingOptions.map((option, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${index === 1 ? 'scale-105 border-2 border-blue-500' : ''}`}>
                {index === 1 && (
                  <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg">
                    <span className="text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{option.name}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600 my-4">
                    {option.price}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Ready in {option.timeline}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${index === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`} variant={index === 1 ? 'default' : 'outline'}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Deploy Your AI Chatbot?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their customer service with our intelligent chatbots
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Chatbot Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomChatbots;
