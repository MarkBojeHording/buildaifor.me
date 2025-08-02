const express = require('express');
const router = express.Router();

// Analytics endpoints
router.get('/conversations', (req, res) => {
  res.json({
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
  });
});

router.get('/performance', (req, res) => {
  res.json({
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
  });
});

router.get('/workflows', (req, res) => {
  res.json({
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
    ],
    performance: {
      daily: [45, 52, 67, 89, 78, 95, 102],
      weekly: [320, 380, 420, 480],
      monthly: [1200, 1400, 1600, 1800]
    }
  });
});

router.get('/business-impact', (req, res) => {
  res.json({
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
  });
});

router.get('/real-time', (req, res) => {
  res.json({
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
  });
});

router.get('/customers', (req, res) => {
  res.json({
    totalCustomers: 1247,
    activeCustomers: 892,
    newThisMonth: 156,
    churnRate: "2.1%",
    segments: {
      enterprise: {
        count: 234,
        revenue: "$1.8M",
        satisfaction: "4.9/5"
      },
      midMarket: {
        count: 456,
        revenue: "$2.1M",
        satisfaction: "4.7/5"
      },
      smallBusiness: {
        count: 557,
        revenue: "$1.2M",
        satisfaction: "4.6/5"
      }
    },
    topCustomers: [
      {
        name: "Enterprise Corp",
        value: "$125K",
        interactions: 89,
        satisfaction: "5.0/5"
      },
      {
        name: "Tech Solutions Inc",
        value: "$98K",
        interactions: 67,
        satisfaction: "4.9/5"
      },
      {
        name: "Global Industries",
        value: "$87K",
        interactions: 54,
        satisfaction: "4.8/5"
      }
    ]
  });
});

module.exports = router;
