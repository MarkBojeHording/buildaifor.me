// RAG AI Tool - Document Processor Edge Function
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface ProcessingOptions {
  extract_images?: boolean;
  chunk_size?: number;
  overlap_size?: number;
  language?: string;
}

interface DocumentChunk {
  content: string;
  metadata: {
    page_number?: number;
    section_title?: string;
    chunk_type: 'header' | 'paragraph' | 'list' | 'code' | 'table';
    chunk_index: number;
  };
}

interface Document {
  id: string;
  title: string;
  content: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  chunks_count: number;
  user_id?: string;
  metadata?: {
    language?: string;
    page_count?: number;
    word_count?: number;
    tags?: string[];
  };
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

    switch (req.method) {
      case 'POST':
        return await handleDocumentUpload(req, supabase, openaiApiKey, startTime, corsHeaders)
      case 'DELETE':
        return await handleDocumentDeletion(req, supabase, corsHeaders)
      case 'GET':
        return await handleDocumentList(req, supabase, corsHeaders)
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error: any) {
    console.error('Document processor error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleDocumentUpload(
  req: Request,
  supabase: any,
  openaiApiKey: string,
  startTime: number,
  corsHeaders: any
): Promise<Response> {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const optionsStr = formData.get('options') as string
    const options: ProcessingOptions = optionsStr ? JSON.parse(optionsStr) : {}

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      return new Response(JSON.stringify({
        success: false,
        error: validationError
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Extract text content from file
    const textContent = await extractTextFromFile(file)

    if (!textContent) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to extract text from file'
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create document record
    const documentId = crypto.randomUUID()
    const document: Document = {
      id: documentId,
      title: extractDocumentTitle(file.name, textContent),
      content: textContent,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      upload_date: new Date().toISOString(),
      status: 'processing',
      chunks_count: 0,
      metadata: {
        language: options.language || detectLanguage(textContent),
        word_count: countWords(textContent),
        page_count: estimatePageCount(textContent)
      }
    }

    // Insert document into database
    const { error: insertError } = await supabase
      .from('documents')
      .insert(document)

    if (insertError) {
      throw new Error(`Failed to insert document: ${insertError.message}`)
    }

    // Process document into chunks
    const chunks = await chunkDocument(textContent, {
      chunk_size: options.chunk_size || 1000,
      overlap_size: options.overlap_size || 200
    })

    // Generate embeddings and store chunks
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk.content, openaiApiKey)

        return {
          id: crypto.randomUUID(),
          document_id: documentId,
          chunk_index: index,
          content: chunk.content,
          embedding: embedding || [],
          metadata: chunk.metadata
        }
      })
    )

    // Insert chunks into database
    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunksWithEmbeddings)

    if (chunksError) {
      console.error('Failed to insert chunks:', chunksError)
      // Update document status to error
      await supabase
        .from('documents')
        .update({ status: 'error' })
        .eq('id', documentId)

      throw new Error(`Failed to process document chunks: ${chunksError.message}`)
    }

