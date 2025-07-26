import { Plug, Link, Zap, Shield, ArrowLeft, CheckCircle, Star, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const APIIntegrations = () => {
  const features = [
    {
      icon: Link,
      title: 'Seamless Connections',
      description: 'Connect any system with robust, reliable API integrations'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Keep data synchronized across all your platforms in real-time'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Globe,
      title: 'Universal Compatibility',
      description: 'Works with REST APIs, GraphQL, webhooks, and legacy systems'
    }
  ];

  const integrationTypes = [
    {
      type: 'CRM Integration',
      description: 'Connect Salesforce, HubSpot, Pipedrive, and other CRM systems',
      benefits: ['Automated lead sync', 'Contact management', 'Sales pipeline updates'],
      platforms: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM']
    },
    {
      type: 'E-commerce Integration',
      description: 'Sync inventory, orders, and customer data across platforms',
      benefits: ['Inventory synchronization', 'Order management', 'Customer data sync'],
      platforms: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce']
    },
    {
      type: 'Payment Processing',
      description: 'Integrate payment gateways and financial systems',
      benefits: ['Payment automation', 'Transaction tracking', 'Financial reporting'],
      platforms: ['Stripe', 'PayPal', 'Square', 'QuickBooks']
    },
    {
      type: 'Marketing Automation',
      description: 'Connect email marketing, social media, and analytics tools',
      benefits: ['Campaign automation', 'Lead nurturing', 'Performance tracking'],
      platforms: ['Mailchimp', 'Google Analytics', 'Facebook Ads', 'LinkedIn']
    }
  ];

  const popularPlatforms = [
    'Salesforce', 'HubSpot', 'Shopify', 'WooCommerce', 'Stripe', 'PayPal',
    'Google Workspace', 'Microsoft 365', 'Slack', 'Zoom', 'Mailchimp',
    'QuickBooks', 'Xero', 'Zapier', 'Make.com', 'Airtable'
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
                <div className="inline-flex items-center bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Plug className="w-4 h-4 mr-2" />
                  API Integrations
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Connect Everything,
                  <span className="text-blue-600"> Automate Everything </span>
                  Seamlessly
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Break down data silos and create unified workflows. Our API integrations
                  connect all your business tools, ensuring data flows smoothly between systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Connect My Systems
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  View Integrations
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Platforms Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Real-time</div>
                  <div className="text-sm text-gray-600">Data Sync</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Integration Dashboard</h3>
                    <Badge className="bg-green-100 text-green-700">All Systems Connected</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Salesforce CRM</span>
                      </div>
                      <span className="text-xs text-green-600">Synced 2 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Shopify Store</span>
                      </div>
                      <span className="text-xs text-blue-600">Synced 1 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Mailchimp</span>
                      </div>
                      <span className="text-xs text-purple-600">Synced 30 sec ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">QuickBooks</span>
                      </div>
                      <span className="text-xs text-yellow-600">Syncing...</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Today's Activity</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Data Synced:</span> 2.4k records</div>
                      <div><span className="font-medium">API Calls:</span> 15,247</div>
                      <div><span className="font-medium">Integrations:</span> 8 active</div>
                      <div><span className="font-medium">Errors:</span> 0</div>
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
              Enterprise-Grade API Integration Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for reliability, security, and scale - our integrations handle millions of API calls daily
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Integration Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Integration Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect the tools you already use to create powerful automated workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {integrationTypes.map((integration, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span>{integration.type}</span>
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Key Benefits:</h4>
                      <div className="space-y-1">
                        {integration.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Supported Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {integration.platforms.map((platform, platformIndex) => (
                          <Badge key={platformIndex} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Platforms Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              500+ Platforms Supported
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We integrate with all major business platforms and can connect to any system with an API
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {popularPlatforms.map((platform, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors">
                <span className="text-sm font-medium">{platform}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your platform? We can integrate with any system that has an API.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Request Custom Integration
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Integration Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From planning to deployment - we handle every step of your integration project
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Discovery & Planning',
                description: 'Analyze your systems and design the optimal integration architecture'
              },
              {
                step: '2',
                title: 'Development & Testing',
                description: 'Build secure, reliable integrations with comprehensive testing'
              },
              {
                step: '3',
                title: 'Deployment & Migration',
                description: 'Deploy integrations with zero downtime and data migration'
              },
              {
                step: '4',
                title: 'Monitoring & Support',
                description: 'Ongoing monitoring, maintenance, and optimization'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-cyan-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Connect Your Systems?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Stop working in silos. Create seamless workflows that connect all your business tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Integration Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-4 text-lg">
              Explore Integrations
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default APIIntegrations;
