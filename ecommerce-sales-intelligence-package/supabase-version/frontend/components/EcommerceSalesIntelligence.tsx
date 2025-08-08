import React, { useState, useCallback, useEffect } from 'react';
import { Upload, TrendingUp, Users, DollarSign, ShoppingCart, BarChart, AlertTriangle, Lightbulb, Target, Download, FileText, Settings, Save, Star } from 'lucide-react';

// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API class for ecommerce dashboard
export class EcommerceDashboardAPI {
  static async processCSV(csvData: string, fileName?: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'process_csv',
        data: csvData,
        file_name: fileName
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async generateInsights(data: any[]) {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'generate_insights',
        data: JSON.stringify(data)
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async getSampleData() {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'get_sample_data'
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async healthCheck() {
    const response = await fetch(`${supabaseUrl}/functions/v1/ecommerce-dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        action: 'health_check'
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }
}

interface DataRow {
  date?: string;
  revenue: number;
  orders: number;
  customers: number;
  product_category?: string;
  marketing_spend?: number;
  returns?: number;
}

interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  profitMargin: number;
  growthRate: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    units_sold: number;
  }>;
}

interface AIInsights {
  summary: string;
  revenue_trends: string[];
  customer_insights: string[];
  product_performance: string[];
  anomalies: string[];
  predictions: string[];
  recommendations: string[];
  action_items: string[];
}

const EcommerceSalesIntelligence: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [edgeFunctionMetrics, setEdgeFunctionMetrics] = useState<Metrics | null>(null);
  const [conversations, setConversations] = useState<Array<{ role: string; content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Load sample data on component mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await EcommerceDashboardAPI.getSampleData();

      if (result.success) {
        setData(result.data);
        setEdgeFunctionMetrics(result.metrics);
        console.log('Sample data loaded:', result.data);
        console.log('Metrics from Edge Function:', result.metrics);

        // Generate insights with the loaded data
        await generateInsights(result.data);
      } else {
        throw new Error('Failed to load sample data');
      }
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sample data');

      // Fallback to local sample data
      const fallbackData = [
        { date: '2024-01', revenue: 65000, orders: 432, customers: 298, product_category: 'Electronics', marketing_spend: 8500, returns: 12 },
        { date: '2024-02', revenue: 72000, orders: 486, customers: 334, product_category: 'Electronics', marketing_spend: 9200, returns: 15 },
        { date: '2024-03', revenue: 58000, orders: 395, customers: 267, product_category: 'Fashion', marketing_spend: 7800, returns: 8 },
        { date: '2024-04', revenue: 84000, orders: 567, customers: 412, product_category: 'Electronics', marketing_spend: 11200, returns: 18 },
        { date: '2024-05', revenue: 91000, orders: 623, customers: 445, product_category: 'Home & Garden', marketing_spend: 12100, returns: 22 },
        { date: '2024-06', revenue: 96000, orders: 672, customers: 478, product_category: 'Electronics', marketing_spend: 12800, returns: 25 },
        { date: '2024-07', revenue: 103000, orders: 721, customers: 523, product_category: 'Fashion', marketing_spend: 13500, returns: 19 },
        { date: '2024-08', revenue: 89000, orders: 612, customers: 445, product_category: 'Home & Garden', marketing_spend: 11800, returns: 16 },
        { date: '2024-09', revenue: 107000, orders: 743, customers: 567, product_category: 'Electronics', marketing_spend: 14200, returns: 28 },
        { date: '2024-10', revenue: 115000, orders: 812, customers: 623, product_category: 'Fashion', marketing_spend: 15300, returns: 31 },
        { date: '2024-11', revenue: 122000, orders: 856, customers: 667, product_category: 'Electronics', marketing_spend: 16100, returns: 24 },
        { date: '2024-12', revenue: 145000, orders: 1024, customers: 789, product_category: 'Holiday Gifts', marketing_spend: 19200, returns: 38 }
      ];
      setData(fallbackData);
      await generateInsights(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const result = await EcommerceDashboardAPI.processCSV(text, file.name);

      if (result.success) {
        setData(result.data);
        setEdgeFunctionMetrics(result.metrics);
        await generateInsights(result.data);
      } else {
        throw new Error('Failed to process CSV file');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const generateInsights = async (businessData: DataRow[]) => {
    try {
      setIsGeneratingInsights(true);
      setError(null);

      const result = await EcommerceDashboardAPI.generateInsights(businessData);

      if (result.success) {
        setInsights(result.insights);
        setEdgeFunctionMetrics(result.metrics);
        console.log('AI Insights generated:', result.insights);
        console.log('Metrics from Edge Function:', result.metrics);
      } else {
        throw new Error('Failed to generate insights');
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { role: 'user', content: currentMessage };
    setConversations(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      // Simulate AI response (in a real implementation, this would call the API)
      const aiResponse = { role: 'assistant', content: `Analysis for: "${currentMessage}" - Based on your ecommerce data, I can provide insights about this query.` };
      setConversations(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Get display metrics - prioritize Edge Function metrics if available
  const getDisplayMetrics = () => {
    if (edgeFunctionMetrics) {
      return {
        currentRevenue: edgeFunctionMetrics.totalRevenue,
        currentProfit: edgeFunctionMetrics.totalRevenue * (edgeFunctionMetrics.profitMargin / 100),
        currentCustomers: edgeFunctionMetrics.totalCustomers,
        revenueChange: edgeFunctionMetrics.growthRate,
        profitChange: edgeFunctionMetrics.profitMargin,
        customerChange: edgeFunctionMetrics.conversionRate
      };
    }
    return calculateMetrics();
  };

  // Local metrics calculation as fallback
  const calculateMetrics = () => {
    if (data.length === 0) return null;

    const totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);
    const totalOrders = data.reduce((sum, row) => sum + (row.orders || 0), 0);
    const totalCustomers = data.reduce((sum, row) => sum + (row.customers || 0), 0);

    const firstPeriod = data[0]?.revenue || 0;
    const lastPeriod = data[data.length - 1]?.revenue || 0;
    const growthRate = firstPeriod > 0 ? ((lastPeriod - firstPeriod) / firstPeriod) * 100 : 0;

    return {
      currentRevenue: totalRevenue,
      currentProfit: totalRevenue * 0.3, // Assuming 30% profit margin
      currentCustomers: totalCustomers,
      revenueChange: growthRate,
      profitChange: 30.0,
      customerChange: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0
    };
  };

  const metrics = getDisplayMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Ecommerce Sales Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ecommerce Sales Intelligence Dashboard
              </h1>
              <p className="text-gray-600">
                AI-powered analytics for your ecommerce business
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadSampleData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Load Sample Data
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isUploading ? 'Processing...' : 'Upload your ecommerce CSV data'}
              </p>
              <p className="text-gray-500">
                Drag and drop your CSV file here, or click to browse
              </p>
            </label>
            {fileName && (
              <p className="text-sm text-blue-600 mt-2">File: {fileName}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.currentRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +{metrics.revenueChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.currentProfit.toLocaleString()}
                  </p>
                </div>
                <BarChart className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">
                  {metrics.profitChange.toFixed(1)}% margin
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.currentCustomers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center">
                <ShoppingCart className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">
                  {metrics.customerChange.toFixed(1)}% conversion
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {fileName || 'Sample data'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {insights && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
                AI-Powered Insights
              </h2>
              <button
                onClick={() => generateInsights(data)}
                disabled={isGeneratingInsights}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGeneratingInsights ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Lightbulb className="w-4 h-4 mr-2" />
                )}
                {isGeneratingInsights ? 'Generating...' : 'Refresh Insights'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue Trends</h3>
                  <ul className="space-y-2">
                    {insights.revenue_trends.map((trend, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Insights</h3>
                  <ul className="space-y-2">
                    {insights.customer_insights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <Users className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations and Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Action Items</h3>
                  <ul className="space-y-2">
                    {insights.action_items.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Predictions</h3>
                  <ul className="space-y-2">
                    {insights.predictions.map((prediction, index) => (
                      <li key={index} className="flex items-start">
                        <BarChart className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{prediction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Data Overview</h2>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Revenue</th>
                    <th className="px-6 py-3">Orders</th>
                    <th className="px-6 py-3">Customers</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Marketing Spend</th>
                    <th className="px-6 py-3">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.date || `Period ${index + 1}`}
                      </td>
                      <td className="px-6 py-4">${row.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4">{row.orders.toLocaleString()}</td>
                      <td className="px-6 py-4">{row.customers.toLocaleString()}</td>
                      <td className="px-6 py-4">{row.product_category || 'N/A'}</td>
                      <td className="px-6 py-4">${(row.marketing_spend || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">{row.returns || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length > 10 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing first 10 of {data.length} data points
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceSalesIntelligence;
