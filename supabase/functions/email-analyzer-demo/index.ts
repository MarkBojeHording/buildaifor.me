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
    const { subject, body, senderEmail, receivedAt } = await req.json() as EmailAnalysisRequest

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

      // Fallback to demo analysis
      const fallbackAnalysis = getFallbackAnalysis(subject, body, senderEmail)
      const processingTime = Date.now() - startTime

      return new Response(JSON.stringify({
        success: true,
        analysis: fallbackAnalysis,
        processing_time_ms: processingTime,
        message: 'Using fallback analysis due to OpenAI API error'
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
      // Fallback to demo analysis
      analysisResult = getFallbackAnalysis(subject, body, senderEmail)
    }

    const processingTime = Date.now() - startTime

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult,
      processing_time_ms: processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Analysis failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function getFallbackAnalysis(subject: string, body: string, senderEmail: string) {
  // Enhanced fallback analysis for demo purposes
  const content = (subject + ' ' + body).toLowerCase()

  // Enhanced urgency detection
  const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'broken', 'not working', 'losing', 'costing', 'unacceptable']
  const isUrgent = urgentKeywords.some(keyword => content.includes(keyword))

  // Enhanced sentiment detection
  const negativeKeywords = ['problem', 'issue', 'error', 'broken', 'down', 'unacceptable', 'angry', 'frustrated', 'complaint', 'dissatisfied', 'cancel', 'losing', 'costing']
  const positiveKeywords = ['thank', 'great', 'excellent', 'love', 'happy', 'satisfied', 'working', 'success']

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
  if (content.includes('payment') || content.includes('billing') || content.includes('invoice') || content.includes('charged')) {
    primaryCategory = 'Billing & Payments'
  } else if (content.includes('bug') || content.includes('error') || content.includes('technical') || content.includes('api')) {
    primaryCategory = 'Technical Support'
  } else if (content.includes('feature') || content.includes('request') || content.includes('enhancement')) {
    primaryCategory = 'Feature Requests'
  } else if (content.includes('complaint') || content.includes('dissatisfied') || content.includes('unhappy')) {
    primaryCategory = 'Complaints'
  } else if (isUrgent) {
    primaryCategory = 'Critical Issues'
  }

  // Enhanced urgency scoring
  let urgencyScore = 5
  if (isUrgent) {
    urgencyScore = 9
    if (content.includes('losing') || content.includes('costing') || content.includes('unacceptable')) {
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
  }

  // Enhanced summary
  let summary = 'Email analysis completed'
  if (isUrgent) {
    summary = `Urgent ${primaryCategory.toLowerCase()} issue requiring immediate attention`
  } else if (sentimentLabel === 'negative') {
    summary = `Customer dissatisfaction with ${primaryCategory.toLowerCase()}`
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
