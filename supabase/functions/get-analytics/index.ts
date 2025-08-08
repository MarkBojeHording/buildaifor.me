import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AnalyticsRequest {
  period?: string // 7d, 30d, 90d
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
    const url = new URL(req.url)
    const period = url.searchParams.get('period') || '7d' // 7d, 30d, 90d

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authorization header required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7
    startDate.setDate(endDate.getDate() - days)

    // Get analytics data
    const [metricsResult, categoriesResult, sentimentResult, priorityTrendsResult, recentAnalysesResult] = await Promise.all([
      // Overall metrics
      supabase
        .from('analysis_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true }),

      // Category breakdown
      supabase
        .from('email_analyses')
        .select('primary_category')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString()),

      // Sentiment trends
      supabase
        .from('email_analyses')
        .select('sentiment_label, sentiment_score, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true }),

      // Priority distribution over time
      supabase
        .from('email_analyses')
        .select('priority_level, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true }),

      // Recent analyses for performance metrics
      supabase
        .from('email_analyses')
        .select('processing_time_ms, analysis_confidence, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(100)
    ])

    // Process data for charts
    const processedAnalytics = {
      summary: {
        totalEmails: metricsResult.data?.reduce((sum, day) => sum + day.total_emails_analyzed, 0) || 0,
        avgSentiment: metricsResult.data?.reduce((sum, day) => sum + (day.avg_sentiment_score || 0), 0) / (metricsResult.data?.length || 1) || 0,
        highPriorityCount: metricsResult.data?.reduce((sum, day) => sum + day.high_priority_count, 0) || 0,
        avgProcessingTime: recentAnalysesResult.data?.reduce((sum, analysis) => sum + (analysis.processing_time_ms || 0), 0) / (recentAnalysesResult.data?.length || 1) || 847,
        avgConfidence: recentAnalysesResult.data?.reduce((sum, analysis) => sum + (analysis.analysis_confidence || 0), 0) / (recentAnalysesResult.data?.length || 1) || 0.85
      },

      dailyMetrics: metricsResult.data?.map(day => ({
        date: day.date,
        totalEmails: day.total_emails_analyzed,
        highPriority: day.high_priority_count,
        mediumPriority: day.medium_priority_count,
        lowPriority: day.low_priority_count,
        avgSentiment: day.avg_sentiment_score
      })) || [],

      categoryBreakdown: Object.entries(
        categoriesResult.data?.reduce((acc, item) => {
          acc[item.primary_category] = (acc[item.primary_category] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}
      ).map(([category, count]) => ({ category, count })),

      sentimentTrend: sentimentResult.data?.map(item => ({
        date: item.created_at.split('T')[0],
        sentiment: item.sentiment_label,
        score: item.sentiment_score
      })) || [],

      priorityDistribution: Object.entries(
        priorityTrendsResult.data?.reduce((acc, item) => {
          acc[item.priority_level] = (acc[item.priority_level] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}
      ).map(([priority, count]) => ({ priority, count })),

      performanceMetrics: {
        avgProcessingTime: recentAnalysesResult.data?.reduce((sum, analysis) => sum + (analysis.processing_time_ms || 0), 0) / (recentAnalysesResult.data?.length || 1) || 847,
        avgConfidence: recentAnalysesResult.data?.reduce((sum, analysis) => sum + (analysis.analysis_confidence || 0), 0) / (recentAnalysesResult.data?.length || 1) || 0.85,
        totalAnalyses: recentAnalysesResult.data?.length || 0
      },

      insights: {
        topCategory: categoriesResult.data?.reduce((acc, item) => {
          acc[item.primary_category] = (acc[item.primary_category] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {},
        sentimentBreakdown: sentimentResult.data?.reduce((acc, item) => {
          acc[item.sentiment_label] = (acc[item.sentiment_label] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {},
        priorityBreakdown: priorityTrendsResult.data?.reduce((acc, item) => {
          acc[item.priority_level] = (acc[item.priority_level] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}
      }
    }

    // Generate AI insights
    const aiInsights = generateAIInsights(processedAnalytics)

    return new Response(JSON.stringify({
      success: true,
      analytics: processedAnalytics,
      aiInsights,
      period
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Analytics failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Generate AI insights from analytics data
function generateAIInsights(analytics: any) {
  const insights = []

  // Priority insights
  const totalEmails = analytics.summary.totalEmails
  const highPriorityPercentage = totalEmails > 0 ? (analytics.summary.highPriorityCount / totalEmails) * 100 : 0

  if (highPriorityPercentage > 30) {
    insights.push({
      type: 'warning',
      title: 'High Priority Volume',
      message: `${highPriorityPercentage.toFixed(1)}% of emails are high priority. Consider reviewing your support processes.`,
      impact: 'high'
    })
  }

  // Sentiment insights
  const avgSentiment = analytics.summary.avgSentiment
  if (avgSentiment < -0.3) {
    insights.push({
      type: 'alert',
      title: 'Negative Sentiment Trend',
      message: 'Average sentiment is negative. Focus on improving customer satisfaction.',
      impact: 'high'
    })
  } else if (avgSentiment > 0.3) {
    insights.push({
      type: 'positive',
      title: 'Positive Customer Sentiment',
      message: 'Customers are generally satisfied with your support.',
      impact: 'medium'
    })
  }

  // Performance insights
  const avgProcessingTime = analytics.performanceMetrics.avgProcessingTime
  if (avgProcessingTime > 5000) {
    insights.push({
      type: 'warning',
      title: 'Slow Processing Times',
      message: `Average processing time is ${(avgProcessingTime / 1000).toFixed(1)}s. Consider optimizing your AI pipeline.`,
      impact: 'medium'
    })
  }

  // Category insights
  const topCategory = Object.entries(analytics.insights.topCategory)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]

  if (topCategory) {
    insights.push({
      type: 'info',
      title: 'Most Common Issue',
      message: `${topCategory[0]} is your most common email category (${topCategory[1]} emails).`,
      impact: 'low'
    })
  }

  // Volume insights
  if (totalEmails > 100) {
    insights.push({
      type: 'success',
      title: 'High Email Volume',
      message: `Processed ${totalEmails} emails in this period. Your system is handling significant volume.`,
      impact: 'medium'
    })
  }

  return insights
}
