import { Workflow, Zap, Target, Clock, ArrowLeft, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const WorkflowOptimization = () => {
  const features = [
    {
      icon: Target,
      title: 'Process Mapping',
      description: 'Analyze and visualize your current workflows to identify bottlenecks'
    },
    {
      icon: Zap,
      title: 'Task Automation',
      description: 'Automate repetitive tasks and eliminate manual handoffs'
    },
    {
      icon: TrendingUp,
      title: 'Performance Monitoring',
      description: 'Track efficiency gains and identify further optimization opportunities'
    },
    {
      icon: Clock,
      title: 'Real-time Optimization',
      description: 'Continuously improve workflows based on performance data'
    }
  ];

  const workflowTypes = [
    {
      type: 'Customer Onboarding',
      description: 'Streamline new customer setup from signup to first value',
      beforeTime: '5-7 days',
      afterTime: '2-3 hours',
      improvements: ['Automated document collection', 'Instant account setup', 'Welcome sequence automation']
    },
    {
      type: 'Invoice Processing',
      description: 'Automate invoice approval, payment processing, and reconciliation',
      beforeTime: '3-5 days',
      afterTime: '30 minutes',
      improvements: ['Automatic approval routing', 'Payment processing', 'Reconciliation automation']
    },
    {
      type: 'Lead Qualification',
      description: 'Score, route, and nurture leads automatically based on behavior',
      beforeTime: '2-3 days',
      afterTime: 'Real-time',
      improvements: ['Automated lead scoring', 'Intelligent routing', 'Nurture sequences']
    },
    {
      type: 'Employee Onboarding',
      description: 'Automate HR processes from offer acceptance to first day',
      beforeTime: '2-3 weeks',
      afterTime: '3-5 days',
      improvements: ['Document automation', 'System provisioning', 'Training scheduling']
    }
  ];

  const optimizationSteps = [
    {
      step: '1',
      title: 'Process Analysis',
      description: 'Map current workflows and identify inefficiencies'
    },
    {
      step: '2',
      title: 'Automation Design',
      description: 'Design optimized workflows with AI-powered automation'
    },
    {
      step: '3',
      title: 'Implementation',
      description: 'Deploy automated workflows with minimal disruption'
    },
    {
      step: '4',
      title: 'Monitoring & Optimization',
      description: 'Continuously monitor and improve performance'
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
                <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Workflow className="w-4 h-4 mr-2" />
                  Workflow Optimization
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Chaos Into
                  <span className="text-blue-600"> Streamlined Efficiency </span>
                  With AI
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Eliminate bottlenecks, reduce manual work, and accelerate your business processes.
                  Our AI identifies inefficiencies and creates optimized workflows that run themselves.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Optimize My Workflows
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Case Studies
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">70%</div>
                  <div className="text-sm text-gray-600">Time Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Error Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3x</div>
                  <div className="text-sm text-gray-600">Faster Processing</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Workflow Performance</h3>
                    <Badge className="bg-green-100 text-green-700">Optimized</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Customer Onboarding</span>
                        <span className="text-xs text-green-600">↑ 85% faster</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Invoice Processing</span>
                        <span className="text-xs text-blue-600">↑ 92% faster</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Lead Qualification</span>
                        <span className="text-xs text-purple-600">↑ 78% faster</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">This Week's Impact</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Time Saved:</span> 47 hours</div>
                      <div><span className="font-medium">Tasks Automated:</span> 234</div>
                      <div><span className="font-medium">Errors Prevented:</span> 18</div>
                      <div><span className="font-medium">Cost Savings:</span> $2,350</div>
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
              AI-Powered Workflow Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform analyzes your processes and creates optimized workflows automatically
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Workflow Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Workflow Optimizations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've transformed time-consuming processes into efficient automated workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {workflowTypes.map((workflow, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{workflow.type}</span>
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-red-800">Before</div>
                      <div className="text-lg font-bold text-red-600">{workflow.beforeTime}</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-green-800">After</div>
                      <div className="text-lg font-bold text-green-600">{workflow.afterTime}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Improvements:</h4>
                    {workflow.improvements.map((improvement, improvementIndex) => (
                      <div key={improvementIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Optimization Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to identifying and eliminating workflow inefficiencies
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {optimizationSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {index < optimizationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-orange-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Optimize Your Workflows?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Stop losing time to inefficient processes. Let AI streamline your workflows and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Workflow Analysis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkflowOptimization;
