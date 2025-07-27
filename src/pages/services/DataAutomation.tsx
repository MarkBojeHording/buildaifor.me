import { Database, RefreshCw, BarChart3, Clock, ArrowLeft, CheckCircle, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DataAutomation = () => {
  const features = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'Automatically gather data from multiple sources, APIs, and databases'
    },
    {
      icon: RefreshCw,
      title: 'Data Cleaning',
      description: 'Remove duplicates, fix formatting, and standardize data automatically'
    },
    {
      icon: BarChart3,
      title: 'Real-time Reporting',
      description: 'Generate live dashboards and reports with up-to-date information'
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Trigger actions based on data changes and predefined conditions'
    }
  ];

  const automationTypes = [
    {
      type: 'Sales Data Pipeline',
      description: 'Automatically sync CRM data, calculate metrics, and generate reports',
      benefits: ['Real-time sales tracking', 'Automated commission calculations', 'Performance dashboards'],
      timeReduction: '90%'
    },
    {
      type: 'Financial Reporting',
      description: 'Consolidate financial data from multiple sources into comprehensive reports',
      benefits: ['Monthly report automation', 'Expense categorization', 'Budget tracking'],
      timeReduction: '85%'
    },
    {
      type: 'Inventory Management',
      description: 'Track stock levels, predict demand, and automate reordering',
      benefits: ['Stock level monitoring', 'Demand forecasting', 'Automatic reordering'],
      timeReduction: '80%'
    },
    {
      type: 'Customer Analytics',
      description: 'Analyze customer behavior, segment audiences, and track engagement',
      benefits: ['Behavior analysis', 'Segmentation automation', 'Engagement tracking'],
      timeReduction: '75%'
    }
  ];

  const dataSources = [
    'CRM Systems (Salesforce, HubSpot)',
    'E-commerce Platforms (Shopify, WooCommerce)',
    'Marketing Tools (Google Analytics, Facebook Ads)',
    'Financial Software (QuickBooks, Xero)',
    'Social Media APIs',
    'Email Marketing Platforms',
    'Custom Databases',
    'Spreadsheets & CSV Files'
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
                <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Database className="w-4 h-4 mr-2" />
                  Data Automation
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Raw Data Into
                  <span className="text-blue-600"> Business Intelligence </span>
                  Automatically
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop spending hours on manual data tasks. Our AI-powered automation collects,
                  cleans, and analyzes your data in real-time, delivering insights when you need them.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Automate Your Data
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Data Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">90%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">100+</div>
                  <div className="text-sm text-gray-600">Data Sources</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Data Pipeline Status</h3>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">CRM Data Sync</span>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Sales Report Generated</span>
                      </div>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Processing Analytics</span>
                      </div>
                      <span className="text-xs text-gray-500">In progress</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Today's Summary</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Records Processed:</span> 15,247</div>
                      <div><span className="font-medium">Reports Generated:</span> 12</div>
                      <div><span className="font-medium">Data Sources:</span> 8</div>
                      <div><span className="font-medium">Uptime:</span> 99.9%</div>
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
              Complete Data Automation Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From collection to insights - we handle every step of your data pipeline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Automation Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Data Automation Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses are automating their most time-consuming data tasks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {automationTypes.map((automation, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{automation.type}</span>
                    <Badge className="bg-green-100 text-green-700">
                      {automation.timeReduction} time saved
                    </Badge>
                  </CardTitle>
                  <CardDescription>{automation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Benefits:</h4>
                    {automation.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Any Data Source
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We integrate with all major platforms and can connect to any API or database
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {dataSources.map((source, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your platform? We can connect to any system with an API.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Request Custom Integration
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Automate Your Data?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Stop wasting time on manual data tasks. Let AI handle the heavy lifting while you focus on insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Data Automation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DataAutomation;
