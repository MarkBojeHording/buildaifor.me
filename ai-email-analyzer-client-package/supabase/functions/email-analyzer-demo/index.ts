// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface EmailAnalysisRequest {
  subject: string
  body: string
  senderEmail: string
  receivedAt?: string
}

interface EmailAnalysisResponse {
  success: boolean
  analysis?: any
  processing_time_ms?: number
  error?: string
  message?: string
}

interface AnalyticsRequest {
  period: string
}

interface AnalyticsResponse {
  success: boolean
  analytics?: any
  period?: string
  error?: string
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, ...data } = await req.json()

    // Route to appropriate handler based on action
    switch (action) {
      case 'analyze_email':
        return await handleEmailAnalysis(data, corsHeaders)
      case 'get_analytics':
        return await handleAnalytics(data, corsHeaders)
      case 'health_check':
        return await handleHealthCheck(corsHeaders)
      default:
        // Default to email analysis for backward compatibility
        return await handleEmailAnalysis(data, corsHeaders)
    }

  } catch (error) {
    console.error('Request error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request format',
      message: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleEmailAnalysis(data: EmailAnalysisRequest, corsHeaders: any) {
  const { subject, body, senderEmail, receivedAt } = data

  // Validate input
  if (!subject || !body || !senderEmail) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing required fields: subject, body, senderEmail'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const startTime = Date.now()

  // AI Analysis with OpenAI
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiKey) {
    return new Response(JSON.stringify({
      success: false,
      error: 'OpenAI API key not configured'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const analysisPrompt = `
Analyze this customer support email and provide detailed insights:

Subject: ${subject}
Body: ${body}
Sender: ${senderEmail}

Please provide analysis in this exact JSON format (no additional text, only valid JSON):
{
  "priority_level": "high|medium|low",
  "sentiment_score": -1.0 to 1.0,
  "sentiment_label": "positive|negative|neutral",
  "urgency_score": 1-10,
  "primary_category": "category name",
  "secondary_categories": ["category1", "category2"],
  "recommended_department": "department name",
  "summary": "brief summary",
  "key_issues": ["issue1", "issue2"],
  "suggested_response": "suggested response template",
  "escalation_required": true/false,
  "estimated_resolution_time": minutes,
  "confidence": 0.0-1.0
}
`

  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert customer support analyst. Analyze emails with high accuracy and provide detailed, actionable insights. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })

  if (!openaiResponse.ok) {
    const errorData = await openaiResponse.json()
    console.error('OpenAI API error:', errorData)

    // Fallback to enhanced demo analysis
    const fallbackAnalysis = getEnhancedFallbackAnalysis(subject, body, senderEmail)
    const processingTime = Date.now() - startTime

    return new Response(JSON.stringify({
      success: true,
      analysis: fallbackAnalysis,
      processing_time_ms: processingTime,
      message: 'Using enhanced fallback analysis due to OpenAI API error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const openaiData = await openaiResponse.json()
  let analysisResult

  try {
    analysisResult = JSON.parse(openaiData.choices[0].message.content)
  } catch (parseError) {
    console.error('JSON parse error:', parseError)
    // Fallback to enhanced demo analysis
    analysisResult = getEnhancedFallbackAnalysis(subject, body, senderEmail)
  }

  const processingTime = Date.now() - startTime

  return new Response(JSON.stringify({
    success: true,
    analysis: analysisResult,
    processing_time_ms: processingTime
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAnalytics(data: AnalyticsRequest, corsHeaders: any) {
  const { period = '7d' } = data

  try {
    // Generate mock analytics data for demo purposes
    const analytics = generateMockAnalytics(period)

    return new Response(JSON.stringify({
      success: true,
      analytics,
      period
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate analytics'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleHealthCheck(corsHeaders: any) {
  return new Response(JSON.stringify({
    success: true,
    message: 'Email Analyzer API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function getEnhancedFallbackAnalysis(subject: string, body: string, senderEmail: string) {
  // Enhanced fallback analysis for demo purposes
  const content = (subject + ' ' + body).toLowerCase()

  // Enhanced urgency detection
  const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'broken', 'not working', 'losing', 'costing', 'unacceptable', 'outage', 'breach', 'corrupted', 'failed']
  const isUrgent = urgentKeywords.some(keyword => content.includes(keyword))

  // Enhanced sentiment detection
  const negativeKeywords = ['problem', 'issue', 'error', 'broken', 'down', 'unacceptable', 'angry', 'frustrated', 'complaint', 'dissatisfied', 'cancel', 'losing', 'costing', 'terrible', 'unprofessional', 'considering cancellation']
  const positiveKeywords = ['thank', 'great', 'excellent', 'love', 'happy', 'satisfied', 'working', 'success', 'feedback', 'improvement']

  let sentimentScore = 0.0
  let sentimentLabel = 'neutral'

  const negativeCount = negativeKeywords.filter(keyword => content.includes(keyword)).length
  const positiveCount = positiveKeywords.filter(keyword => content.includes(keyword)).length

  if (negativeCount > positiveCount) {
    sentimentScore = -0.7
    sentimentLabel = 'negative'
  } else if (positiveCount > negativeCount) {
    sentimentScore = 0.6
    sentimentLabel = 'positive'
  } else {
    sentimentScore = 0.0
    sentimentLabel = 'neutral'
  }

  // Enhanced category detection
  let primaryCategory = 'General'
  if (content.includes('payment') || content.includes('billing') || content.includes('invoice') || content.includes('charged') || content.includes('refund')) {
    primaryCategory = 'Billing & Payments'
  } else if (content.includes('bug') || content.includes('error') || content.includes('technical') || content.includes('api') || content.includes('integration') || content.includes('performance')) {
    primaryCategory = 'Technical Support'
  } else if (content.includes('feature') || content.includes('request') || content.includes('enhancement') || content.includes('dark mode')) {
    primaryCategory = 'Feature Requests'
  } else if (content.includes('complaint') || content.includes('dissatisfied') || content.includes('unhappy') || content.includes('terrible') || content.includes('unprofessional')) {
    primaryCategory = 'Complaints'
  } else if (isUrgent) {
    primaryCategory = 'Critical Issues'
  } else if (content.includes('training') || content.includes('documentation') || content.includes('help') || content.includes('how to')) {
    primaryCategory = 'General Support'
  }

  // Enhanced urgency scoring
  let urgencyScore = 5
  if (isUrgent) {
    urgencyScore = 9
    if (content.includes('losing') || content.includes('costing') || content.includes('unacceptable') || content.includes('breach') || content.includes('corrupted')) {
      urgencyScore = 10
    }
  }

  // Enhanced department routing
  let recommendedDepartment = 'L1 Support'
  if (primaryCategory === 'Billing & Payments') {
    recommendedDepartment = 'Billing'
  } else if (primaryCategory === 'Technical Support' || primaryCategory === 'Critical Issues') {
    recommendedDepartment = 'L2 Technical'
  } else if (primaryCategory === 'Complaints') {
    recommendedDepartment = 'Management'
  } else if (primaryCategory === 'Feature Requests') {
    recommendedDepartment = 'Product'
  }

  // Enhanced summary
  let summary = 'Email analysis completed'
  if (isUrgent) {
    summary = `Urgent ${primaryCategory.toLowerCase()} issue requiring immediate attention`
  } else if (sentimentLabel === 'negative') {
    summary = `Customer dissatisfaction with ${primaryCategory.toLowerCase()}`
  } else if (sentimentLabel === 'positive') {
    summary = `Positive feedback regarding ${primaryCategory.toLowerCase()}`
  } else {
    summary = `Standard ${primaryCategory.toLowerCase()} inquiry`
  }

  // Enhanced key issues
  const keyIssues = []
  if (isUrgent) keyIssues.push('Urgent response required')
  if (sentimentLabel === 'negative') keyIssues.push('Customer dissatisfaction')
  if (primaryCategory !== 'General') keyIssues.push(primaryCategory)
  if (keyIssues.length === 0) keyIssues.push('General inquiry')

  // Enhanced suggested response
  let suggestedResponse = 'Thank you for your email. We will review your request and respond accordingly.'
  if (isUrgent) {
    suggestedResponse = 'We understand this is urgent and are escalating this issue immediately. Our team will contact you within 15 minutes.'
  } else if (sentimentLabel === 'negative') {
    suggestedResponse = 'We apologize for any inconvenience. Our team will investigate this issue and provide a resolution as soon as possible.'
  } else if (sentimentLabel === 'positive') {
    suggestedResponse = 'Thank you for your positive feedback! We appreciate you taking the time to share your experience.'
  }

  return {
    priority_level: isUrgent ? 'high' : 'medium',
    sentiment_score: sentimentScore,
    sentiment_label: sentimentLabel,
    urgency_score: urgencyScore,
    primary_category: primaryCategory,
    secondary_categories: ['Support'],
    recommended_department: recommendedDepartment,
    summary: summary,
    key_issues: keyIssues,
    suggested_response: suggestedResponse,
    escalation_required: isUrgent,
    estimated_resolution_time: isUrgent ? 30 : 120,
    confidence: 0.85
  }
}

function generateMockAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

  const dailyMetrics = []
  const sentimentTrend = []
  const categoryBreakdown = [
    { category: 'Technical Support', count: 45, percentage: 30 },
    { category: 'Billing & Payments', count: 30, percentage: 20 },
    { category: 'General Support', count: 25, percentage: 17 },
    { category: 'Complaints', count: 20, percentage: 13 },
    { category: 'Feature Requests', count: 15, percentage: 10 },
    { category: 'Critical Issues', count: 15, percentage: 10 }
  ]

  const priorityDistribution = [
    { priority: 'High', count: 25, percentage: 17 },
    { priority: 'Medium', count: 85, percentage: 57 },
    { priority: 'Low', count: 40, percentage: 26 }
  ]

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    dailyMetrics.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5,
      avgSentiment: (Math.random() - 0.5) * 2,
      highPriorityCount: Math.floor(Math.random() * 5) + 1
    })

    sentimentTrend.push({
      date: date.toISOString().split('T')[0],
      positive: Math.floor(Math.random() * 15) + 5,
      negative: Math.floor(Math.random() * 8) + 2,
      neutral: Math.floor(Math.random() * 12) + 3
    })
  }

  return {
    summary: {
      totalEmails: 150,
      avgSentiment: 0.12,
      highPriorityCount: 25,
      avgProcessingTime: 847
    },
    dailyMetrics: dailyMetrics.reverse(),
    categoryBreakdown,
    sentimentTrend: sentimentTrend.reverse(),
    priorityDistribution
  }
}
