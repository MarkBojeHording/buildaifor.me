const express = require('express');
const router = express.Router();

// Workflow automation endpoints
router.get('/templates', (req, res) => {
  res.json([
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
    },
    {
      id: 4,
      name: "Lead Qualification",
      description: "Automated lead scoring and qualification with intelligent routing",
      steps: [
        { name: "Score lead", status: "completed", duration: "3min" },
        { name: "Assign to sales rep", status: "in_progress", duration: "5min" },
        { name: "Send personalized content", status: "pending", duration: "7min" },
        { name: "Schedule discovery call", status: "pending", duration: "12min" }
      ],
      triggers: ["New lead submission", "Website activity", "Email engagement"],
      successRate: "87%",
      avgDuration: "27min"
    }
  ]);
});

router.post('/execute', (req, res) => {
  const { workflowId, parameters } = req.body;

  // Simulate workflow execution
  const workflows = {
    1: {
      name: "Customer Onboarding",
      steps: [
        { name: "Welcome email sent", status: "completed", timestamp: new Date() },
        { name: "CRM entry created", status: "completed", timestamp: new Date() },
        { name: "Demo scheduled", status: "in_progress", timestamp: new Date() },
        { name: "Documentation sent", status: "pending", timestamp: null }
      ]
    },
    2: {
      name: "Support Escalation",
      steps: [
        { name: "Support ticket created", status: "completed", timestamp: new Date() },
        { name: "Manager notified", status: "completed", timestamp: new Date() },
        { name: "Call scheduled", status: "in_progress", timestamp: new Date() },
        { name: "Follow-up email sent", status: "pending", timestamp: null }
      ]
    },
    3: {
      name: "Renewal Process",
      steps: [
        { name: "Renewal date checked", status: "completed", timestamp: new Date() },
        { name: "Report generated", status: "completed", timestamp: new Date() },
        { name: "Renewal offer sent", status: "in_progress", timestamp: new Date() },
        { name: "Renewal call scheduled", status: "pending", timestamp: null }
      ]
    }
  };

  const workflow = workflows[workflowId] || {
    name: "Custom Workflow",
    steps: [
      { name: "Step 1", status: "completed", timestamp: new Date() },
      { name: "Step 2", status: "in_progress", timestamp: new Date() },
      { name: "Step 3", status: "pending", timestamp: null }
    ]
  };

  res.json({
    status: "executing",
    workflow: workflow,
    estimatedCompletion: "15 minutes",
    progress: "60%"
  });
});

router.get('/active', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Customer Onboarding - John Smith",
      status: "in_progress",
      progress: 75,
      startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    {
      id: 2,
      name: "Support Escalation - Ticket #1234",
      status: "in_progress",
      progress: 50,
      startedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    {
      id: 3,
      name: "Renewal Process - Enterprise Corp",
      status: "pending",
      progress: 25,
      startedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      estimatedCompletion: new Date(Date.now() + 25 * 60 * 1000) // 25 minutes from now
    }
  ]);
});

router.post('/create', (req, res) => {
  const { name, description, steps, triggers } = req.body;

  // Simulate workflow creation
  const newWorkflow = {
    id: Math.floor(Math.random() * 1000) + 100,
    name: name,
    description: description,
    steps: steps.map(step => ({ ...step, status: "pending" })),
    triggers: triggers,
    successRate: "85%",
    avgDuration: "25min",
    createdAt: new Date()
  };

  res.json({
    success: true,
    workflow: newWorkflow,
    message: "Workflow created successfully"
  });
});

module.exports = router;
