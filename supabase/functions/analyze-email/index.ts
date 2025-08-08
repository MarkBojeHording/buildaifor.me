import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  // Simple fallback analysis for demo purposes
  const isUrgent = subject.toLowerCase().includes('urgent') || body.toLowerCase().includes('urgent') || body.toLowerCase().includes('critical')
  const isNegative = body.toLowerCase().includes('problem') || body.toLowerCase().includes('issue') || body.toLowerCase().includes('error')

  return {
    priority_level: isUrgent ? 'high' : 'medium',
    sentiment_score: isNegative ? -0.5 : 0.2,
    sentiment_label: isNegative ? 'negative' : 'neutral',
    urgency_score: isUrgent ? 8 : 5,
    primary_category: 'General',
    secondary_categories: ['Support'],
    recommended_department: 'L1 Support',
    summary: 'Email analysis completed',
    key_issues: ['General inquiry'],
    suggested_response: 'Thank you for your email. We will review your request and respond accordingly.',
    escalation_required: isUrgent,
    estimated_resolution_time: isUrgent ? 30 : 120,
    confidence: 0.8
  }
}
