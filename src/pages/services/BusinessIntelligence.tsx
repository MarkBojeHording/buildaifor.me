import { BarChart3, TrendingUp, Eye, Zap, ArrowLeft, CheckCircle, Star, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BusinessIntelligence = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Dashboards',
      description: 'Live data visualization with interactive charts and KPI tracking'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'AI-powered forecasting and trend analysis for better decision making'
    },
    {
      icon: Eye,
      title: 'Data Visualization',
      description: 'Transform complex data into clear, actionable visual insights'
    },
    {
      icon: Zap,
      title: 'Automated Reporting',
      description: 'Generate and distribute reports automatically on schedule'
    }
  ];

  const dashboardTypes = [
    {
      type: 'Sales Performance Dashboard',
      description: 'Track revenue, pipeline, conversion rates, and sales team performance',
      metrics: ['Revenue tracking', 'Pipeline analysis', 'Conversion rates', 'Team performance'],
      roi: '35% increase in sales efficiency'
    },
    {
      type: 'Marketing Analytics Dashboard',
      description: 'Monitor campaign performance, lead generation, and customer acquisition',
      metrics: ['Campaign ROI', 'Lead generation', 'Customer acquisition cost', 'Attribution analysis'],
      roi: '40% improvement in marketing ROI'
    },
    {
      type: 'Financial Intelligence Dashboard',
      description: 'Real-time financial metrics, cash flow, and profitability analysis',
      metrics: ['Cash flow tracking', 'Profit margins', 'Expense analysis', 'Budget vs actual'],
      roi: '25% reduction in financial reporting time'
    },
    {
      type: 'Operations Dashboard',
      description: 'Monitor operational efficiency, inventory, and supply chain metrics',
      metrics: ['Inventory levels', 'Supply chain tracking', 'Efficiency metrics', 'Quality scores'],
      roi: '30% improvement in operational efficiency'
    }
  ];

  const dataVisualizationTypes = [
    'Interactive Charts & Graphs',
    'Real-time KPI Widgets',
    'Geographic Heat Maps',
    'Trend Analysis Lines',
    'Comparative Bar Charts',
    'Pie Charts & Donut Charts',
    'Gauge & Meter Displays',
    'Custom Data Tables'
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
                <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Business Intelligence Tools
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Data Into
                  <span className="text-blue-600"> Strategic Insights </span>
                  That Drive Growth
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop guessing and start knowing. Our AI-powered business intelligence tools
                  turn your data into clear, actionable insights that drive better decisions and faster growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Build My Dashboard
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Live Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Real-time</div>
                  <div className="text-sm text-gray-600">Data Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Data Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">AI-Powered</div>
                  <div className="text-sm text-gray-600">Insights</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Sales Dashboard</h3>
                    <Badge className="bg-green-100 text-green-700">Live Data</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">$127K</div>
                      <div className="text-xs text-blue-700">Monthly Revenue</div>
                      <div className="text-xs text-green-600">↑ 23% vs last month</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <div className="text-xs text-green-700">New Customers</div>
                      <div className="text-xs text-green-600">↑ 15% vs last month</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Sales Pipeline</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Qualified Leads</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Proposals Sent</span>
                        <span>43%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '43%' }}></div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Closed Won</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-gray-500">Last updated: 2 minutes ago</div>
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
              Advanced Business Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by AI and designed for business users - no technical expertise required
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Dashboard Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Custom Dashboards for Every Department
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built templates and custom solutions for all your business intelligence needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dashboardTypes.map((dashboard, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dashboard.type}</span>
                    <Badge className="bg-green-100 text-green-700">
                      {dashboard.roi}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dashboard.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Rich Data Visualization Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from dozens of chart types and visualization options to tell your data story
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {dataVisualizationTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-emerald-50 transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom visualization? We can create any chart type you need.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Request Custom Visualization
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our BI Solutions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for business users, powered by AI, and designed for growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">AI</span>
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our AI automatically identifies trends, anomalies, and opportunities in your data,
                  providing insights you might miss with traditional reporting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Real-time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get up-to-the-minute insights with real-time data connections.
                  Make decisions based on current information, not yesterday's reports.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle>User-Friendly Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No technical expertise required. Our intuitive dashboards are designed
                  for business users to explore data and find insights independently.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Unlock Your Data's Potential?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Transform your business with AI-powered insights and real-time dashboards that drive better decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Build My Dashboard
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessIntelligence;
