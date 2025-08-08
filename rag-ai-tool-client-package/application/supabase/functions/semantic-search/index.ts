// RAG AI Tool - Semantic Search Edge Function
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface SearchRequest {
  query: string;
  filters?: {
    document_ids?: string[];
    file_types?: string[];
    date_range?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
  limit?: number;
  similarity_threshold?: number;
  action?: string;
  partial_query?: string;
}

interface SearchResult {
  id: string;
  document_id: string;
  document_title: string;
  content: string;
  similarity_score: number;
  metadata?: {
    page_number?: number;
    section_title?: string;
    file_name?: string;
    file_type?: string;
  };
  highlights?: string[];
}

interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  total_results: number;
  processing_time_ms: number;
  query: string;
  generated_answer?: {
    content: string;
    confidence: number;
    sources: string[];
    model_used: string;
  };
  error?: string;
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
    const startTime = Date.now()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const requestData = await req.json() as SearchRequest

    // Handle different action types
    switch (requestData.action) {
      case 'health_check':
        return handleHealthCheck(corsHeaders)
      case 'get_suggestions':
        return await handleGetSuggestions(requestData, supabase, corsHeaders)
      default:
        return await handleSemanticSearch(requestData, supabase, openaiApiKey, startTime, corsHeaders)
    }

  } catch (error: any) {
    console.error('Semantic search error:', error)
    return new Response(JSON.stringify({
      success: false,
      results: [],
      total_results: 0,
      processing_time_ms: 0,
      query: '',
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleSemanticSearch(
  requestData: SearchRequest,
  supabase: any,
  openaiApiKey: string,
  startTime: number,
  corsHeaders: any
): Promise<Response> {
  const { query, filters = {}, limit = 10, similarity_threshold = 0.7 } = requestData

  if (!query || query.trim() === '') {
    return new Response(JSON.stringify({
      success: false,
      results: [],
      total_results: 0,
      processing_time_ms: Date.now() - startTime,
      query: query || '',
      error: 'Query cannot be empty'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, openaiApiKey)

    if (!queryEmbedding) {
      throw new Error('Failed to generate query embedding')
    }

    // Step 2: Perform vector similarity search
    let searchQuery = supabase
      .from('document_chunks')
      .select(`
        id,
        content,
        metadata,
        documents!inner(
          id,
          title,
          file_name,
          file_type
        )
      `)
      .order('similarity_score', { ascending: false })
      .limit(limit * 2) // Get more results to filter later

    // Apply filters
    if (filters.document_ids && filters.document_ids.length > 0) {
      searchQuery = searchQuery.in('document_id', filters.document_ids)
    }

    if (filters.file_types && filters.file_types.length > 0) {
      searchQuery = searchQuery.in('documents.file_type', filters.file_types)
    }

    if (filters.date_range) {
      searchQuery = searchQuery
        .gte('documents.upload_date', filters.date_range.start)
        .lte('documents.upload_date', filters.date_range.end)
    }

    const { data: chunks, error: searchError } = await searchQuery

    if (searchError) {
      throw new Error(`Search error: ${searchError.message}`)
    }

    // Step 3: Calculate similarity scores and filter results
    const results: SearchResult[] = []

    if (chunks && chunks.length > 0) {
      for (const chunk of chunks) {
        // Calculate cosine similarity (simplified)
        const similarity = calculateCosineSimilarity(queryEmbedding, chunk.embedding || [])

        if (similarity >= similarity_threshold) {
          results.push({
            id: chunk.id,
            document_id: chunk.documents.id,
            document_title: chunk.documents.title,
            content: chunk.content,
            similarity_score: similarity,
            metadata: {
              ...chunk.metadata,
              file_name: chunk.documents.file_name,
              file_type: chunk.documents.file_type
            },
            highlights: extractHighlights(chunk.content, query)
          })
        }
      }
    }

    // Sort by similarity score and limit results
    results.sort((a, b) => b.similarity_score - a.similarity_score)
    const finalResults = results.slice(0, limit)

    // Step 4: Generate AI answer if we have good results
    let generatedAnswer = undefined
    if (finalResults.length > 0 && openaiApiKey) {
      generatedAnswer = await generateAIAnswer(query, finalResults, openaiApiKey)
    }

    const processingTime = Date.now() - startTime

    // Step 5: Track search event for analytics
    try {
      await trackSearchEvent(supabase, query, finalResults.length, processingTime)
    } catch (trackingError) {
      console.error('Failed to track search event:', trackingError)
    }

    return new Response(JSON.stringify({
      success: true,
      results: finalResults,
      total_results: finalResults.length,
      processing_time_ms: processingTime,
      query,
      generated_answer: generatedAnswer
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Search processing error:', error)

    // Fallback to keyword search if vector search fails
    const fallbackResults = await performKeywordSearch(query, supabase, limit)

    return new Response(JSON.stringify({
      success: false,
      results: fallbackResults,
      total_results: fallbackResults.length,
      processing_time_ms: Date.now() - startTime,
      query,
      error: `Vector search failed, using keyword fallback: ${error.message}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleGetSuggestions(
  requestData: SearchRequest,
  supabase: any,
  corsHeaders: any
): Promise<Response> {
  try {
    const { partial_query = '' } = requestData

    if (partial_query.length < 2) {
      return new Response(JSON.stringify({
        success: true,
        suggestions: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get recent popular queries
    const { data: recentQueries } = await supabase
      .from('search_events')
      .select('query')
      .ilike('query', `%${partial_query}%`)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get document titles that match
    const { data: documents } = await supabase
      .from('documents')
      .select('title')
      .ilike('title', `%${partial_query}%`)
      .limit(5)

    const suggestions = []

    // Add query suggestions
    if (recentQueries) {
      for (const item of recentQueries) {
        suggestions.push({
          text: item.query,
          type: 'query',
          score: 0.9
        })
      }
    }

    // Add document suggestions
    if (documents) {
      for (const doc of documents) {
        suggestions.push({
          text: doc.title,
          type: 'document',
          score: 0.8
        })
      }
    }

    return new Response(JSON.stringify({
      success: true,
      suggestions: suggestions.slice(0, 8)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      suggestions: [],
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

function handleHealthCheck(corsHeaders: any): Response {
  return new Response(JSON.stringify({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'semantic-search',
    version: '1.0.0'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Embedding generation error:', error)
    return null
  }
}

async function generateAIAnswer(
  query: string,
  results: SearchResult[],
  apiKey: string
): Promise<{ content: string; confidence: number; sources: string[]; model_used: string } | undefined> {
  try {
    const context = results.slice(0, 3).map(r => r.content).join('\n\n')
    const sources = results.slice(0, 3).map(r => r.document_title)

    const prompt = `Based on the following context, provide a comprehensive answer to the user's question.

Question: ${query}

Context:
${context}

Please provide a detailed, accurate answer based only on the information provided in the context. If the context doesn't contain enough information to fully answer the question, say so clearly.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on provided context. Be accurate and cite the context when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const answer = data.choices[0].message.content

    return {
      content: answer,
      confidence: 0.85, // Base confidence, could be calculated based on result scores
      sources: sources,
      model_used: 'gpt-4o-mini'
    }
  } catch (error) {
    console.error('AI answer generation error:', error)
    return undefined
  }
}

function calculateCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

function extractHighlights(content: string, query: string): string[] {
  const queryWords = query.toLowerCase().split(/\s+/)
  const highlights: string[] = []

  for (const word of queryWords) {
    if (word.length > 2 && content.toLowerCase().includes(word)) {
      highlights.push(word)
    }
  }

  return highlights.slice(0, 5)
}

async function performKeywordSearch(
  query: string,
  supabase: any,
  limit: number
): Promise<SearchResult[]> {
  try {
    const { data: chunks } = await supabase
      .from('document_chunks')
      .select(`
        id,
        content,
        metadata,
        documents!inner(
          id,
          title,
          file_name,
          file_type
        )
      `)
      .textSearch('content', query)
      .limit(limit)

    if (!chunks) return []

    return chunks.map((chunk: any) => ({
      id: chunk.id,
      document_id: chunk.documents.id,
      document_title: chunk.documents.title,
      content: chunk.content,
      similarity_score: 0.6, // Default score for keyword search
      metadata: {
        ...chunk.metadata,
        file_name: chunk.documents.file_name,
        file_type: chunk.documents.file_type
      },
      highlights: extractHighlights(chunk.content, query)
    }))
  } catch (error) {
    console.error('Keyword search error:', error)
    return []
  }
}

async function trackSearchEvent(
  supabase: any,
  query: string,
  results_count: number,
  processing_time_ms: number
): Promise<void> {
  try {
    await supabase
      .from('search_events')
      .insert({
        query,
        results_count,
        processing_time_ms,
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to track search event:', error)
  }
}
