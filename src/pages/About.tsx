import { Code, Brain, Zap, Award, Target, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const About = () => {
  useScrollToTop();

  const achievements = [
    {
      icon: Brain,
      title: 'Advanced RAG Expert',
      description: 'Specialized in retrieval-augmented generation systems'
    },
    {
      icon: Zap,
      title: 'Full-Stack Proficiency',
      description: 'End-to-end development from backend to frontend'
    },
    {
      icon: Award,
      title: 'Award-Winning Solutions',
      description: 'Consistent delivery of high-quality solutions'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We stay at the forefront of AI technology to deliver cutting-edge solutions'
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our success. We build solutions that truly serve your needs'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'Every solution undergoes rigorous testing and optimization'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'BuildAIFor.Me transformed our customer service with an intelligent chatbot that handles 80% of inquiries automatically.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director, RetailCorp',
      content: 'The document processing solution saved us 15 hours per week and improved accuracy by 95%.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'HR Manager, GrowthCo',
      content: 'Our recruitment automation has reduced time-to-hire by 60% while improving candidate quality.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About BuildAIFor.Me
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're passionate about democratizing AI automation, making powerful AI solutions accessible to businesses of all sizes.
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
                  To bridge the gap between cutting-edge AI technology and practical business applications.
                  We believe every business deserves access to intelligent automation that drives growth,
                  efficiency, and competitive advantage.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Through our template-based approach and rapid deployment methodology, we're making
                  enterprise-grade AI solutions accessible, affordable, and implementable within days,
                  not months.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why We're Different</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Template-based rapid deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>No technical complexity for clients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Proven ROI and measurable results</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Ongoing support and optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Expert Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About the AI Automation Expert
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  With over 5 years of experience in AI development and automation, I specialize in
                  creating intelligent solutions that transform how businesses operate. My expertise
                  spans from advanced RAG systems to full-stack development, ensuring comprehensive
                  AI solutions that deliver measurable business value.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Having worked with businesses across various industries, I understand the unique
                  challenges each sector faces and how AI can be strategically implemented to solve
                  real-world problems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <achievement.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose BuildAIFor.Me?</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Rapid Deployment</h4>
                      <p className="text-sm text-gray-600">Get your AI solution up and running in 24-48 hours with our template approach</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">No Technical Headaches</h4>
                      <p className="text-sm text-gray-600">We handle all API costs, maintenance, and technical complexity</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Proven Results</h4>
                      <p className="text-sm text-gray-600">Track record of delivering measurable ROI and business transformation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every solution we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from real businesses that have transformed their operations with our AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how AI automation can revolutionize your operations and drive growth.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold group"
            onClick={() => {

              // Navigate to contact or home
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
