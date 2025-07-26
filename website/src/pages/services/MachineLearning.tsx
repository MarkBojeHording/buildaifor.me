import { Cpu, Brain, Target, TrendingUp, ArrowLeft, CheckCircle, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const MachineLearning = () => {
  const features = [
    {
      icon: Brain,
      title: 'Custom ML Models',
      description: 'Tailored machine learning models designed for your specific business challenges'
    },
    {
      icon: Target,
      title: 'Predictive Analytics',
      description: 'Forecast trends, demand, and outcomes with advanced predictive modeling'
    },
    {
      icon: TrendingUp,
      title: 'Pattern Recognition',
      description: 'Identify hidden patterns and insights in your data automatically'
    },
    {
      icon: Zap,
      title: 'Automated Decisions',
      description: 'Deploy ML models that make intelligent decisions in real-time'
    }
  ];

  const mlSolutions = [
    {
      type: 'Demand Forecasting',
      description: 'Predict customer demand, inventory needs, and market trends',
      applications: ['Inventory optimization', 'Supply chain planning', 'Revenue forecasting'],
      accuracy: '94% prediction accuracy',
      industry: 'Retail & E-commerce'
    },
    {
      type: 'Customer Behavior Analysis',
      description: 'Understand customer preferences, predict churn, and optimize experiences',
      applications: ['Churn prediction', 'Recommendation engines', 'Customer segmentation'],
      accuracy: '89% churn prediction accuracy',
      industry: 'SaaS & Subscription'
    },
    {
      type: 'Quality Control & Inspection',
      description: 'Automated defect detection and quality assessment using computer vision',
      applications: ['Defect detection', 'Quality scoring', 'Process optimization'],
      accuracy: '99.5% defect detection',
      industry: 'Manufacturing'
    },
    {
      type: 'Financial Risk Assessment',
      description: 'Assess credit risk, detect fraud, and optimize investment strategies',
      applications: ['Credit scoring', 'Fraud detection', 'Risk modeling'],
      accuracy: '96% fraud detection rate',
      industry: 'Financial Services'
    },
    {
      type: 'Price Optimization',
      description: 'Dynamic pricing strategies based on market conditions and demand',
      applications: ['Dynamic pricing', 'Competitive analysis', 'Revenue optimization'],
      accuracy: '15% revenue increase',
      industry: 'E-commerce & Retail'
    },
    {
      type: 'Predictive Maintenance',
      description: 'Predict equipment failures and optimize maintenance schedules',
      applications: ['Failure prediction', 'Maintenance scheduling', 'Cost optimization'],
      accuracy: '87% failure prediction',
      industry: 'Manufacturing & IoT'
    }
  ];

  const mlTypes = [
    'Supervised Learning',
    'Unsupervised Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Time Series Forecasting',
    'Reinforcement Learning',
    'Ensemble Methods'
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
                <div className="inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Cpu className="w-4 h-4 mr-2" />
                  Machine Learning Solutions
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Unlock the Power of
                  <span className="text-blue-600"> Predictive Intelligence </span>
                  For Your Business
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Go beyond basic analytics with custom machine learning models that predict outcomes,
                  identify patterns, and automate complex decisions to drive competitive advantage.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Build ML Solution
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Explore Use Cases
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%+</div>
                  <div className="text-sm text-gray-600">Model Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">ML Models Deployed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Real-time</div>
                  <div className="text-sm text-gray-600">Predictions</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">ML Model Performance</h3>
                    <Badge className="bg-green-100 text-green-700">Training Complete</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Demand Forecasting</span>
                        <span className="text-xs text-blue-600">94.2% accuracy</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Churn Prediction</span>
                        <span className="text-xs text-green-600">89.7% accuracy</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Price Optimization</span>
                        <span className="text-xs text-purple-600">96.1% accuracy</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">This Week's Predictions</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Predictions Made:</span> 12,847</div>
                      <div><span className="font-medium">Accuracy Rate:</span> 93.2%</div>
                      <div><span className="font-medium">Models Active:</span> 8</div>
                      <div><span className="font-medium">Data Points:</span> 2.4M</div>
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
              Enterprise-Grade Machine Learning Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From data preparation to model deployment - we handle the entire ML lifecycle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* ML Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Machine Learning Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-world ML applications that deliver measurable business value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mlSolutions.map((solution, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{solution.type}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {solution.industry}
                    </Badge>
                  </div>
                  <CardDescription>{solution.description}</CardDescription>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">{solution.accuracy}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Applications:</h4>
                    {solution.applications.map((app, appIndex) => (
                      <div key={appIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{app}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ML Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete ML Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with all major machine learning approaches and frameworks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {mlTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-violet-50 transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <Brain className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a specific ML approach? We work with cutting-edge techniques and frameworks.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Discuss ML Requirements
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our ML Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From problem definition to production deployment - a systematic approach to ML success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Problem Definition',
                description: 'Define business objectives and identify the right ML approach'
              },
              {
                step: '2',
                title: 'Data Preparation',
                description: 'Clean, process, and engineer features from your data'
              },
              {
                step: '3',
                title: 'Model Development',
                description: 'Train, validate, and optimize ML models for your use case'
              },
              {
                step: '4',
                title: 'Production Deployment',
                description: 'Deploy models with monitoring, scaling, and continuous improvement'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-violet-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Harness Machine Learning?
          </h2>
          <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
            Transform your business with custom ML models that predict, optimize, and automate for competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start ML Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-violet-600 px-8 py-4 text-lg">
              Explore ML Solutions
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MachineLearning;
