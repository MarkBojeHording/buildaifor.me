// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Types
interface ChatRequest {
  message: string
  userId?: string
  sessionId?: string
  context?: any
  fileData?: any
}

interface ChatResponse {
  response: string
  actions: AutomationAction[]
  analytics: ConversationAnalytics
  nextSteps: string[]
  sessionId: string
  timestamp: string
}

interface AutomationAction {
  type: 'crm' | 'schedule' | 'email' | 'ticket' | 'report' | 'workflow'
  label: string
  icon: string
  priority: 'low' | 'medium' | 'high'
  data?: any
}

interface ConversationAnalytics {
  messageCount: number
  sentiment: 'positive' | 'neutral' | 'negative'
  intent: string
  confidence: number
  processingTime: number
}

// Session management (in-memory for Edge Function)
const sessions = new Map<string, any>()

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { method, url } = req
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split('/')
    const endpoint = pathSegments[pathSegments.length - 1]
    const subEndpoint = pathSegments[pathSegments.length - 2]

    // Route handling
    if (endpoint === 'chat') {
      return await handleChat(req)
    } else if (endpoint === 'upload') {
      return await handleFileUpload(req)
    } else if (endpoint === 'analytics') {
      return await handleAnalytics(req)
    } else if (endpoint === 'workflows' || (subEndpoint === 'workflows' && endpoint === 'templates')) {
      return await handleWorkflows(req)
    } else if (endpoint === 'templates' && subEndpoint === 'workflows') {
      return await handleWorkflows(req)
    } else if (endpoint === 'execute' && subEndpoint === 'workflows') {
      return await handleWorkflows(req)
    } else {
      return await handleChat(req) // Default to chat
    }
  } catch (error) {
    console.error('Error in Tier 3 chatbot:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Main chat handler
async function handleChat(req: Request): Promise<Response> {
  try {
    const body: ChatRequest = await req.json()
    const { message, userId, sessionId, context } = body

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const startTime = Date.now()

    // Generate or get session
    const currentSessionId = sessionId || generateSessionId()
    const session = getOrCreateSession(currentSessionId, userId)

    // Update session with new message
    session.messages.push({ role: 'user', content: message, timestamp: new Date() })
    session.messageCount++

    // Generate AI response
    const aiResponse = await generateAIResponse(message, context, session)

    // Generate automation actions
    const actions = await generateAutomationActions(message, aiResponse)

    // Update analytics
    const analytics = updateConversationAnalytics(message, session, Date.now() - startTime)

    // Suggest next steps
    const nextSteps = suggestNextSteps(message, aiResponse, session)

    // Update session with AI response
    session.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() })
    sessions.set(currentSessionId, session)

    const response: ChatResponse = {
      response: aiResponse,
      actions,
      analytics,
      nextSteps,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in handleChat:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat message',
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        actions: [],
        analytics: { messageCount: 0, sentiment: 'neutral', intent: 'unknown', confidence: 0, processingTime: 0 },
        nextSteps: ['Try rephrasing your message', 'Check your connection'],
        sessionId: '',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// File upload handler
async function handleFileUpload(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const { files, userId, sessionId } = body

    if (!files || !Array.isArray(files)) {
      return new Response(
        JSON.stringify({ error: 'Files array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Analyze files using AI
    const analysisResults = await analyzeFilesWithAI(files)

    return new Response(
      JSON.stringify(analysisResults),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in handleFileUpload:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze files' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Analytics handler
async function handleAnalytics(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'conversations'

    let analyticsData
    switch (type) {
      case 'conversations':
        analyticsData = getConversationAnalytics()
        break
      case 'performance':
        analyticsData = getPerformanceAnalytics()
        break
      case 'workflows':
        analyticsData = getWorkflowAnalytics()
        break
      case 'business-impact':
        analyticsData = getBusinessImpactAnalytics()
        break
      default:
        analyticsData = getConversationAnalytics()
    }

    return new Response(
      JSON.stringify(analyticsData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in handleAnalytics:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve analytics' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Workflows handler
async function handleWorkflows(req: Request): Promise<Response> {
  try {
    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    if (method === 'GET' && path === 'templates') {
      const templates = getWorkflowTemplates()
      return new Response(
        JSON.stringify(templates),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (method === 'POST' && path === 'execute') {
      const body = await req.json()
      const { workflowId, parameters } = body
      const execution = executeWorkflow(workflowId, parameters)
      return new Response(
        JSON.stringify(execution),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid workflow endpoint' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in handleWorkflows:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process workflow request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Helper functions
function generateSessionId(): string {
  return crypto.randomUUID()
}

function getOrCreateSession(sessionId: string, userId?: string) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      userId,
      messages: [],
      messageCount: 0,
      createdAt: new Date(),
      lastActivity: new Date()
    })
  }
  const session = sessions.get(sessionId)
  session.lastActivity = new Date()
  return session
}

async function generateAIResponse(message: string, context: any, session: any): Promise<string> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Build conversation history
    const conversationHistory = session.messages.slice(-10).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an advanced Enterprise AI Assistant for a business automation platform. You help with:
            - Customer support and inquiries
            - Workflow automation and process optimization
            - CRM data analysis and insights
            - Email composition and scheduling
            - Report generation and analytics
            - Task management and project coordination

            Respond in a professional, helpful manner. Be concise but informative. Suggest automation opportunities when relevant.`
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error generating AI response:', error)
    return generateFallbackResponse(message)
  }
}

async function generateAutomationActions(message: string, aiResponse: string): Promise<AutomationAction[]> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return generateDefaultActions(message)
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Analyze the user message and AI response to suggest relevant automation actions. Return a JSON array of 2-3 actions with these fields:
            - type: action category (crm, schedule, email, ticket, report, workflow)
            - label: human-readable action name
            - icon: icon name (User, Calendar, Mail, FileText, BarChart3, Workflow)
            - priority: priority level (low, medium, high)

            Focus on practical business automation tasks.`
          },
          {
            role: 'user',
            content: `User message: "${message}"\nAI response: "${aiResponse}"\n\nSuggest relevant automation actions.`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      return generateDefaultActions(message)
    }

    const data = await response.json()
    const actionsText = data.choices[0].message.content
    try {
      return JSON.parse(actionsText)
    } catch (parseError) {
      return generateDefaultActions(message)
    }
  } catch (error) {
    console.error('Error generating actions:', error)
    return generateDefaultActions(message)
  }
}

function generateFallbackResponse(message: string): string {
  const responses = {
    'hello': "Hello! I'm your Advanced AI Assistant. I can help with customer inquiries, automate workflows, integrate with your CRM, and much more. What can I help you with today?",
    'help': "I can assist with:\n• Customer support and inquiries\n• Workflow automation\n• CRM data analysis\n• Email composition and scheduling\n• Report generation\n• Task management\n\nWhat would you like to work on?",
    'customer': "I can help with customer-related tasks. I can check customer data, analyze sentiment, create support tickets, and automate follow-up sequences. What specific customer issue are you dealing with?",
    'workflow': "I can help you create and manage workflows. I can automate email sequences, task assignments, CRM updates, and more. Would you like to see available workflow templates or create a custom one?",
    'report': "I can generate various reports including customer analytics, conversation metrics, workflow performance, and ROI analysis. What type of report would you like me to create?",
    'default': "I understand you're asking about '" + message + "'. Let me analyze this and provide you with the most relevant information and automation options. I can also integrate with your existing systems to get more context."
  }

  const lowerMessage = message.toLowerCase()
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }
  return responses.default
}

function generateDefaultActions(message: string): AutomationAction[] {
  const actions = [
    { type: 'crm', label: 'Check Customer Data', icon: 'User', priority: 'medium' as const },
    { type: 'schedule', label: 'Schedule Meeting', icon: 'Calendar', priority: 'medium' as const },
    { type: 'email', label: 'Send Email', icon: 'Mail', priority: 'medium' as const },
    { type: 'ticket', label: 'Create Support Ticket', icon: 'FileText', priority: 'high' as const },
    { type: 'report', label: 'Generate Report', icon: 'BarChart3', priority: 'low' as const },
    { type: 'workflow', label: 'Start Workflow', icon: 'Workflow', priority: 'medium' as const }
  ]

  // Return 2-3 relevant actions based on message content
  const relevantActions = actions.filter(action => {
    const lowerMessage = message.toLowerCase()
    return lowerMessage.includes(action.type) ||
           lowerMessage.includes(action.label.toLowerCase()) ||
           Math.random() > 0.5 // Random selection for demo
  })

  return relevantActions.slice(0, 3)
}

function updateConversationAnalytics(message: string, session: any, processingTime: number): ConversationAnalytics {
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'happy', 'satisfied']
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed', 'problem']

  const lowerMessage = message.toLowerCase()
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'

  if (positiveWords.some(word => lowerMessage.includes(word))) {
    sentiment = 'positive'
  } else if (negativeWords.some(word => lowerMessage.includes(word))) {
    sentiment = 'negative'
  }

  // Simple intent detection
  const intents = {
    'customer_support': ['help', 'support', 'issue', 'problem', 'customer'],
    'workflow': ['workflow', 'automate', 'process', 'sequence'],
    'analytics': ['report', 'analytics', 'data', 'metrics', 'performance'],
    'scheduling': ['schedule', 'meeting', 'appointment', 'call', 'demo'],
    'email': ['email', 'send', 'compose', 'notification']
  }

  let detectedIntent = 'general'
  let confidence = 0.5

  for (const [intent, keywords] of Object.entries(intents)) {
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword))
    if (matches.length > 0) {
      detectedIntent = intent
      confidence = Math.min(0.9, 0.5 + (matches.length * 0.1))
      break
    }
  }

  return {
    messageCount: session.messageCount,
    sentiment,
    intent: detectedIntent,
    confidence,
    processingTime
  }
}

function suggestNextSteps(message: string, aiResponse: string, session: any): string[] {
  const lowerMessage = message.toLowerCase()
  const steps = []

  if (lowerMessage.includes('customer') || lowerMessage.includes('support')) {
    steps.push('Create a support ticket for tracking')
    steps.push('Schedule a follow-up call')
  }

  if (lowerMessage.includes('workflow') || lowerMessage.includes('automate')) {
    steps.push('Review available workflow templates')
    steps.push('Set up automation triggers')
  }

  if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
    steps.push('Generate detailed analytics report')
    steps.push('Schedule regular reporting')
  }

  if (lowerMessage.includes('email') || lowerMessage.includes('send')) {
    steps.push('Compose and send email')
    steps.push('Set up email automation')
  }

  if (steps.length === 0) {
    steps.push('Continue the conversation')
    steps.push('Explore automation opportunities')
  }

  return steps.slice(0, 3)
}

async function analyzeFilesWithAI(files: any[]): Promise<any> {
  // Simulate file analysis for now
  return {
    analysis: "Document analyzed successfully",
    insights: ["Key insight 1", "Key insight 2"],
    actions: ["Schedule follow-up", "Create task"],
    files: files.map(file => ({
      name: file.name,
      type: file.type,
      analysis: "File processed successfully"
    }))
  }
}

function getConversationAnalytics() {
  return {
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
  }
}

function getPerformanceAnalytics() {
  return {
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
  }
}

function getWorkflowAnalytics() {
  return {
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
  }
}

function getBusinessImpactAnalytics() {
  return {
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
      workflowsExecuted: "1,247",
      automationRate: "87.5%"
    }
  }
}

function getWorkflowTemplates() {
  return [
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
  ]
}

function executeWorkflow(workflowId: number, parameters: any) {
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
  }

  const workflow = workflows[workflowId as keyof typeof workflows] || {
    name: "Unknown Workflow",
    steps: []
  }

  return {
    workflowId,
    name: workflow.name,
    status: "executing",
    steps: workflow.steps,
    startedAt: new Date(),
    estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  }
}
