import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../../hooks/useScrollToTop';
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
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uqkzthavpupgpbusqhwy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa3p0aGF2cHVwZ3BidXNxaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTM0MTgsImV4cCI6MjA2OTc4OTQxOH0.PKWpeC4dfdqUS25STLFEIzlwmW_ZDIyQ9ZezPcrnke8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ecommerce API class for Supabase Edge Functions
export class EcommerceSalesAPI {
  static async processCSV(csvData: string, fileName?: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-sales-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'process_csv',
        data: csvData,
        file_name: fileName || 'uploaded_data.csv'
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  static async generateInsights(data: DataRow[]) {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-sales-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'generate_insights',
        data: JSON.stringify(data)
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  static async getSampleData() {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-sales-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'get_sample_data'
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  static async healthCheck() {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-sales-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'health_check'
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }
}

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
  const navigate = useNavigate();
  useScrollToTop();
  // State management
  const [data, setData] = useState<DataRow[]>(sampleData);
  const [isSampleData, setIsSampleData] = useState(true);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [displayedRows, setDisplayedRows] = useState(16); // Show up to 16 rows initially
  const [edgeFunctionMetrics, setEdgeFunctionMetrics] = useState<{
    revenue: number;
    profit: number;
    customerAcquisition: number;
    dataPoints: number;
    growthRate: number;
    profitMargin: number;
    conversionRate: number;
    averageOrderValue: number;
  } | null>(null);

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
    const loadSampleData = async () => {
      console.log('loadSampleData called');
      try {
        console.log('Calling EcommerceSalesAPI.getSampleData...');
        const result = await EcommerceSalesAPI.getSampleData();
        console.log('getSampleData result:', result);

        if (result.success) {
          console.log('Setting data:', result.data);
          setData(result.data);
          // Store metrics from sample data
          if (result.metrics) {
            console.log('Setting metrics from sample data:', result.metrics);
            setEdgeFunctionMetrics(result.metrics);
          }
          console.log('Calling generateInsights with result.data...');
          await generateInsights(result.data);
        } else {
          console.log('getSampleData failed, using fallback');
          // Fallback to local sample data
          generateInsights(sampleData);
        }
      } catch (error) {
        console.error('Error loading sample data:', error);
        // Fallback to local sample data
        generateInsights(sampleData);
      }
    };

    loadSampleData();
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

  // AI insight generation with Supabase Edge Functions
  const generateInsights = useCallback(async (dataRows: DataRow[]) => {
    console.log('generateInsights called with data:', dataRows);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling EcommerceSalesAPI.generateInsights...');
      const result = await EcommerceSalesAPI.generateInsights(dataRows);
      console.log('EcommerceSalesAPI.generateInsights result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate insights');
      }

      console.log('Setting insights:', result.insights);
      setInsights(result.insights);

      // Store the metrics returned from the Edge Function for display
      if (result.metrics) {
        console.log('Setting edge function metrics:', result.metrics);
        setEdgeFunctionMetrics(result.metrics);
      }
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
      const result = await EcommerceSalesAPI.processCSV(text, file.name);

      if (!result.success) {
        throw new Error(result.error || 'Failed to process CSV file');
      }

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

    // Handle different column name formats (from Supabase vs local data)
    const revenue = Number(latest.revenue || latest.Revenue || 0);
    const costs = Number(latest.costs || latest.Costs || 0);
    const customers = Number(latest.customers || latest.New_Customers || 0);

    const prevRevenue = previous ? Number(previous.revenue || previous.Revenue || 0) : 0;
    const prevCosts = previous ? Number(previous.costs || previous.Costs || 0) : 0;
    const prevCustomers = previous ? Number(previous.customers || previous.New_Customers || 0) : 0;

    const profit = revenue - costs;
    const prevProfit = prevRevenue - prevCosts;

    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
    const profitChange = prevProfit > 0 ? ((profit - prevProfit) / prevProfit) * 100 : 0;
    const customerChange = prevCustomers > 0 ? ((customers - prevCustomers) / prevCustomers) * 100 : 0;

    return {
      currentRevenue: revenue,
      currentProfit: profit,
      currentCustomers: customers,
      revenueChange,
      profitChange,
      customerChange
    };
  }, [data]);

  // Create unified metrics object that works with both Edge Function and local calculations
  const getDisplayMetrics = () => {
    if (edgeFunctionMetrics) {
      // Use Edge Function metrics (more accurate)
      return {
        currentRevenue: edgeFunctionMetrics.revenue,
        currentProfit: edgeFunctionMetrics.profit,
        currentCustomers: edgeFunctionMetrics.customerAcquisition,
        revenueChange: edgeFunctionMetrics.growthRate,
        profitChange: edgeFunctionMetrics.profitMargin,
        customerChange: edgeFunctionMetrics.conversionRate
      };
    }

    // Fallback to local calculation
    return calculateMetrics();
  };

  const metrics = getDisplayMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              // Clear saved scroll position for main page
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
