import { Check, Star, Clock, Zap, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CalendlyPopup from './CalendlyPopup';

const Pricing = () => {
  const plans = [
    {
      name: 'Template Solutions',
      price: '$149',
      setup: 'setup',
      monthly: '$19.99/month',
      tagline: 'Ready in 24-48 hours',
      description: 'Pre-built industry-specific solutions with basic customization',
      icon: Clock,
      features: [
        'Quick setup and deployment',
        'Industry-specific templates',
        'Basic customization options',
        'All API costs covered',
        '7-day priority support',
        'Mobile-responsive design'
      ],
      buttonText: 'Choose Template',
      popular: false,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Enhanced Solutions',
      price: '$399',
      setup: 'setup',
      monthly: '$19.99/month',
      tagline: 'Custom features in 2-4 weeks',
      description: 'Tailored solutions with advanced integrations and custom workflows',
      icon: Zap,
      features: [
        'Custom feature development',
        'Advanced system integrations',
        'Custom workflow automation',
        'Analytics and reporting',
        '30-day priority support',
        'Training and documentation'
      ],
      buttonText: 'Get Enhanced',
      popular: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Custom Solutions',
      price: '$40',
      setup: 'per hour',
      monthly: '$19.99/month',
      tagline: 'Fully tailored to your needs',
      description: 'Complete custom development for complex requirements',
      icon: Settings,
      features: [
        'Full consultation and planning',
        'Complete custom development',
        'Complex system integrations',
        'Ongoing development support',
        'Dedicated project manager',
        'Unlimited revisions'
      ],
      buttonText: 'Schedule Custom Call',
      popular: false,
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            No API headaches - we handle all the technical complexity so you can focus on your business.
          </p>
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-lg font-medium">
            <Zap className="w-5 h-5 mr-2" />
            All plans include API costs and technical maintenance
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-2xl scale-105'
                  : 'border border-gray-200 shadow-lg hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">Most Popular</span>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-center my-6">
                  <div className="text-4xl font-bold text-blue-600">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{plan.setup}</div>
                  <div className="text-lg font-semibold text-gray-700">
                    + {plan.monthly}
                  </div>
                </div>
                <div className="text-lg font-semibold text-green-600 mb-2">
                  {plan.tagline}
                </div>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Monthly Service Model?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">No API Headaches</h4>
                <p className="text-sm text-gray-600">We handle all API costs, rate limits, and technical maintenance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Always Updated</h4>
                <p className="text-sm text-gray-600">Continuous improvements and feature updates included</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Ongoing Support</h4>
                <p className="text-sm text-gray-600">Priority support and maintenance included in every plan</p>
              </div>
            </div>
            <div className="mt-8">
              <CalendlyPopup>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer">
                  Book Free Consultation
                </Button>
              </CalendlyPopup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
