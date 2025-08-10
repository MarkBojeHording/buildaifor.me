import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import {
  Search,
  FileText,
  Code,
  Brain,
  Sparkles,
  Star,
  Clock,
  TrendingUp,
  Loader2,
  Copy,
  ExternalLink,
  Database,
  Shield,
  Settings,
  Check,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';

// Types
interface SearchResult {
  id: string;
  title: string;
  confidence: number;
  description: string;
  codeBlock: {
    language: string;
    code: string;
    emoji: string;
  };
  source: {
    document: string;
    section: string;
  };
}

interface Document {
  id: string;
  name: string;
  description: string;
  size: string;
  sections: number;
  status: 'processed' | 'processing';
  lastUpdated: string;
}

interface SearchTerm {
  term: string;
  percentage: number;
}

interface DocumentPerformance {
  name: string;
  performance: number;
  searches: number;
}

// Sample data
const sampleSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'API Key Authentication',
    confidence: 94,
    description: 'Learn how to authenticate API requests using API keys. This method is the simplest form of authentication and is suitable for server-to-server communication.',
    codeBlock: {
      language: 'JavaScript',
      code: `// Initialize the API client with your API key
const apiClient = new APIClient({
  apiKey: 'your-api-key-here',
  baseURL: 'https://api.example.com'
});

// Make authenticated requests
const response = await apiClient.get('/users', {
  headers: {
    'Authorization': \`Bearer \${apiClient.apiKey}\`
  }
});

console.log('User data:', response.data);`,
      emoji: '🟨'
    },
    source: {
      document: 'Authentication Guide',
      section: 'API Key Authentication'
    }
  },
  {
    id: '2',
    title: 'OAuth 2.0 Implementation',
    confidence: 89,
    description: 'Implement OAuth 2.0 flow for user authentication. This provides secure access to user resources with proper authorization scopes.',
    codeBlock: {
      language: 'HTTP',
      code: `POST /oauth/token HTTP/1.1
Host: api.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=your_client_id
&client_secret=your_client_secret
&code=authorization_code
&redirect_uri=https://your-app.com/callback

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200..."
}`,
      emoji: '🌐'
    },
    source: {
      document: 'Authentication Guide',
      section: 'OAuth 2.0 Flow'
    }
  },
  {
    id: '3',
    title: 'Rate Limiting Headers',
    confidence: 87,
    description: 'Handle rate limiting by checking response headers and implementing exponential backoff for retries.',
    codeBlock: {
      language: 'JavaScript',
      code: `async function makeRateLimitedRequest(url, options = {}) {
  const response = await fetch(url, options);

  // Check rate limit headers
  const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
  const rateLimitReset = response.headers.get('X-RateLimit-Reset');

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    await new Promise(resolve =>
      setTimeout(resolve, parseInt(retryAfter) * 1000)
    );
    return makeRateLimitedRequest(url, options);
  }

  return response;
}

// Usage
const data = await makeRateLimitedRequest('/api/users');`,
      emoji: '🟨'
    },
    source: {
      document: 'REST API Reference',
      section: 'Rate Limiting'
    }
  }
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Authentication Guide',
    description: 'Complete guide to API authentication methods including API keys, OAuth 2.0, and JWT tokens.',
    size: '2.1 MB',
    sections: 15,
    status: 'processed',
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    name: 'REST API Reference',
    description: 'Comprehensive API documentation with all endpoints, parameters, and response formats.',
    size: '4.3 MB',
    sections: 42,
    status: 'processed',
    lastUpdated: '1 day ago'
  },
  {
    id: '3',
    name: 'Webhook Integration',
    description: 'Step-by-step guide for setting up and handling webhook events in your application.',
    size: '1.8 MB',
    sections: 12,
    status: 'processed',
    lastUpdated: '3 days ago'
  },
  {
    id: '4',
    name: 'Error Handling Guide',
    description: 'Best practices for handling API errors and implementing proper error responses.',
    size: '1.2 MB',
    sections: 8,
    status: 'processing',
    lastUpdated: '5 minutes ago'
  }
];

const popularSearchTerms: SearchTerm[] = [
  { term: 'Authentication methods', percentage: 85 },
  { term: 'API rate limits', percentage: 70 },
  { term: 'Webhook setup', percentage: 55 },
  { term: 'Error handling', percentage: 40 },
  { term: 'Code examples', percentage: 25 }
];

