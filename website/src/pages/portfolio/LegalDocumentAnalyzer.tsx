import { Scale, FileText, AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowLeft, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const LegalDocumentAnalyzer = () => {
  const analysisResults = [
    {
      category: 'Contract Terms',
      items: [
        { term: 'Payment Terms', status: 'compliant', details: '30-day payment terms identified' },
        { term: 'Termination Clause', status: 'warning', details: 'Requires 90-day notice period' },
        { term: 'Liability Cap', status: 'compliant', details: 'Limited to contract value' },
        { term: 'Intellectual Property', status: 'risk', details: 'Broad IP assignment clause detected' }
      ]
    },
    {
      category: 'Compliance Check',
      items: [
        { term: 'GDPR Compliance', status: 'compliant', details: 'Data protection clauses present' },
        { term: 'Jurisdiction', status: 'compliant', details: 'Delaware state law applies' },
        { term: 'Force Majeure', status: 'warning', details: 'Limited force majeure coverage' }
      ]
    }
  ];

  const keyMetrics = [
    { label: 'Processing Time', value: '2.3 seconds', change: '95% faster than manual' },
    { label: 'Accuracy Rate', value: '97.8%', change: 'Validated against legal experts' },
    { label: 'Risk Items Found', value: '3', change: '2 high priority' },
    { label: 'Compliance Score', value: '87%', change: 'Above industry average' }
  ];

  const documentSections = [
    { section: 'Executive Summary', pages: '1-2', status: 'analyzed' },
    { section: 'Terms & Conditions', pages: '3-8', status: 'analyzed' },
    { section: 'Payment Terms', pages: '9-10', status: 'analyzed' },
    { section: 'Liability & Insurance', pages: '11-12', status: 'analyzed' },
    { section: 'Termination Clauses', pages: '13-14', status: 'analyzed' },
    { section: 'Appendices', pages: '15-18', status: 'analyzed' }
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
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal Document Analyzer
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Contract Analysis </span>
                  & Risk Assessment
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Automatically analyze contracts, identify risks, and ensure compliance with
                  our advanced legal document processing system. Process hundreds of contracts
                  in minutes, not days.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-green-600">{metric.change}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Try Document Analysis
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Download Sample Report
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Contract Analysis Results</h3>
                    <Badge className="bg-green-100 text-green-700">Analysis Complete</Badge>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Service Agreement - ABC Corp</span>
                      <Eye className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-600 mb-3">18 pages • Analyzed in 2.3 seconds</div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Overall Risk Score</span>
                        <span className="font-medium">Medium (87/100)</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Payment Terms Compliant</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">Low Risk</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">Termination Notice Period</span>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium Risk</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-sm">IP Assignment Clause</span>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-600">High Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Sections Analysis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Detailed Document Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes every section of your contract to identify key terms, risks, and compliance issues
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>Document Structure</span>
                </CardTitle>
                <CardDescription>
                  Automatically identified sections and their analysis status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentSections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{section.section}</div>
                        <div className="text-xs text-gray-600">Pages {section.pages}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {section.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {analysisResults.map((category, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {item.status === 'compliant' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                              {item.status === 'risk' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                              <span className="font-medium text-sm">{item.term}</span>
                            </div>
                            <div className="text-xs text-gray-600">{item.details}</div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${
                              item.status === 'compliant' ? 'text-green-600 border-green-600' :
                              item.status === 'warning' ? 'text-yellow-600 border-yellow-600' :
                              'text-red-600 border-red-600'
                            }`}
                          >
                            {item.status === 'compliant' ? 'Compliant' :
                             item.status === 'warning' ? 'Review' : 'Risk'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features & Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive contract analysis powered by advanced AI and legal expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle>95% Time Reduction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Analyze contracts in seconds instead of hours. Process hundreds of documents
                  while your legal team focuses on high-value strategic work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle>97.8% Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Validated against legal experts, our AI identifies risks and compliance
                  issues with industry-leading accuracy and reliability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>70% Cost Savings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Reduce legal review costs while improving consistency and thoroughness
                  of contract analysis across your organization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Contract Review Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join law firms and legal departments using AI to analyze contracts faster,
            more accurately, and at a fraction of the cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100 px-8 py-4 text-lg">
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-700 px-8 py-4 text-lg">
              View Case Study
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalDocumentAnalyzer;
