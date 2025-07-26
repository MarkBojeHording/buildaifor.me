import { FileText, Scan, Database, Clock, ArrowLeft, CheckCircle, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DocumentProcessing = () => {
  const features = [
    {
      icon: Scan,
      title: 'OCR Technology',
      description: 'Extract text from scanned documents, PDFs, and images with 99%+ accuracy'
    },
    {
      icon: Database,
      title: 'Data Extraction',
      description: 'Automatically identify and extract key information like dates, amounts, and names'
    },
    {
      icon: FileText,
      title: 'Document Classification',
      description: 'Automatically categorize documents by type, priority, and content'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process documents instantly as they arrive via email, upload, or API'
    }
  ];

  const documentTypes = [
    {
      type: 'Invoices & Receipts',
      description: 'Extract vendor info, amounts, dates, and line items automatically',
      accuracy: '99.2%',
      timeReduction: '85%'
    },
    {
      type: 'Contracts & Agreements',
      description: 'Identify key terms, dates, parties, and compliance requirements',
      accuracy: '97.8%',
      timeReduction: '90%'
    },
    {
      type: 'Forms & Applications',
      description: 'Process customer forms, applications, and survey responses',
      accuracy: '98.5%',
      timeReduction: '95%'
    },
    {
      type: 'Legal Documents',
      description: 'Extract case details, dates, parties, and legal references',
      accuracy: '96.9%',
      timeReduction: '80%'
    }
  ];

  const workflow = [
    {
      step: '1',
      title: 'Document Upload',
      description: 'Documents arrive via email, web upload, or API integration'
    },
    {
      step: '2',
      title: 'AI Processing',
      description: 'OCR extracts text, AI identifies and categorizes key information'
    },
    {
      step: '3',
      title: 'Data Validation',
      description: 'Automated validation checks ensure accuracy and completeness'
    },
    {
      step: '4',
      title: 'System Integration',
      description: 'Extracted data flows directly into your existing systems'
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
                <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Document Processing & Analysis
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Paper Into
                  <span className="text-blue-600"> Actionable Data </span>
                  Instantly
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Eliminate manual data entry forever. Our AI-powered document processing
                  extracts, validates, and organizes information from any document type with 99%+ accuracy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Process Documents Now
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  See Live Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99%+</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Processing</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Document Processing</h3>
                    <Badge className="bg-green-100 text-green-700">Processing</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Invoice_2024_001.pdf</div>
                        <div className="text-xs text-gray-500">Extracting data...</div>
                      </div>
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-800 mb-2">✓ Extraction Complete</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="font-medium">Vendor:</span> ABC Corp</div>
                        <div><span className="font-medium">Amount:</span> $1,250.00</div>
                        <div><span className="font-medium">Date:</span> 2024-01-15</div>
                        <div><span className="font-medium">Invoice #:</span> INV-001</div>
                      </div>
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
              Advanced AI-Powered Document Processing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our technology handles any document format and extracts structured data automatically
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Document Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We Process Every Document Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From invoices to contracts, our AI handles all your document processing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {documentTypes.map((doc, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span>{doc.type}</span>
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{doc.accuracy}</div>
                      <div className="text-xs text-blue-700">Accuracy</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{doc.timeReduction}</div>
                      <div className="text-xs text-green-700">Time Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, automated workflow that transforms documents into structured data
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {index < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-blue-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop Manual Data Entry Today
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Process thousands of documents automatically and eliminate human error forever
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Processing Documents
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg">
              Upload Test Document
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DocumentProcessing;
