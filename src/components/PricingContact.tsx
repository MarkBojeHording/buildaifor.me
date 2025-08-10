import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Check, Star, Clock, Zap, Settings, ArrowRight, Users, Shield, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PricingContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // EmailJS configuration for Gmail
      const result = await emailjs.send(
        'service_emllhvi', // Replace with your Gmail Service ID
        'template_q8jffxj', // Replace with your Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          company_name: formData.company,
          project_type: formData.projectType,
          budget_range: formData.budget,
          message: formData.message,
          to_email: 'contact@buildaifor.me'
        },
        'qi_15iSqp77AG75gG' // Replace with your Public Key
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: '',
          budget: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const projectTypes = [
    'AI Chatbots',
    'Document Processing',
    'Data Automation',
    'Workflow Optimization',
    'RAG Systems',
    'Business Intelligence',
    'Other'
  ];

  const budgetRanges = [
    '$149-$399',
    '$400-$1000',
    '$1000+',
    'Custom'
  ];

  const solutionTiers = [
    {
      name: 'Template Solutions',
      delivery: '48-72 hours',
      description: 'Pre-built industry-specific solutions with basic customization',
      icon: Clock,
      features: [
        'Quick setup and deployment',
        'Industry-specific templates',
        'Basic customization options',
        'All API costs covered'
      ],
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Enhanced Solutions',
      delivery: '1-2 weeks',
      description: 'Tailored solutions with advanced integrations and custom workflows',
      icon: Zap,
      features: [
        'Custom feature development',
        'Advanced system integrations',
        'Custom workflow automation',
        'Analytics and reporting'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Enterprise Solutions',
      delivery: 'Timeline varies by complexity',
      description: 'Complete custom development for complex requirements',
      icon: Settings,
      features: [
        'Full consultation and planning',
        'Complete custom development',
        'Complex system integrations',
        'Dedicated project manager'
      ],
      color: 'from-purple-500 to-violet-600'
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Consultation',
      description: 'We discuss your business needs and AI requirements'
    },
    {
      step: '2',
      title: 'Quote',
      description: 'Receive a detailed proposal with timeline and pricing'
    },
    {
      step: '3',
      title: 'Demo',
      description: 'See your solution in action with a working prototype'
    },
    {
      step: '4',
      title: 'Deploy',
      description: 'Full implementation and launch of your AI solution'
    }
  ];

  return (
    <section id="pricing-contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Custom AI Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business with intelligent automation. Get a customized proposal within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Form */}
          <div className="space-y-8 h-full flex flex-col">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Your Custom Quote
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you within 24 hours with a detailed proposal tailored to your business needs.
              </p>
            </div>

            <Card className="shadow-xl border-0 flex-1">
              <CardContent className="p-8 h-full flex flex-col">
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="contact@buildaifor.me"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type *
                      </label>
                      <Select onValueChange={(value) => handleChange('projectType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <Select onValueChange={(value) => handleChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Describe your business challenges and AI needs..."
                      className="flex-1 min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {submitStatus === 'success' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-center">
                        Thank you! Your inquiry has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-center">
                        Sorry, there was an error sending your inquiry. Please try again or contact us directly at contact@buildaifor.me
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Solutions */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Solutions Built for Your Business
              </h3>
              <p className="text-gray-600 mb-8">
                Choose the solution that fits your timeline and requirements. All solutions include API costs and technical maintenance.
              </p>
            </div>

            {/* Solution Tiers */}
            <div className="space-y-6">
              {solutionTiers.map((tier, index) => (
                <Card key={index} className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{tier.name}</h4>
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {tier.delivery}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{tier.description}</p>
                        <ul className="space-y-1">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


                     </div>
         </div>

         {/* Bottom Cards Section */}
         <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mt-16">
           {/* Why Choose BuildAIFor.Me? Card */}
           <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
             <h4 className="text-lg font-bold text-gray-900 mb-4">Why Choose BuildAIFor.Me?</h4>
             <div className="space-y-3">
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <Target className="w-4 h-4 text-blue-600" />
                 </div>
                 <span className="text-sm text-gray-600">Rapid deployment with proven templates</span>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                   <Shield className="w-4 h-4 text-green-600" />
                 </div>
                 <span className="text-sm text-gray-600">No technical complexity - we handle everything</span>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                   <Users className="w-4 h-4 text-purple-600" />
                 </div>
                 <span className="text-sm text-gray-600">Dedicated support and ongoing optimization</span>
               </div>
             </div>
           </div>

           {/* Our Process Card */}
           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
             <h4 className="text-lg font-bold text-gray-900 mb-4">Our Process</h4>
             <div className="grid grid-cols-2 gap-4">
               {processSteps.map((step, index) => (
                 <div key={index} className="text-center">
                   <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                     {step.step}
                   </div>
                   <h5 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h5>
                   <p className="text-xs text-gray-600">{step.description}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     </section>
  );
};

export default PricingContact;
