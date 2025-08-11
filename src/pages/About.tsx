import { Code, Brain, Zap, Award, Target, Users, Star, CheckCircle, ArrowRight, ArrowLeft, Rocket, Clock, BarChart3, Wrench, Building2, Heart, Shield, TrendingUp, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';

const About = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const differentiators = [
    {
      icon: Rocket,
      title: 'Working Systems, Not Concepts',
      description: 'Every solution in our portfolio is fully functional and available for testing before you make any commitment.'
    },
    {
      icon: Clock,
      title: 'Days, Not Months',
      description: 'Our proven template approach means you can have a customized AI system running within 48-72 hours instead of waiting months for development.'
    },
    {
      icon: BarChart3,
      title: 'Measurable Results',
      description: 'Focus on practical business automation that delivers real efficiency improvements and cost savings.'
    },
    {
      icon: Wrench,
      title: 'Zero Technical Complexity',
      description: 'We handle all the technical implementation, API management, and ongoing maintenance so you can focus on running your business.'
    }
  ];

  const expertise = [
    {
      icon: Brain,
      title: 'RAG Systems',
      description: 'Specialized in turning company documents into interactive knowledge bases'
    },
    {
      icon: Zap,
      title: 'Business Process Automation',
      description: 'Streamlining workflows across industries'
    },
    {
      icon: Code,
      title: 'Custom AI Development',
      description: 'Building tailored solutions that fit your exact requirements'
    },
    {
      icon: Award,
      title: 'Full-Stack Implementation',
      description: 'End-to-end development from concept to deployment'
    }
  ];

  const industries = [
    {
      icon: Building2,
      title: 'Legal Practices',
      description: 'Document review systems, client intake automation, and case management workflows'
    },
    {
      icon: Heart,
      title: 'Healthcare Providers',
      description: 'Patient intake processing, appointment scheduling, and medical document analysis'
    },
    {
      icon: Users,
      title: 'E-commerce Businesses',
      description: 'Customer service automation, inventory management, and personalized recommendations'
    },
    {
      icon: Users,
      title: 'Professional Services',
      description: 'Lead qualification, proposal generation, and client communication automation'
    }
  ];

  const advantages = [
    {
      icon: Target,
      title: 'Working Portfolio',
      description: 'Browse and test 15+ functional AI systems across different industries and use cases.'
    },
    {
      icon: Zap,
      title: 'Rapid Customization',
      description: 'Proven templates mean faster implementation without sacrificing quality or functionality.'
    },
    {
      icon: TrendingUp,
      title: 'Business-Focused Results',
      description: 'Solutions designed to improve efficiency, reduce costs, and streamline operations.'
    },
    {
      icon: Shield,
      title: 'Complete Technical Support',
      description: 'Full implementation, maintenance, and optimization without any technical burden on you.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                // Clear saved scroll position for home page before navigating
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
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Main Page
            </Button>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About BuildAIFor.Me
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Making AI automation accessible to every business through working solutions, not endless presentations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe businesses deserve to see exactly what they're getting before they commit. That's why we've built a comprehensive portfolio of working AI systems you can test, interact with, and experience firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To transform how businesses think about AI implementation. Instead of 6-month development cycles filled with uncertainty, we provide immediate access to proven AI solutions that can be customized for your specific needs.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every business should have access to intelligent automation that drives growth, efficiency, and competitive advantage - without the technical complexity, endless meetings, or project risks typical of traditional AI development.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why We're Different</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Rocket className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Working Systems, Not Concepts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Days, Not Months</span>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Measurable Results</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Wrench className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Zero Technical Complexity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About the Founder
                </h2>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Mark Hording - AI Automation Specialist
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  With extensive experience in AI development and business automation, I specialize in creating intelligent solutions that solve real business problems. My approach is different: instead of talking about possibilities, I show you working systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expertise.map((item, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Proven Approach</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Demonstration</h4>
                      <p className="text-sm text-gray-600">See 2-3 working systems relevant to your industry and use case</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Custom Development</h4>
                      <p className="text-sm text-gray-600">Build your solution using proven templates as the foundation</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Iterative Refinement</h4>
                      <p className="text-sm text-gray-600">Test and refine based on your real-world usage and feedback</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Ongoing Success</h4>
                      <p className="text-sm text-gray-600">Ensure you achieve measurable business improvements with continued support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven AI solutions across diverse business sectors and use cases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{industry.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See the Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How our approach compares to traditional AI development.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-red-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-6">Traditional AI Development</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-700">Months of planning and presentations</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-700">Uncertain outcomes and timeline</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-700">High upfront costs with unknown ROI</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-700">Technical complexity and integration challenges</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-green-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6">BuildAIFor.Me Approach</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Working systems you can test immediately</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Clear, predictable outcomes</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Rapid deployment with proven templates</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Full technical support and maintenance included</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Advantage Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets us apart in the AI automation landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to See AI Automation in Action?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Instead of scheduling another meeting to discuss possibilities, let's start with a demonstration. I'll show you working AI systems relevant to your business and explain exactly how they can be customized for your specific needs.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold group"
            onClick={() => {
              // Navigate to contact or home
              navigate('/');
            }}
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
