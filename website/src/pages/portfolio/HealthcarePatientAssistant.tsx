import { Heart, MessageSquare, Calendar, Clock, Users, TrendingUp, ArrowLeft, CheckCircle, Star, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HealthcarePatientAssistant = () => {
  const queryExamples = [
    {
      question: "I need to schedule an appointment with Dr. Smith",
      response: "I can help you schedule with Dr. Smith. He has availability this Thursday at 2:30 PM or Friday at 10:00 AM. Which works better for you?",
      category: "Appointment Scheduling"
    },
    {
      question: "What should I do if I'm experiencing chest pain?",
      response: "Chest pain can be serious. If you're experiencing severe chest pain, difficulty breathing, or pain radiating to your arm or jaw, please call 911 immediately. For mild discomfort, I recommend contacting your doctor.",
      category: "Medical Guidance"
    },
    {
      question: "Can you help me understand my lab results?",
      response: "I'd be happy to help explain your lab results. Please note that I can provide general information, but your doctor should review specific results with you. What specific values would you like me to explain?",
      category: "Lab Results"
    }
  ];

  const patientMetrics = [
    { label: 'Query Resolution Rate', value: '85%', description: 'Patients get answers without human intervention' },
    { label: 'Call Volume Reduction', value: '40%', description: 'Fewer calls to reception staff' },
    { label: 'Patient Satisfaction', value: '4.8/5', description: 'Average rating from patient feedback' },
    { label: 'Response Time', value: '< 2 sec', description: 'Average time to provide initial response' }
  ];

  const capabilities = [
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Book, reschedule, and cancel appointments with real-time calendar integration',
      features: ['Real-time availability', 'Automated confirmations', 'Reminder notifications']
    },
    {
      icon: MessageSquare,
      title: 'Medical Q&A',
      description: 'Answer common medical questions with approved clinical information',
      features: ['Symptom guidance', 'Medication information', 'Procedure explanations']
    },
    {
      icon: Users,
      title: 'Patient Support',
      description: 'Provide 24/7 support for patient inquiries and concerns',
      features: ['Insurance questions', 'Billing support', 'General information']
    },
    {
      icon: Phone,
      title: 'Emergency Triage',
      description: 'Identify urgent situations and route to appropriate care',
      features: ['Symptom assessment', 'Emergency detection', 'Immediate escalation']
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
            Back to Portfolio
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  Healthcare Patient Assistant
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Patient Support </span>
                  Available 24/7
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionize patient care with an intelligent assistant that handles appointments,
                  answers medical questions, and provides instant support - reducing staff workload
                  while improving patient satisfaction.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {patientMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-pink-700 hover:bg-gray-100 px-8 py-4 text-lg">
                  Request Demo
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-pink-700 px-8 py-4 text-lg">
                  View Case Study
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Patient Assistant Chat</h3>
                    <Badge className="bg-green-100 text-green-700">Online</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">Hi, I need to schedule an appointment with Dr. Johnson</p>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hello! I'd be happy to help you schedule with Dr. Johnson. I see he has availability this week on:</p>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs bg-white rounded p-2">📅 Thursday, Jan 18 - 2:30 PM</div>
                        <div className="text-xs bg-white rounded p-2">📅 Friday, Jan 19 - 10:00 AM</div>
                      </div>
                      <p className="text-sm mt-2">Which time works better for you?</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">Friday at 10 AM works perfect!</p>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Perfect! I've scheduled your appointment with Dr. Johnson for Friday, January 19th at 10:00 AM. You'll receive a confirmation email shortly. Is there anything else I can help you with?</p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    Appointment booked in 45 seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Query Examples */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Patient Interactions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI assistant handles real patient queries with empathy and accuracy
            </p>
          </div>

          <div className="space-y-8">
            {queryExamples.map((example, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{example.question}</CardTitle>
                      <Badge variant="outline" className="mt-2">{example.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-11">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-green-800">{example.response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Patient Care Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your patients need, available 24/7 with human-level understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <capability.icon className="w-6 h-6 text-white" />
                    </div>
                    <span>{capability.title}</span>
                  </CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                    {capability.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Measurable Healthcare Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from healthcare providers using our patient assistant
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle>85% Query Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Patients get immediate answers to their questions without waiting
                  for staff, improving satisfaction and reducing call volume.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle>40% Call Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Significant reduction in routine calls allows staff to focus
                  on complex patient needs and direct care activities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>4.8/5 Patient Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Patients love the instant, accurate responses and 24/7 availability
                  for their healthcare questions and appointment needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Patient Care?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join healthcare providers who are improving patient satisfaction while
            reducing staff workload with our intelligent patient assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HealthcarePatientAssistant;