    // Update document status to ready
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'ready',
        chunks_count: chunks.length
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Failed to update document status:', updateError)
    }

    // Track document processing event
    await trackDocumentEvent(supabase, documentId, 'process', true, Date.now() - startTime)

    const finalDocument = { ...document, status: 'ready', chunks_count: chunks.length }

    return new Response(JSON.stringify({
      success: true,
      document: finalDocument,
      processing_time_ms: Date.now() - startTime,
      message: `Successfully processed ${chunks.length} chunks`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Document upload error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process document'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleDocumentDeletion(
  req: Request,
  supabase: any,
  corsHeaders: any
): Promise<Response> {
  try {
    const { document_id } = await req.json()

    if (!document_id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Document ID is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Delete document chunks first (foreign key constraint)
    const { error: chunksError } = await supabase
      .from('document_chunks')
      .delete()
      .eq('document_id', document_id)

    if (chunksError) {
      throw new Error(`Failed to delete document chunks: ${chunksError.message}`)
    }

    // Delete document
    const { error: documentError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document_id)

    if (documentError) {
      throw new Error(`Failed to delete document: ${documentError.message}`)
    }

    // Track document deletion event
    await trackDocumentEvent(supabase, document_id, 'delete', true)

    return new Response(JSON.stringify({
      success: true,
      message: 'Document deleted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Document deletion error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to delete document'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleDocumentList(
  req: Request,
  supabase: any,
  corsHeaders: any
): Promise<Response> {
  try {
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('upload_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }

    return new Response(JSON.stringify({
      success: true,
      documents: documents || [],
      count: documents?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Document list error:', error)
    return new Response(JSON.stringify({
      success: false,
      documents: [],
      error: error.message || 'Failed to fetch documents'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

function validateFile(file: File): string | null {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (file.size > maxSize) {
    return `File size exceeds 50MB limit (current: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
  }

  if (!allowedTypes.includes(file.type)) {
    return `Unsupported file type: ${file.type}. Supported types: PDF, TXT, MD, DOC, DOCX`
  }

  return null
}

async function extractTextFromFile(file: File): Promise<string | null> {
  try {
    if (file.type === 'text/plain' || file.type === 'text/markdown') {
      return await file.text()
    }

    if (file.type === 'application/pdf') {
      // For demo purposes, return placeholder text
      // In production, you would use a PDF parsing library
      const fileName = file.name.replace('.pdf', '')
      return `This is extracted text from ${fileName}. In a production environment, this would contain the actual PDF content extracted using a proper PDF parsing library like pdf-parse or similar.`
    }

    if (file.type.includes('word') || file.type.includes('document')) {
      // For demo purposes, return placeholder text
      // In production, you would use a DOCX parsing library
      const fileName = file.name.replace(/\.(doc|docx)$/, '')
      return `This is extracted text from ${fileName}. In a production environment, this would contain the actual document content extracted using a proper DOCX parsing library like mammoth or similar.`
    }

    return null
  } catch (error) {
    console.error('Text extraction error:', error)
    return null
  }
}

function extractDocumentTitle(fileName: string, content: string): string {
  // Try to extract title from first line of content
  const firstLine = content.split('\n')[0]?.trim()

  if (firstLine && firstLine.length > 5 && firstLine.length < 100) {
    // Remove common markdown headers
    const title = firstLine.replace(/^#+\s*/, '').trim()
    if (title) return title
  }

  // Fallback to filename without extension
  return fileName.replace(/\.[^/.]+$/, '')
}

function detectLanguage(text: string): string {
  // Simple language detection (in production, use a proper language detection library)
  const commonEnglishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
  const words = text.toLowerCase().split(/\s+/).slice(0, 100)

  const englishWordCount = words.filter(word => commonEnglishWords.includes(word)).length
  const englishRatio = englishWordCount / Math.min(words.length, 100)

  return englishRatio > 0.1 ? 'en' : 'unknown'
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length
}

function estimatePageCount(text: string): number {
  const wordsPerPage = 300
  const wordCount = countWords(text)
  return Math.ceil(wordCount / wordsPerPage)
}

async function chunkDocument(
  content: string,
  options: { chunk_size: number; overlap_size: number }
): Promise<DocumentChunk[]> {
  const { chunk_size, overlap_size } = options
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const chunks: DocumentChunk[] = []

  let currentChunk = ''
  let chunkIndex = 0

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim()

    // Check if adding this paragraph would exceed chunk size
    if (currentChunk.length + paragraph.length > chunk_size && currentChunk.length > 0) {
      // Create chunk from current content
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          chunk_type: detectChunkType(currentChunk),
          chunk_index: chunkIndex++
        }
      })

      // Start new chunk with overlap
      const overlapText = getOverlapText(currentChunk, overlap_size)
      currentChunk = overlapText + paragraph
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    }
  }

  // Add final chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        chunk_type: detectChunkType(currentChunk),
        chunk_index: chunkIndex
      }
    })
  }

  return chunks
}

function detectChunkType(text: string): 'header' | 'paragraph' | 'list' | 'code' | 'table' {
  // Simple heuristics for chunk type detection
  if (text.includes('```') || text.includes('function') || text.includes('class ')) {
    return 'code'
  }

  if (text.includes('|') && text.split('|').length > 3) {
    return 'table'
  }

  if (text.includes('- ') || text.includes('* ') || /^\d+\./.test(text)) {
    return 'list'
  }

  if (text.length < 100 && !text.includes('.')) {
    return 'header'
  }

  return 'paragraph'
}

function getOverlapText(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) return text

  // Try to find a good breaking point (end of sentence)
  const lastPart = text.slice(-overlapSize)
  const sentenceEnd = lastPart.lastIndexOf('.')

  if (sentenceEnd > overlapSize / 2) {
    return text.slice(-(overlapSize - sentenceEnd)) + '\n\n'
  }

  return text.slice(-overlapSize) + '\n\n'
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
        input: text.substring(0, 8000), // Limit text length for embedding
        model: 'text-embedding-ada-002'
      })
    })

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Embedding generation error:', error)
    return null
  }
}

async function trackDocumentEvent(
  supabase: any,
  document_id: string,
  event_type: string,
  success: boolean,
  processing_time_ms?: number
): Promise<void> {
  try {
    await supabase
      .from('document_events')
      .insert({
        document_id,
        event_type,
        success,
        processing_time_ms,
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to track document event:', error)
  }
}
