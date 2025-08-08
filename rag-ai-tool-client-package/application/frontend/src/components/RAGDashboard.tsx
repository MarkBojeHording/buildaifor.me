import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Search,
  Upload,
  File,
  Brain,
  BarChart3,
  Settings,
  Sparkles,
  Clock,
  Target,
  Users,
  TrendingUp,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Filter,
  Download,
  Plus,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import {
  Document,
  SearchQuery,
  SearchResult,
  SearchResponse,
  AnalyticsData,
  UploadProgress,
  UserPreferences,
  SearchSuggestion
} from '../types/rag';
import { RAGApiClient } from '../utils/ragApi';

interface RAGDashboardProps {
  apiClient: RAGApiClient;
}

const RAGDashboard: React.FC<RAGDashboardProps> = ({ apiClient }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [generatedAnswer, setGeneratedAnswer] = useState<string>('');
  const [answerConfidence, setAnswerConfidence] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string>('');

  // Sample data for demo purposes
  const sampleDocuments: Document[] = [
    {
      id: '1',
      title: 'API Documentation',
      content: 'Complete API reference with authentication, endpoints, and examples',
      file_name: 'api-docs.pdf',
      file_size: 2048576,
      file_type: 'application/pdf',
      upload_date: '2024-01-15T10:30:00Z',
      status: 'ready',
      chunks_count: 45,
      metadata: {
        language: 'en',
        page_count: 120,
        word_count: 15000,
        tags: ['api', 'documentation', 'reference']
      }
    },
    {
      id: '2',
      title: 'User Manual',
      content: 'Comprehensive user guide with tutorials and troubleshooting',
      file_name: 'user-manual.pdf',
      file_size: 3145728,
      file_type: 'application/pdf',
      upload_date: '2024-01-14T15:45:00Z',
      status: 'ready',
      chunks_count: 67,
      metadata: {
        language: 'en',
        page_count: 89,
        word_count: 12500,
        tags: ['manual', 'tutorial', 'help']
      }
    },
    {
      id: '3',
      title: 'Technical Specifications',
      content: 'Detailed technical specifications and system requirements',
      file_name: 'tech-specs.pdf',
      file_size: 1572864,
      file_type: 'application/pdf',
      upload_date: '2024-01-13T09:20:00Z',
      status: 'ready',
      chunks_count: 23,
      metadata: {
        language: 'en',
        page_count: 45,
        word_count: 8500,
        tags: ['technical', 'specifications', 'requirements']
      }
    }
  ];

  const sampleSearchResults: SearchResult[] = [
    {
      id: '1',
      document_id: '1',
      document_title: 'API Documentation',
      content: 'To authenticate API requests, include your API key in the Authorization header: Bearer YOUR_API_KEY. All requests must be made over HTTPS.',
      similarity_score: 0.95,
      metadata: {
        page_number: 5,
        section_title: 'Authentication',
        file_name: 'api-docs.pdf',
        file_type: 'application/pdf'
      },
      highlights: ['authenticate', 'API key', 'Authorization header']
    },
    {
      id: '2',
      document_id: '1',
      document_title: 'API Documentation',
      content: 'Rate limiting is enforced with a limit of 1000 requests per hour per API key. Headers X-RateLimit-Remaining and X-RateLimit-Reset provide current status.',
      similarity_score: 0.87,
      metadata: {
        page_number: 12,
        section_title: 'Rate Limiting',
        file_name: 'api-docs.pdf',
        file_type: 'application/pdf'
      },
      highlights: ['rate limiting', 'requests per hour', 'API key']
    },
    {
      id: '3',
      document_id: '2',
      document_title: 'User Manual',
      content: 'For troubleshooting authentication issues, verify that your API key is valid and has not expired. Check the API console for key status.',
      similarity_score: 0.82,
      metadata: {
        page_number: 78,
        section_title: 'Troubleshooting',
        file_name: 'user-manual.pdf',
        file_type: 'application/pdf'
      },
      highlights: ['troubleshooting', 'authentication', 'API key']
    }
  ];

  const sampleAnalytics: AnalyticsData = {
    total_documents: 156,
    total_searches: 2847,
    avg_response_time: 347,
    user_activity: {
      daily_searches: [
        { date: '2024-01-15', count: 145 },
        { date: '2024-01-14', count: 189 },
        { date: '2024-01-13', count: 167 },
        { date: '2024-01-12', count: 198 },
        { date: '2024-01-11', count: 156 }
      ],
      popular_queries: [
        { query: 'API authentication', count: 89, avg_satisfaction: 4.7 },
        { query: 'rate limiting', count: 67, avg_satisfaction: 4.5 },
        { query: 'error codes', count: 54, avg_satisfaction: 4.3 }
      ],
      document_usage: [
        { document_id: '1', document_title: 'API Documentation', search_count: 234, last_accessed: '2024-01-15T14:30:00Z' },
        { document_id: '2', document_title: 'User Manual', search_count: 187, last_accessed: '2024-01-15T13:45:00Z' },
        { document_id: '3', document_title: 'Technical Specifications', search_count: 123, last_accessed: '2024-01-15T12:15:00Z' }
      ]
    },
    performance_metrics: {
      search_accuracy: 94.5,
      user_satisfaction: 4.6,
      system_uptime: 99.9,
      avg_processing_time: 347
    }
  };

  useEffect(() => {
    // Load initial data
    setDocuments(sampleDocuments);
    setAnalytics(sampleAnalytics);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setGeneratedAnswer('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use sample results for demo
      setSearchResults(sampleSearchResults);
      setGeneratedAnswer(
        `Based on the documentation, to authenticate API requests you need to include your API key in the Authorization header using the Bearer token format. The API enforces rate limiting with a maximum of 1000 requests per hour per API key. You can monitor your current rate limit status using the X-RateLimit-Remaining and X-RateLimit-Reset headers in the response.`
      );
      setAnswerConfidence(94);

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    const initialProgress: UploadProgress[] = acceptedFiles.map(file => ({
      file_name: file.name,
      file_size: file.size,
      uploaded_bytes: 0,
      progress_percentage: 0,
      status: 'uploading'
    }));

    setUploadProgress(initialProgress);

    // Simulate upload progress
    for (const file of acceptedFiles) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(prev =>
          prev.map(p =>
            p.file_name === file.name
              ? { ...p, progress_percentage: progress, uploaded_bytes: (file.size * progress) / 100 }
              : p
          )
        );
      }

      // Mark as processing
      setUploadProgress(prev =>
        prev.map(p =>
          p.file_name === file.name
            ? { ...p, status: 'processing' }
            : p
        )
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark as complete
      setUploadProgress(prev =>
        prev.map(p =>
          p.file_name === file.name
            ? { ...p, status: 'complete' }
            : p
        )
      );
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Intelligent Document Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg"
            />
            <Button onClick={handleSearch} disabled={isSearching} size="lg">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            {['API authentication', 'Error codes', 'Rate limiting', 'Getting started'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Answer */}
      {generatedAnswer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI-Generated Answer
              <Badge variant="secondary">{answerConfidence}% confidence</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
              <p className="text-gray-800 leading-relaxed">{generatedAnswer}</p>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generatedAnswer)}
              >
                {copiedText === generatedAnswer ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <Target className="w-4 h-4" />
              Based on {searchResults.length} relevant document sections
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{result.document_title}</h4>
                        <p className="text-sm text-gray-500">
                          Page {result.metadata?.page_number} • {result.metadata?.section_title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{Math.round(result.similarity_score * 100)}% match</Badge>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.content)}>
                          {copiedText === result.content ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{result.content}</p>
                    {result.highlights && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {isSearching && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Searching through your documents...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag & drop documents here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, TXT, MD files up to 50MB
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Upload Progress</h4>
              {uploadProgress.map((progress) => (
                <div key={progress.file_name} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{progress.file_name}</span>
                    <span className="text-sm text-gray-500">
                      {(progress.file_size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={progress.progress_percentage} className="flex-1" />
                    <span className="text-sm font-medium w-12">{progress.progress_percentage}%</span>
                    {progress.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {progress.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  </div>
                  {progress.status === 'processing' && (
                    <p className="text-xs text-gray-500 mt-1">Processing document...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Document Library ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <File className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      <Badge
                        variant={doc.status === 'ready' ? 'default' : doc.status === 'processing' ? 'secondary' : 'destructive'}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{doc.file_name}</span>
                      <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                      <span>{doc.chunks_count} chunks</span>
                      <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                    </div>
                    {doc.metadata?.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.metadata.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.total_documents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.total_searches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.avg_response_time}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Search Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.performance_metrics.search_accuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Search Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.user_activity.popular_queries.map((query, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{query.query}</span>
                  <Badge variant="secondary">{query.count} searches</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">★ {query.avg_satisfaction}/5</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Most Accessed Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.user_activity.document_usage.map((doc) => (
              <div key={doc.document_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{doc.document_title}</h4>
                  <p className="text-sm text-gray-500">
                    Last accessed {new Date(doc.last_accessed).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{doc.search_count}</p>
                  <p className="text-sm text-gray-500">searches</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">RAG AI Tool</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ● Online
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <File className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">{renderSearchTab()}</TabsContent>
          <TabsContent value="documents">{renderDocumentsTab()}</TabsContent>
          <TabsContent value="analytics">{renderAnalyticsTab()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RAGDashboard;
