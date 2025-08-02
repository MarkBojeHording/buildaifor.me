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
  Settings,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Sample data for initial load
const sampleData = [
  { Month: 'Jan', Revenue: 100000, Marketing_Spend: 10000, New_Customers: 500, Profit: 30000 },
  { Month: 'Feb', Revenue: 105000, Marketing_Spend: 10500, New_Customers: 520, Profit: 32000 },
  { Month: 'Mar', Revenue: 110000, Marketing_Spend: 11000, New_Customers: 550, Profit: 34000 },
  { Month: 'Apr', Revenue: 95000, Marketing_Spend: 12000, New_Customers: 480, Profit: 25000 },
  { Month: 'May', Revenue: 115000, Marketing_Spend: 11200, New_Customers: 580, Profit: 36000 },
  { Month: 'Jun', Revenue: 120000, Marketing_Spend: 11500, New_Customers: 600, Profit: 38000 },
  { Month: 'Jul', Revenue: 125000, Marketing_Spend: 11800, New_Customers: 620, Profit: 40000 },
  { Month: 'Aug', Revenue: 130000, Marketing_Spend: 12000, New_Customers: 650, Profit: 42000 }
];

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

const EcommerceSalesIntelligence: React.FC = () => {
  // State management
  const [data, setData] = useState<DataRow[]>(sampleData);
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

  // Generate initial insights on component mount
  useEffect(() => {
    generateInsights(sampleData);
  }, []);

  // CSV parsing function with robust error handling
  const parseCSV = useCallback((csvText: string): DataRow[] => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(header => header.trim());
      const dataRows: DataRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = line.split(',').map(value => value.trim());
        if (values.length !== headers.length) {
          console.warn(`Row ${i + 1} has ${values.length} values but expected ${headers.length}`);
          continue;
        }

        const row: DataRow = {};
        headers.forEach((header, index) => {
          const value = values[index];

          // Check if this looks like a date (contains dashes or slashes)
          if (value.includes('-') || value.includes('/')) {
            row[header] = value; // Keep as string for dates
          } else {
            // Try to convert to number if possible, but only if it's a pure number
            const numValue = parseFloat(value);
            // Only convert to number if it's a valid number and doesn't contain letters
            const isPureNumber = /^\d+(\.\d+)?$/.test(value);
            row[header] = (isNaN(numValue) || !isPureNumber) ? value : numValue;
          }
        });
        dataRows.push(row);
      }

      return dataRows;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw new Error('Failed to parse CSV file. Please ensure it\'s properly formatted.');
    }
  }, []);

  // AI insight generation with OpenAI API and exponential backoff
  const generateInsights = useCallback(async (dataRows: DataRow[], retryCount = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert data to CSV string for AI analysis
      const headers = Object.keys(dataRows[0]);
      const csvString = [
        headers.join(','),
        ...dataRows.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // Construct AI prompt
      const prompt = `Analyze this business data and provide insights in the following JSON format:
{
  "summary": "A clear, concise narrative summary highlighting key KPIs and overall trends",
  "trends": ["List of significant trends identified in the data"],
  "anomalies": ["List of potential anomalies or unusual patterns"],
  "prediction": "A simple, high-level forecast for the primary metric based on recent trends"
}

Business Data (CSV):
${csvString}

Focus on:
- Revenue trends and growth patterns
- Marketing spend efficiency
- Customer acquisition trends
- Profit margin analysis
- Any notable anomalies or patterns
- Simple predictive insights based on the data

Provide actionable insights that would be valuable for business decision-making.`;

      // Note: For this integration, the API key should be in the main project's .env file
      // since this component is part of the main application, not the standalone template
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || ""; // Get API key from environment variable

      // Debug: Check if API key is available (remove this in production)
      if (!apiKey) {
        console.warn("OpenAI API key not found in main application. Please check your root .env file.");
        console.log("Available environment variables:", Object.keys(import.meta.env));
      }
      const maxRetries = 3;
      const baseDelay = 1000; // 1 second

      const makeRequest = async (attempt: number): Promise<Response> => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a business intelligence analyst. Provide insights in the exact JSON format requested.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          if (response.status === 429 && attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            return makeRequest(attempt + 1);
          }
          throw new Error(`API request failed: ${response.status}`);
        }

        return response;
      };

      const response = await makeRequest(0);
      const result = await response.json();

      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = result.choices[0].message.content;

      // Clean the response by removing markdown formatting
      let cleanedResponse = aiResponse;

      // Remove markdown code blocks and "json" text
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // Try to parse JSON response, fallback to text if needed
      let parsedInsights: InsightData;
      try {
        parsedInsights = JSON.parse(cleanedResponse);
      } catch {
        // Fallback: create structured insights from text response
        parsedInsights = {
          summary: aiResponse,
          trends: [],
          anomalies: [],
          prediction: "Based on the data analysis, continued monitoring of key metrics is recommended."
        };
      }

      setInsights(parsedInsights);
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
      const parsedData = parseCSV(text);

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the CSV file');
      }

      setData(parsedData);
      setIsSampleData(false);
      setDisplayedRows(16); // Reset to show first 16 rows

      // Generate insights for the new data
      await generateInsights(parsedData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  }, [parseCSV, generateInsights]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              window.history.back();
            }}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Business Dashboard Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our advanced AI-powered business intelligence system with real-time insights, predictive analytics, and automated data analysis.
            </p>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
      </main>

      <Footer />
    </div>
  );
};

export default EcommerceSalesIntelligence;