const documentPerformance: DocumentPerformance[] = [
  { name: 'Authentication Guide', performance: 94, searches: 1247 },
  { name: 'REST API Reference', performance: 89, searches: 892 },
  { name: 'Webhook Integration', performance: 87, searches: 445 },
  { name: 'Error Handling Guide', performance: 82, searches: 223 }
];

const sampleQueries = [
  'How do I authenticate API requests?',
  'What webhook events are available?',
  'How do I handle rate limiting?',
  'Show me user creation endpoint'
];

const TechnicalDocumentationRAG: React.FC = () => {
  const navigate = useNavigate();
  useScrollToTop(); // Scroll to top when component mounts

  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<{document: string, section: string} | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Real AI analysis using OpenAI
      const response = await axios.post('/api/analyze-documentation', {
        query: searchQuery,
        documents: [
          {
            title: 'Authentication Guide',
            content: 'API Key Authentication: Initialize the API client with your API key. This method is the simplest form of authentication and is suitable for server-to-server communication. OAuth 2.0 Implementation: Implement OAuth 2.0 flow for user authentication. This provides secure access to user resources with proper authorization scopes.'
          },
          {
            title: 'REST API Reference',
            content: 'Rate Limiting Headers: Handle rate limiting by checking response headers and implementing exponential backoff for retries. User Creation Endpoint: POST /users endpoint for creating new user accounts with validation and error handling.'
          },
          {
            title: 'Webhook Integration',
            content: 'Webhook Events: Available events include user.created, user.updated, payment.succeeded, payment.failed. Webhook Setup: Configure webhook endpoints with proper authentication and signature verification.'
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Transform AI response to our format
      const aiResults = response.data.results.map((result: any, index: number) => {
        // Handle the case where AI returns JSON in description
        let parsedResult = result;
        if (result.description && result.description.includes('```json')) {
          try {
            const jsonMatch = result.description.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[1]);
              if (Array.isArray(parsed) && parsed.length > 0) {
                parsedResult = parsed[0]; // Take the first result
              }
            }
          } catch (e) {
            console.log('Failed to parse JSON from AI response');
          }
        }

        return {
          id: (index + 1).toString(),
          title: parsedResult.title || result.title,
          confidence: Math.round((parsedResult.confidence || result.confidence) * 100),
          description: parsedResult.description || result.description,
          codeBlock: {
            language: parsedResult.codeBlock?.language || result.codeBlock?.language || 'JavaScript',
            code: parsedResult.codeBlock?.code || result.codeBlock?.code || '// Code example will be generated based on the query',
            emoji: parsedResult.codeBlock?.emoji || result.codeBlock?.emoji || '🟨'
          },
          source: {
            document: parsedResult.source?.document || result.source?.document || 'Technical Documentation',
            section: parsedResult.source?.section || result.source?.section || 'General'
          }
        };
      });

      setSearchResults(aiResults);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to sample results if AI fails
      setSearchResults(sampleSearchResults);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  const copyToClipboard = async (code: string, resultId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(resultId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleViewSource = (source: {document: string, section: string}) => {
    setSelectedSource(source);
    setShowSourceModal(true);
  };

  const handleOpenFullDocument = (documentName: string) => {
    // In a real implementation, this would open the actual document
    // For now, we'll show an alert with the document info
    alert(`Opening full document: ${documentName}\n\nIn a real implementation, this would:\n- Open the complete document in a new tab\n- Show all sections and content\n- Allow navigation between sections\n- Provide search functionality within the document`);
  };

  const handleViewDocumentation = (documentName: string) => {
    // In a real implementation, this would open the documentation
    // For now, we'll show an alert with the document info
    alert(`Viewing documentation: ${documentName}\n\nIn a real implementation, this would:\n- Open the documentation in a new tab\n- Show the full document structure\n- Allow browsing through all sections\n- Provide interactive navigation`);
  };

  const handleSearchContent = (documentName: string) => {
    // In a real implementation, this would open a search interface
    // For now, we'll show an alert with the search info
    alert(`Searching content in: ${documentName}\n\nIn a real implementation, this would:\n- Open a search interface for this document\n- Allow searching within the document content\n- Show search results with context\n- Provide advanced search filters`);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100';
    if (confidence >= 80) return 'bg-yellow-100';
    return 'bg-orange-100';
  };

  const stats = [
    { label: 'Documents Indexed', value: '1,247', icon: FileText, color: 'text-blue-600' },
    { label: 'Code Snippets', value: '3,892', icon: Code, color: 'text-green-600' },
    { label: 'Search Accuracy', value: '94.2%', icon: Star, color: 'text-purple-600' },
    { label: 'Avg Response Time', value: '0.6s', icon: Clock, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              // Clear saved scroll position for home page before navigating
              const savedPositions = sessionStorage.getItem('scrollPositions');
              if (savedPositions) {
                try {
                  const positions = JSON.parse(savedPositions);
                  delete positions['/'];
                  sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
                } catch (error) {
                  console.warn('Failed to clear scroll position:', error);
                }
              }
              navigate('/');
            }}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to AI Solutions
          </Button>
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Code className="w-4 h-4 mr-2" />
              Technical Documentation RAG
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Code Documentation Search
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Brain className="w-3 h-3 mr-1" />
                Vector Search
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intelligent Technical Documentation Search
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your technical docs and get instant, AI-powered answers with code examples
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="search" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>AI Search</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Documents</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Insights</span>
                </TabsTrigger>
              </TabsList>

              {/* AI Search Tab */}
              <TabsContent value="search" className="space-y-8">
                {/* Search Input */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask anything about your technical documentation..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          disabled={isSearching}
                        />
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Sample Queries */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Try these queries:</h3>
                      <div className="flex flex-wrap gap-2">
                        {sampleQueries.map((query, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(query);
                              setTimeout(() => handleSearch(), 100);
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loading State */}
                {isSearching && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                        <span className="text-lg text-gray-700">Analyzing documentation with vector embeddings...</span>
                      </div>
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    </CardContent>
                  </Card>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && !isSearching && (
                  <div className="space-y-6">
                    {searchResults.map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{result.title}</h3>
                            <Badge
                              className={`${getConfidenceBgColor(result.confidence)} ${getConfidenceColor(result.confidence)}`}
                            >
                              {result.confidence}% match
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-6">{result.description}</p>

                          {/* Code Block */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{result.codeBlock.emoji}</span>
                                <span className="text-gray-700 font-medium">{result.codeBlock.language}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.codeBlock.code, result.id)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                {copiedCodeId === result.id ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                            <pre className="text-gray-800 text-sm overflow-x-auto bg-white rounded border p-3">
                              <code>{result.codeBlock.code}</code>
                            </pre>
                          </div>

                          {/* Source Attribution */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Source: {result.source.document} → {result.source.section}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2"
                              onClick={() => handleViewSource(result.source)}
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View Source</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sampleDocuments.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Code className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                            </div>
                          </div>
                          <Badge
                            variant={doc.status === 'processed' ? 'default' : 'secondary'}
                            className={doc.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {doc.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Size:</span>
                            <span className="ml-2 font-medium">{doc.size}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Sections:</span>
                            <span className="ml-2 font-medium">{doc.sections}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Last updated: {doc.lastUpdated}
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewDocumentation(doc.name)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Documentation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSearchContent(doc.name)}
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Search Content
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-8">
                {/* Popular Search Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      Popular Search Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {popularSearchTerms.map((term, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700">{term.term}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${term.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                              {term.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documentPerformance.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700">{doc.name}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${doc.performance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                              {doc.performance}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Enterprise Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise RAG Features Available
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced capabilities for large-scale technical documentation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Advanced Vector Databases</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pinecone, Weaviate integration for millions of code snippets
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Code-Aware Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Multi-language code understanding and cross-reference linking
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Enterprise Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Git integration, IDE plugins, real-time documentation sync
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Source Modal */}
      {showSourceModal && selectedSource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Source Documentation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSourceModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Document</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedSource.document}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Section</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedSource.section}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Preview</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <p>This section contains detailed information about {selectedSource.section.toLowerCase()} from the {selectedSource.document}.</p>
                    <p className="mt-2">In a real implementation, this would show the actual content from the source document with proper formatting and syntax highlighting.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSourceModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleOpenFullDocument(selectedSource.document)}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Full Document</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TechnicalDocumentationRAG;
