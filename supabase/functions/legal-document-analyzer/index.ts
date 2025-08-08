// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Import core modules
import { DocumentProcessor } from './document-processor.ts'
import { EnhancedResponseGenerator } from './enhanced-response-generator.ts'
import { ChatbotResponseHandler } from './chatbot-response-handler.ts'
import { CitationManager } from './citation-manager.ts'
import { getDocumentData } from './document-data.ts'

// Types
interface ChatRequest {
  message: string
  document_id: string
  conversation_history?: Array<{role: string, content: string}>
}

interface ChatResponse {
  response: string
  citations: Array<{
    section_id: string
    page: number
    title: string
    relevance_score: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }>
  confidence: number
  follow_up_questions: string[]
  analysis_summary?: {
    key_points: string[]
    risks_identified: string[]
    compliance_score: number
  }
}

interface DocumentSection {
  id: string
  section: string
  page: number
  content: string
}

interface Document {
  id: string
  title: string
  sections: DocumentSection[]
}

// Initialize core services
const documentProcessor = new DocumentProcessor()
const responseGenerator = new EnhancedResponseGenerator()
const responseHandler = new ChatbotResponseHandler()
const citationManager = new CitationManager()

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

    // Route handling
    if (endpoint === 'health') {
      return await handleHealthCheck(req)
    } else if (endpoint === 'documents') {
      return await handleDocuments(req)
    } else if (endpoint === 'legal-document-analyzer') {
      return await handleChat(req)
    } else {
      return await handleChat(req) // Default to chat
    }
  } catch (error) {
    console.error('Error in Legal Document Analyzer:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while processing your request'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Main chat handler - EXACT REPLICATION from Node.js server
async function handleChat(req: Request): Promise<Response> {
  try {
    const body: ChatRequest = await req.json()
    const { message, document_id, conversation_history } = body

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!document_id) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const startTime = Date.now()

    // Get document data
    const document = getDocumentData(document_id)
    if (!document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Process the message using the chatbot response handler
    const rawResponse = await responseHandler.generateResponse(message, document_id, document)

    // Enhance the response with conversational tone and better formatting
    const enhancedResponse = responseGenerator.formatResponse(rawResponse, message, document_id)

    // Process citations
    const processedCitations = citationManager.processCitations(enhancedResponse.citations, document)

    // Calculate processing time
    const processingTime = Date.now() - startTime

    // Generate analysis summary if confidence is high enough
    let analysisSummary = undefined
    if (enhancedResponse.confidence > 0.7) {
      analysisSummary = await documentProcessor.generateAnalysisSummary(message, document, processedCitations)
    }

    const response: ChatResponse = {
      response: enhancedResponse.message,
      citations: processedCitations,
      confidence: enhancedResponse.confidence,
      follow_up_questions: enhancedResponse.followUp ? [enhancedResponse.followUp] : [],
      analysis_summary: analysisSummary
    }

    console.log(`Legal Document Analysis completed in ${processingTime}ms with confidence: ${enhancedResponse.confidence}`)

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
        citations: [],
        confidence: 0,
        follow_up_questions: ['Try rephrasing your question', 'Check your document selection'],
        analysis_summary: undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Health check endpoint
async function handleHealthCheck(req: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'legal-document-analyzer',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: [
        'Document Analysis',
        'Citation Management',
        'Risk Assessment',
        'Compliance Checking',
        'Conversational AI'
      ]
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Documents endpoint
async function handleDocuments(req: Request): Promise<Response> {
  try {
    const documents = getDocumentData()

    return new Response(
      JSON.stringify({
        documents: Object.keys(documents).map(id => ({
          id,
          title: documents[id].title,
          sections_count: documents[id].sections.length,
          pages: Math.max(...documents[id].sections.map(s => s.page))
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in handleDocuments:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve documents' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}
