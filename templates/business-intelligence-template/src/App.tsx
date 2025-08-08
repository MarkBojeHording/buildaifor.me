import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText,
  Sparkles,
  Zap,
  Target,
  Database,
  Settings
} from 'lucide-react';
import { supabase, BusinessDashboardAPI, signInAnonymously, getCurrentUser } from './utils/supabase';

// Types for the application
interface DataRow {
  [key: string]: string | number;
}

interface InsightData {
  summary: string;
  trends: string[];
  anomalies: string[];
  prediction: string;
}

interface AdvancedFeatures {
  nlq: string;
  rootCause: string;
  recommendations: string;
  integrations: string;
  customization: string;
  dataCleaning: string;
}

const App: React.FC = () => {
  // State management
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [isSampleData, setIsSampleData] = useState(true);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [displayedRows, setDisplayedRows] = useState(16); // Show up to 16 rows initially

  // Advanced features data
  const advancedFeatures: AdvancedFeatures = {
    nlq: "Ask your dashboard questions in plain English like 'Show me revenue trends for Q2' or 'What caused the dip in April?'",
    rootCause: "AI identifies the 'why' behind performance changes, automatically detecting correlations and causal factors.",
    recommendations: "Receive AI-driven suggestions for actions to improve performance, optimize spending, and increase efficiency.",
    integrations: "Connect to your live CRM, ERP, Google Analytics, and other data sources for real-time insights.",
    customization: "Tailor dashboard layouts, metrics, and visualizations to match your specific business needs.",
    dataCleaning: "Automate data cleaning, validation, and preparation processes to ensure data quality."
  };

  // Supabase authentication setup
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Check for existing user
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Sign in anonymously if no user
          const newUser = await signInAnonymously();
          setUser(newUser);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    setupAuth();
  }, []);

  // Generate initial insights on component mount
  useEffect(() => {
    loadSampleData();
  }, []);

  // Load sample data and generate insights
  const loadSampleData = async () => {
    try {
      setIsLoading(true);
      const result = await BusinessDashboardAPI.getSampleData();
      setData(result.data);
      setIsSampleData(true);
      
      // Generate insights for sample data
      await generateInsights(result.data);
    } catch (error) {
      console.error('Error loading sample data:', error);
      setError('Failed to load sample data');
    } finally {
      setIsLoading(false);
    }
  };

  // AI insight generation
  const generateInsights = useCallback(async (dataRows: DataRow[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await BusinessDashboardAPI.generateInsights(dataRows);
      setInsights(result.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate insights');

      // Fallback insights
      setInsights({
        summary: "Unable to generate AI insights at this time. Please try again later.",
        trends: [],
        anomalies: [],
        prediction: ""
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle CSV file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const text = await file.text();
      
      // Process CSV through Supabase Edge Function
      const result = await BusinessDashboardAPI.processCSV(text, file.name);
      
      setData(result.data);
      setIsSampleData(false);
      setDisplayedRows(16); // Reset to show first 16 rows

      // Generate insights for the new data
      await generateInsights(result.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  }, [generateInsights]);

  // Calculate basic metrics for display
  const calculateMetrics = useCallback(() => {
    if (data.length === 0) return null;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    const revenueChange = previous ? ((latest.Revenue as number) - (previous.Revenue as number)) / (previous.Revenue as number) * 100 : 0;
    const profitChange = previous ? ((latest.Profit as number) - (previous.Profit as number)) / (previous.Profit as number) * 100 : 0;
    const customerChange = previous ? ((latest.New_Customers as number) - (previous.New_Customers as number)) / (previous.New_Customers as number) * 100 : 0;

    return {
      currentRevenue: latest.Revenue as number,
      currentProfit: latest.Profit as number,
      currentCustomers: latest.New_Customers as number,
      revenueChange,
      profitChange,
      customerChange
    };
  }, [data]);

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Business Dashboard Generator</h1>
                <p className="text-sm text-gray-600">AI-Powered Analytics & Insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isSampleData && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Sample Data</span>
                </div>
              )}
              {user && (
                <div className="text-xs text-gray-500">
                  User: {user.id.slice(0, 8)}...
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Data</h2>
              <p className="text-gray-600">
                Upload a CSV file with your business data to get AI-powered insights and analytics.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <label className="btn-primary cursor-pointer inline-flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
          {isUploading && (
            <div className="mt-4 flex items-center space-x-2 text-primary-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing your file...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.currentRevenue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${metrics.revenueChange >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                    {metrics.revenueChange >= 0 ? '+' : ''}{metrics.revenueChange.toFixed(1)}% from last month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.currentProfit.toLocaleString()}
                  </p>
                  <p className={`text-sm ${metrics.profitChange >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                    {metrics.profitChange >= 0 ? '+' : ''}{metrics.profitChange.toFixed(1)}% from last month
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.currentCustomers.toLocaleString()}
                  </p>
                  <p className={`text-sm ${metrics.customerChange >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                    {metrics.customerChange >= 0 ? '+' : ''}{metrics.customerChange.toFixed(1)}% from last month
                  </p>
                </div>
                <Users className="w-8 h-8 text-warning-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isSampleData ? 'Sample records' : 'Your records'}
                  </p>
                </div>
                <Database className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
              <div className="text-sm text-gray-500">
                Showing {Math.min(data.length, displayedRows)} of {data.length} rows
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {data.length > 0 && Object.keys(data[0]).map((header) => (
                      <th key={header} className="text-left py-2 px-2 font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, displayedRows).map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      {Object.values(row).map((value, valueIndex) => (
                        <td key={valueIndex} className="py-2 px-2">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > displayedRows && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setDisplayedRows(prev => Math.min(prev + 16, data.length))}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  Show {Math.min(16, data.length - displayedRows)} More Rows
                </button>
                <div className="text-sm text-gray-500 mt-1">
                  ... and {data.length - displayedRows} more rows
                </div>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Generating insights...</p>
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-primary-600" />
                    Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
                </div>

                {/* Trends */}
                {insights.trends && insights.trends.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-success-600" />
                      Key Trends
                    </h4>
                    <ul className="space-y-1">
                      {insights.trends.map((trend, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Anomalies */}
                {insights.anomalies && insights.anomalies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-warning-600" />
                      Anomalies Detected
                    </h4>
                    <ul className="space-y-1">
                      {insights.anomalies.map((anomaly, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-warning-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{anomaly}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prediction */}
                {insights.prediction && (
                  <div className="bg-gradient-to-r from-warning-50 to-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-warning-600" />
                      Predictive Insight
                    </h4>
                    <p className="text-gray-700">{insights.prediction}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No insights available
              </div>
            )}
          </div>
        </div>

        {/* Advanced Features Section */}
        <div className="mt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Explore Advanced AI Features</h3>
            </div>
            <p className="text-gray-600 text-lg">Discover the full potential of AI-powered business intelligence</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Natural Language Querying</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.nlq}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Root Cause Analysis</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.rootCause}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Prescriptive Recommendations</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.recommendations}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Real-time Integrations</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.integrations}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Customizable Dashboards</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.customization}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">AI Data Cleaning</h4>
                    <p className="text-sm text-gray-600">{advancedFeatures.dataCleaning}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by AI • Built for Business Intelligence •
              <span className="text-primary-600 font-medium"> Ready for Enterprise</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
