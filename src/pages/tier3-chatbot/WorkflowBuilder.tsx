import React, { useState } from 'react';
import { Plus, Play, Pause, Settings, Clock, CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react';

const WorkflowBuilder = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: "Customer Onboarding",
      description: "Automated customer onboarding process with welcome emails, demo scheduling, and CRM setup",
      steps: [
        { name: "Welcome email", status: "completed", duration: "5min" },
        { name: "Schedule demo", status: "in_progress", duration: "15min" },
        { name: "Create CRM entry", status: "pending", duration: "10min" },
        { name: "Send documentation", status: "pending", duration: "5min" }
      ],
      triggers: ["New customer signup", "Account activation"],
      successRate: "94%",
      avgDuration: "35min"
    },
    {
      id: 2,
      name: "Support Escalation",
      description: "Intelligent support ticket escalation based on priority and complexity",
      steps: [
        { name: "Create ticket", status: "completed", duration: "2min" },
        { name: "Notify manager", status: "in_progress", duration: "5min" },
        { name: "Schedule call", status: "pending", duration: "10min" },
        { name: "Follow-up email", status: "pending", duration: "3min" }
      ],
      triggers: ["Negative sentiment", "Complex issue", "High priority"],
      successRate: "89%",
      avgDuration: "20min"
    },
    {
      id: 3,
      name: "Renewal Process",
      description: "Automated renewal workflow with personalized outreach and retention strategies",
      steps: [
        { name: "Check renewal date", status: "completed", duration: "1min" },
        { name: "Generate report", status: "in_progress", duration: "8min" },
        { name: "Send renewal offer", status: "pending", duration: "5min" },
        { name: "Schedule renewal call", status: "pending", duration: "15min" }
      ],
      triggers: ["30 days before renewal", "Low usage detected"],
      successRate: "92%",
      avgDuration: "29min"
    }
  ]);

  const [activeWorkflows] = useState([
    {
      id: 1,
      name: "Customer Onboarding - John Smith",
      status: "in_progress",
      progress: 75,
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000)
    },
    {
      id: 2,
      name: "Support Escalation - Ticket #1234",
      status: "in_progress",
      progress: 50,
      startedAt: new Date(Date.now() - 15 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000)
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Workflow Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                </div>
                <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Execute</span>
                </button>
              </div>

              <div className="space-y-3 mb-4">
                {workflow.steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm text-gray-700">{step.name}</span>
                    <span className="text-xs text-gray-500">({step.duration})</span>
                  </div>
                ))}
                {workflow.steps.length > 3 && (
                  <div className="text-sm text-gray-500">+{workflow.steps.length - 3} more steps</div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-green-600 font-medium">{workflow.successRate}</span>
                  <span className="text-gray-500">{workflow.avgDuration}</span>
                </div>
                <div className="text-purple-600 font-medium">
                  {workflow.triggers.length} triggers
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Workflows */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Workflows</h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(workflow.status)}
                      <span className={`font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Started {Math.floor((Date.now() - new Date(workflow.startedAt).getTime()) / 60000)}m ago
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workflow.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{workflow.progress}%</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Pause className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Builder */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual Workflow Builder</h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Canvas */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px]">
              <div className="text-center text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Drag and drop workflow steps</p>
                <p className="text-sm">Build your automation workflow visually</p>
              </div>
            </div>

            {/* Toolbox */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Workflow Components</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Send Email</div>
                    <div className="text-sm text-gray-600">Automated email sending</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Schedule Task</div>
                    <div className="text-sm text-gray-600">Calendar integration</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Create Ticket</div>
                    <div className="text-sm text-gray-600">Support ticket creation</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Conditional Logic</div>
                    <div className="text-sm text-gray-600">If/then decision making</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
