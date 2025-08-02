import React from 'react';
import { TrendingUp, Users, Clock, DollarSign, BarChart3, Activity, Target, Zap } from 'lucide-react';

const Analytics = () => {
  const conversations = {
    totalConversations: 1247,
    activeConversations: 89,
    completedToday: 156,
    averageDuration: "8.5 minutes",
    satisfactionScore: 4.8,
    resolutionRate: "94.2%",
    trends: {
      daily: [120, 135, 142, 156, 148, 162, 175],
      weekly: [850, 920, 1050, 1247],
      monthly: [3200, 3800, 4200, 4800]
    }
  };

  const performance = {
    responseTime: {
      average: "1.2s",
      p95: "2.8s",
      p99: "4.1s"
    },
    automation: {
      tasksAutomated: 3892,
      successRate: "96.8%",
      timeSaved: "847 hours",
      costSavings: "$847,000"
    },
    accuracy: {
      intentRecognition: "94.2%",
      entityExtraction: "91.7%",
      sentimentAnalysis: "89.3%"
    },
    engagement: {
      activeUsers: 247,
      messagesPerConversation: 12.4,
      retentionRate: "87.5%"
    }
  };

  const workflows = {
    totalWorkflows: 156,
    activeWorkflows: 23,
    completedToday: 89,
    successRate: "92.4%",
    averageExecutionTime: "18.5 minutes",
    topWorkflows: [
      {
        name: "Customer Onboarding",
        executions: 456,
        successRate: "94.2%",
        avgTime: "35min"
      },
      {
        name: "Support Escalation",
        executions: 234,
        successRate: "89.1%",
        avgTime: "20min"
      },
      {
        name: "Renewal Process",
        executions: 189,
        successRate: "92.8%",
        avgTime: "29min"
      }
    ]
  };

  const businessImpact = {
    revenue: {
      generated: "$2.4M",
      influenced: "$5.8M",
      growth: "+34%"
    },
    efficiency: {
      timeSaved: "1,247 hours",
      costReduction: "$847K",
      productivityIncrease: "+42%"
    },
    customer: {
      satisfaction: "4.8/5",
      retention: "94.2%",
      lifetimeValue: "+28%"
    },
    operational: {
      ticketsResolved: "3,892",
      escalationsReduced: "67%",
      responseTime: "-58%"
    }
  };

  const realTime = {
    currentUsers: 47,
    activeConversations: 23,
    workflowsRunning: 8,
    systemHealth: {
      status: "healthy",
      uptime: "99.97%",
      responseTime: "1.1s",
      errors: 0
    },
    recentActivity: [
      {
        type: "conversation_started",
        user: "john.doe@company.com",
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        type: "workflow_completed",
        workflow: "Customer Onboarding",
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        type: "automation_triggered",
        action: "Email Sent",
        timestamp: new Date(Date.now() - 8 * 60 * 1000)
      }
    ]
  };

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
    </div>
  );
};

export default Analytics;
