import { Brain, Search, BookOpen, Zap, ArrowLeft, CheckCircle, Star, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import Header from '../../components/Header.tsx';
import Footer from '../../components/Footer.tsx';

const RAGSystems = () => {
  const features = [
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find relevant information instantly across all your documents and knowledge bases'
    },
    {
      icon: BookOpen,
      title: 'Contextual Responses',
      description: 'Get accurate, context-aware answers based on your specific business knowledge'
    },
    {
      icon: FileText,
      title: 'Document Integration',
      description: 'Connect PDFs, Word docs, databases, and any text-based content'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Automatically incorporate new documents and information as they become available'
    }
  ];

  const useCases = [
    {
      type: 'Customer Support Knowledge Base',
      description: 'Instant access to product manuals, FAQs, and troubleshooting guides',
      benefits: ['Faster resolution times', 'Consistent answers', 'Reduced training time'],
      accuracy: '99.2%'
    },
    {
      type: 'Legal Document Research',
      description: 'Search through contracts, regulations, and case law for relevant information',
      benefits: ['Rapid case research', 'Compliance checking', 'Risk assessment'],
      accuracy: '97.8%'
    },
    {
      type: 'Technical Documentation',
      description: 'Query engineering docs, API references, and technical specifications',
      benefits: ['Developer productivity', 'Onboarding acceleration', 'Knowledge retention'],
      accuracy: '98.5%'
    },
    {
      type: 'Company Policy Assistant',
      description: 'Instant answers about HR policies, procedures, and company guidelines',
      benefits: ['Policy compliance', 'HR efficiency', 'Employee self-service'],
      accuracy: '99.1%'
    }
  ];

  const documentTypes = [
    'PDFs and Word Documents',
    'Web Pages and Wikis',
    'Database Records',
    'Spreadsheets and CSV Files',
    'Email Archives',
    'Confluence and Notion Pages',
    'SharePoint Documents',
    'Custom Knowledge Bases'
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
                <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Brain className="w-4 h-4 mr-2" />
                  RAG Systems
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Your Documents Into
                  <span className="text-blue-600"> Intelligent Answers </span>
                  Instantly
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop searching through endless documents. Our RAG (Retrieval-Augmented Generation)
                  systems understand your content and provide instant, accurate answers to any question.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Build My Knowledge Base
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Try Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">10x</div>
                  <div className="text-sm text-gray-600">Faster Search</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Knowledge Assistant</h3>
                    <Badge className="bg-green-100 text-green-700">Online</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">Question:</div>
                      <div className="text-sm text-gray-700">"What's our refund policy for digital products?"</div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-800 mb-2">Answer:</div>
                      <div className="text-sm text-blue-700">
                        "Digital products can be refunded within 30 days of purchase if the customer hasn't downloaded or accessed the content. Refunds are processed within 5-7 business days..."
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        📄 Source: Customer Service Policy v2.3, Section 4.2
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Response time: 0.8 seconds</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Knowledge Base Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Documents:</span> 1,247</div>
                      <div><span className="font-medium">Queries Today:</span> 89</div>
                      <div><span className="font-medium">Accuracy:</span> 99.2%</div>
                      <div><span className="font-medium">Avg Response:</span> 0.9s</div>
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
              Advanced RAG Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our RAG systems combine the power of large language models with your specific business knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven RAG Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how organizations are using RAG systems to unlock the value in their knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{useCase.type}</span>
                    <Badge className="bg-green-100 text-green-700">
                      {useCase.accuracy} accurate
                    </Badge>
                  </CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Benefits:</h4>
                    {useCase.benefits.map((benefit, benefitIndex) => (
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

      {/* Document Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Any Document Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our RAG systems can process and understand virtually any text-based content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {documentTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-indigo-50 transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Have a custom format? We can integrate with any text-based system.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Discuss Custom Integration
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How RAG Systems Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the technology behind intelligent document search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <CardTitle>Document Ingestion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Your documents are processed, chunked, and converted into searchable vector embeddings that capture semantic meaning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <CardTitle>Intelligent Retrieval</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  When you ask a question, the system finds the most relevant document sections using advanced similarity search.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <CardTitle>Answer Generation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  AI generates accurate, contextual answers based on the retrieved information, citing specific sources.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Knowledge Assistant?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Transform your documents into an intelligent knowledge base that answers questions instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 text-lg">
              Start RAG Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RAGSystems;
