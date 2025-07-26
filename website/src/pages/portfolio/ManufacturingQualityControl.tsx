import { Factory, Eye, Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowLeft, Zap, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ManufacturingQualityControl = () => {
  const qualityMetrics = [
    { label: 'Defect Detection Rate', value: '99.5%', description: 'Accuracy in identifying defects' },
    { label: 'Quality Check Speed', value: '50% faster', description: 'Compared to manual inspection' },
    { label: 'False Positives', value: '< 0.1%', description: 'Minimal incorrect rejections' },
    { label: 'Cost Reduction', value: '35%', description: 'In quality control operations' }
  ];

  const inspectionResults = [
    {
      productId: 'PCB-2024-001',
      status: 'pass',
      confidence: 98.7,
      defects: 0,
      timestamp: '2 min ago'
    },
    {
      productId: 'PCB-2024-002',
      status: 'fail',
      confidence: 99.2,
      defects: 2,
      timestamp: '3 min ago',
      defectTypes: ['Solder bridge', 'Missing component']
    },
    {
      productId: 'PCB-2024-003',
      status: 'pass',
      confidence: 97.4,
      defects: 0,
      timestamp: '5 min ago'
    },
    {
      productId: 'PCB-2024-004',
      status: 'warning',
      confidence: 89.1,
      defects: 1,
      timestamp: '7 min ago',
      defectTypes: ['Minor scratch']
    }
  ];

  const defectTypes = [
    {
      type: 'Surface Defects',
      description: 'Scratches, dents, discoloration, and surface irregularities',
      detectionRate: '99.8%',
      examples: ['Scratches', 'Dents', 'Discoloration', 'Surface cracks']
    },
    {
      type: 'Dimensional Issues',
      description: 'Size, shape, and measurement deviations from specifications',
      detectionRate: '99.2%',
      examples: ['Oversized parts', 'Undersized components', 'Shape distortion', 'Alignment issues']
    },
    {
      type: 'Assembly Defects',
      description: 'Missing components, incorrect placement, and assembly errors',
      detectionRate: '99.6%',
      examples: ['Missing parts', 'Wrong orientation', 'Loose connections', 'Incorrect assembly']
    },
    {
      type: 'Material Defects',
      description: 'Material quality issues, contamination, and composition problems',
      detectionRate: '98.9%',
      examples: ['Contamination', 'Material flaws', 'Composition errors', 'Purity issues']
    }
  ];

  const productionStats = [
    { label: 'Units Inspected Today', value: '2,847' },
    { label: 'Defects Detected', value: '23' },
    { label: 'Pass Rate', value: '99.2%' },
    { label: 'Average Inspection Time', value: '1.2s' }
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
                <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Factory className="w-4 h-4 mr-2" />
                  Manufacturing Quality Control
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Quality Inspection </span>
                  at Production Speed
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionize your quality control with computer vision that detects defects
                  faster and more accurately than human inspectors - ensuring perfect products
                  while reducing costs and waste.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-orange-600">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Deploy Quality AI
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Live Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Quality Inspection Dashboard</h3>
                    <Badge className="bg-green-100 text-green-700">Live Monitoring</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">99.2%</div>
                      <div className="text-xs text-green-700">Pass Rate Today</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">2,847</div>
                      <div className="text-xs text-blue-700">Units Inspected</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recent Inspections</div>
                    {inspectionResults.slice(0, 3).map((result, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        result.status === 'pass' ? 'bg-green-50 border-green-200' :
                        result.status === 'fail' ? 'bg-red-50 border-red-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{result.productId}</span>
                          <div className="flex items-center space-x-2">
                            {result.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {result.status === 'fail' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            <span className="text-xs">{result.confidence}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{result.timestamp}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Production Summary</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Avg Speed:</span> 1.2s/unit</div>
                      <div><span className="font-medium">Defects:</span> 23 found</div>
                      <div><span className="font-medium">Accuracy:</span> 99.5%</div>
                      <div><span className="font-medium">Uptime:</span> 99.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Results */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real-Time Quality Inspection Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI system identifies defects with superhuman accuracy and speed
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-6 h-6 text-orange-600" />
                <span>Live Inspection Feed</span>
              </CardTitle>
              <CardDescription>
                Real-time quality control results from the production line
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspectionResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        result.status === 'pass' ? 'bg-green-100' :
                        result.status === 'fail' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {result.status === 'pass' && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {result.status === 'fail' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                        {result.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                      </div>
                      <div>
                        <div className="font-medium">{result.productId}</div>
                        <div className="text-sm text-gray-600">
                          {result.defects} defect{result.defects !== 1 ? 's' : ''} detected • {result.timestamp}
                        </div>
                        {result.defectTypes && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.defectTypes.map((defect, defectIndex) => (
                              <Badge key={defectIndex} variant="outline" className="text-xs">
                                {defect}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{result.confidence}%</div>
                      <div className="text-sm text-gray-600">Confidence</div>
                      <Badge className={`mt-1 ${
                        result.status === 'pass' ? 'bg-green-100 text-green-700' :
                        result.status === 'fail' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Defect Detection Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Defect Detection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI identifies every type of manufacturing defect with industry-leading accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {defectTypes.map((defectType, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{defectType.type}</span>
                    <Badge className="bg-green-100 text-green-700">
                      {defectType.detectionRate} accurate
                    </Badge>
                  </CardTitle>
                  <CardDescription>{defectType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Common Examples:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {defectType.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center space-x-2">
                          <Eye className="w-3 h-3 text-orange-500" />
                          <span className="text-sm text-gray-600">{example}</span>
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

      {/* Production Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Production Line Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time metrics showing the impact of AI-powered quality control
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {productionStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-orange-600">{stat.value}</CardTitle>
                  <CardDescription className="font-medium">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle>99.5% Detection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Industry-leading accuracy in defect detection, surpassing human
                  inspection capabilities while maintaining consistent performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle>50% Faster Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dramatically faster than manual inspection while maintaining
                  higher accuracy, enabling real-time quality control at production speed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Zero False Positives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Minimal false positives reduce waste and ensure good products
                  aren't unnecessarily rejected, optimizing production efficiency.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Perfect Your Quality Control?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join manufacturers who are achieving perfect quality while reducing costs
            with AI-powered visual inspection systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-yellow-700 hover:bg-gray-100 px-8 py-4 text-lg">
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-700 px-8 py-4 text-lg">
              View Case Study
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManufacturingQualityControl;
