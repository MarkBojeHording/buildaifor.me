import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import WorkflowBuilder from './components/WorkflowBuilder';
import Analytics from './components/Analytics';
import MultiModal from './components/MultiModal';
import {
  MessageSquare,
  Workflow,
  BarChart3,
  Settings,
  Brain,
  Zap,
  Users,
  Bot
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'AI Chat', icon: MessageSquare, component: ChatInterface },
    { id: 'workflow', name: 'Workflows', icon: Workflow, component: WorkflowBuilder },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, component: Analytics },
    { id: 'multimodal', name: 'Multi-Modal', icon: Settings, component: MultiModal }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Advanced Automation Chatbot</h1>
                <p className="text-sm text-gray-500">Enterprise AI Assistant Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                <Brain className="w-4 h-4 mr-1" />
                Tier 3 AI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automated Tasks</p>
                <p className="text-2xl font-bold text-gray-900">3,892</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">96.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-gray-900">$847K</p>
              </div>
              <Workflow className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Active Component */}
        <ActiveComponent />
      </div>
    </div>
  );
}

export default App;
