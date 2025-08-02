import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, DollarSign, BarChart3, Activity, Target, Zap } from 'lucide-react';

const Analytics = () => {
  const [conversations, setConversations] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [workflows, setWorkflows] = useState(null);
  const [businessImpact, setBusinessImpact] = useState(null);
  const [realTime, setRealTime] = useState(null);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const [convRes, perfRes, workflowRes, impactRes, realTimeRes, customersRes] = await Promise.all([
          fetch('http://localhost:8003/api/analytics/conversations'),
          fetch('http://localhost:8003/api/analytics/performance'),
          fetch('http://localhost:8003/api/analytics/workflows'),
          fetch('http://localhost:8003/api/analytics/business-impact'),
          fetch('http://localhost:8003/api/analytics/real-time'),
          fetch('http://localhost:8003/api/analytics/customers')
        ]);

        setConversations(await convRes.json());
        setPerformance(await perfRes.json());
        setWorkflows(await workflowRes.json());
        setBusinessImpact(await impactRes.json());
        setRealTime(await realTimeRes.json());
        setCustomers(await customersRes.json());
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!conversations || !performance || !workflows || !businessImpact || !realTime || !customers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900">{conversations.totalConversations.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{performance.automation.successRate}</p>
              <p className="text-sm text-green-600">+2.1% improvement</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">{businessImpact.efficiency.costReduction}</p>
              <p className="text-sm text-green-600">+34% efficiency gain</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.activeWorkflows}</p>
              <p className="text-sm text-blue-600">{workflows.completedToday} completed today</p>
            </div>
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Response Time Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-semibold text-green-600">{performance.responseTime.average}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">95th Percentile</span>
              <span className="font-semibold text-yellow-600">{performance.responseTime.p95}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">99th Percentile</span>
              <span className="font-semibold text-red-600">{performance.responseTime.p99}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">AI Accuracy Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Intent Recognition</span>
              <span className="font-semibold text-green-600">{performance.accuracy.intentRecognition}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entity Extraction</span>
              <span className="font-semibold text-blue-600">{performance.accuracy.entityExtraction}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sentiment Analysis</span>
              <span className="font-semibold text-purple-600">{performance.accuracy.sentimentAnalysis}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Performance */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Top Performing Workflows</h3>
        <div className="space-y-4">
          {workflows.topWorkflows.map((workflow, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                  <p className="text-sm text-gray-600">{workflow.executions} executions</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="font-semibold text-green-600">{workflow.successRate}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="font-semibold text-blue-600">{workflow.avgTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Real-time Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Users</span>
              <span className="font-semibold text-purple-600">{realTime.currentUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Conversations</span>
              <span className="font-semibold text-blue-600">{realTime.activeConversations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Workflows Running</span>
              <span className="font-semibold text-green-600">{realTime.workflowsRunning}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Health</span>
              <span className="font-semibold text-green-600">{realTime.systemHealth.status}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {realTime.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity.type === 'conversation_started' && `New conversation started by ${activity.user}`}
                    {activity.type === 'workflow_completed' && `Workflow "${activity.workflow}" completed`}
                    {activity.type === 'automation_triggered' && `Automation: ${activity.action}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / 60000)}m ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Customer Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(customers.segments).map(([segment, data]) => (
            <div key={segment} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 capitalize mb-2">{segment}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customers</span>
                  <span className="font-semibold">{data.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-semibold text-green-600">{data.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <span className="font-semibold text-blue-600">{data.satisfaction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
