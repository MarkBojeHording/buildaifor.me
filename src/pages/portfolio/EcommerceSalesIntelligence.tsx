import { ShoppingCart, TrendingUp, BarChart3, Target, DollarSign, Package, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const EcommerceSalesIntelligence = () => {
  const salesMetrics = [
    { label: 'Revenue Growth', value: '+25%', trend: 'up', period: 'vs last quarter' },
    { label: 'Conversion Rate', value: '4.2%', trend: 'up', period: '+0.8% this month' },
    { label: 'Average Order Value', value: '$127', trend: 'up', period: '+$23 vs last month' },
    { label: 'Customer Lifetime Value', value: '$890', trend: 'up', period: '+15% this quarter' }
  ];

  const topProducts = [
    { name: 'Wireless Headphones Pro', sales: 1247, revenue: '$124,700', trend: '+23%' },
    { name: 'Smart Fitness Tracker', sales: 892, revenue: '$89,200', trend: '+18%' },
    { name: 'Bluetooth Speaker Mini', sales: 756, revenue: '$45,360', trend: '+12%' },
    { name: 'USB-C Fast Charger', sales: 634, revenue: '$31,700', trend: '+8%' },
    { name: 'Phone Case Premium', sales: 523, revenue: '$15,690', trend: '+5%' }
  ];

  const inventoryAlerts = [
    { product: 'Wireless Headphones Pro', status: 'low', stock: 23, reorderPoint: 50, action: 'Reorder Now' },
    { product: 'Smart Watch Series 5', status: 'critical', stock: 8, reorderPoint: 25, action: 'Urgent Reorder' },
    { product: 'Bluetooth Speaker', status: 'optimal', stock: 156, reorderPoint: 75, action: 'Monitor' }
  ];

  const customerSegments = [
    { segment: 'High-Value Customers', count: 1247, revenue: '$234,500', avgOrder: '$188' },
    { segment: 'Frequent Buyers', count: 3456, revenue: '$189,200', avgOrder: '$55' },
    { segment: 'New Customers', count: 892, revenue: '$67,400', avgOrder: '$76' },
    { segment: 'At-Risk Customers', count: 234, revenue: '$23,400', avgOrder: '$100' }
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
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  E-commerce Sales Intelligence
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Sales Analytics </span>
                  & Inventory Optimization
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your e-commerce business with predictive analytics that optimize
                  inventory, boost sales, and maximize customer lifetime value through
                  intelligent insights and automation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {salesMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-green-600">{metric.period}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  View Live Dashboard
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Download Report
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Sales Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-700">Live Data</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">$47.2K</div>
                      <div className="text-xs text-blue-700">Today's Revenue</div>
                      <div className="text-xs text-green-600">↑ 18% vs yesterday</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">234</div>
                      <div className="text-xs text-green-700">Orders Today</div>
                      <div className="text-xs text-green-600">↑ 12% vs yesterday</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Top Performing Products</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Wireless Headphones Pro</span>
                        <span className="font-medium">$12.4K</span>
                      </div>
                      <Progress value={85} className="h-1" />

                      <div className="flex justify-between text-xs">
                        <span>Smart Fitness Tracker</span>
                        <span className="font-medium">$8.9K</span>
                      </div>
                      <Progress value={65} className="h-1" />

                      <div className="flex justify-between text-xs">
                        <span>Bluetooth Speaker Mini</span>
                        <span className="font-medium">$4.5K</span>
                      </div>
                      <Progress value={35} className="h-1" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Inventory Alert</span>
                    </div>
                    <div className="text-xs text-yellow-700">2 products need reordering</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Products Analysis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Product Performance Analytics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time insights into your best-performing products and sales trends
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Top Performing Products</span>
              </CardTitle>
              <CardDescription>
                Products ranked by revenue performance this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.sales} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{product.revenue}</div>
                      <div className="text-sm text-green-600">{product.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inventory Management */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Inventory Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered inventory optimization prevents stockouts and reduces carrying costs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-6 h-6 text-orange-600" />
                  <span>Inventory Alerts</span>
                </CardTitle>
                <CardDescription>
                  Products requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      alert.status === 'critical' ? 'bg-red-50 border-red-200' :
                      alert.status === 'low' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{alert.product}</div>
                        <Badge className={
                          alert.status === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Current Stock: {alert.stock} units (Reorder at: {alert.reorderPoint})
                      </div>
                      <Button size="sm" className={
                        alert.status === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                        alert.status === 'low' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-green-600 hover:bg-green-700'
                      }>
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span>Customer Segments</span>
                </CardTitle>
                <CardDescription>
                  Customer analysis and targeting opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{segment.segment}</div>
                        <div className="text-sm text-gray-600">{segment.count} customers</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Revenue</div>
                          <div className="font-bold text-green-600">{segment.revenue}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Order Value</div>
                          <div className="font-bold text-blue-600">{segment.avgOrder}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from AI-powered e-commerce intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle>25% Revenue Increase</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimized pricing, inventory, and customer targeting strategies
                  resulted in significant revenue growth within 3 months.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <CardTitle>30% Inventory Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reduced carrying costs and eliminated stockouts through
                  predictive inventory management and demand forecasting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Real-time Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Make data-driven decisions with live dashboards and automated
                  alerts that keep you ahead of market trends and opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Optimize Your E-commerce Business?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join successful e-commerce businesses using AI to boost sales,
            optimize inventory, and maximize customer value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 text-lg">
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg">
              View Case Study
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EcommerceSalesIntelligence;
