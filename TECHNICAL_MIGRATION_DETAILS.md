# 🔧 Technical Migration Details

## Overview
This document provides detailed technical specifications for migrating each AI tool to Supabase, including code examples, API mappings, and specific implementation details.

---

## 🐍 Python FastAPI to Supabase Edge Functions

### Tier 1 Chatbots Migration

#### Current FastAPI Structure
```python
# Current: templates/chatbot-template/customer_service_ai/tier1-chatbot/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    config: Dict[str, Any]
    conversation_id: str = None

@app.post("/chat")
async def chat(request: ChatRequest):
    # Business logic here
    return ChatResponse(...)
```

#### Supabase Edge Function Migration
```typescript
// New: supabase/functions/tier1-chatbot/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ChatRequest {
  message: string
  config: Record<string, any>
  conversation_id?: string
}

interface ChatResponse {
  response: string
  confidence: number
  booking_created: boolean
}

serve(async (req) => {
  try {
    const { message, config, conversation_id }: ChatRequest = await req.json()

    // Migrate business logic here
    const response = await processChatMessage(message, config)

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})

async function processChatMessage(message: string, config: Record<string, any>): Promise<ChatResponse> {
  // Migrate existing Python logic to TypeScript
  // ... implementation
}
```

---

## 🟨 Node.js Express to Supabase Edge Functions

### Tier 2 Chatbots Migration

#### Current Express Structure
```javascript
// Current: templates/chatbot-template/customer_service_ai/tier2-chatbot/server.js
const express = require('express');
const app = express();

app.post('/chat', async (req, res) => {
  const { client_id, message, session_id } = req.body;
  // Enhanced message processing
  const response = await enhancedProcessor.process(message);
  res.json(response);
});
```

#### Supabase Edge Function Migration
```typescript
// New: supabase/functions/tier2-chatbot/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ChatRequest {
  client_id: string
  message: string
  session_id?: string
}

serve(async (req) => {
  try {
    const { client_id, message, session_id }: ChatRequest = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Migrate enhanced message processing
    const response = await processEnhancedMessage(message, client_id, session_id, supabase)

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})

async function processEnhancedMessage(
  message: string,
  clientId: string,
  sessionId: string,
  supabase: any
) {
  // Migrate EnhancedMessageProcessor logic
  // ... implementation
}
```

---

## 🔌 WebSocket to Supabase Realtime

### Tier 3 Chatbots Migration

#### Current Socket.io Structure
```javascript
// Current: templates/chatbot-template/customer_service_ai/tier3-chatbot/backend/server.js
const socketIo = require('socket.io');

io.on('connection', (socket) => {
  socket.on('chat_message', async (data) => {
    const aiResponse = await generateAIResponse(data.message);
    const actions = await generateAutomationActions(data.message, aiResponse);

    socket.emit('bot_response', {
      message: aiResponse,
      actions: actions,
      timestamp: new Date()
    });
  });
});
```

#### Supabase Realtime Migration
```typescript
// New: supabase/functions/tier3-chatbot/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { message, session_id, user_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process message and generate response
    const aiResponse = await generateAIResponse(message)
    const actions = await generateAutomationActions(message, aiResponse)

    // Store in database for real-time updates
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id,
        user_id,
        message,
        response: aiResponse,
        actions: JSON.stringify(actions),
        timestamp: new Date().toISOString()
      })
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message_id: data[0].id }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

#### Frontend Realtime Subscription
```typescript
// Frontend: Real-time message listening
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Subscribe to real-time updates
const subscription = supabase
  .channel('chat_messages')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chat_messages' },
    (payload) => {
      // Handle new message
      const { message, response, actions } = payload.new
      // Update UI with response
    }
  )
  .subscribe()
```

---

## 📁 File Storage Migration

### Document Processing System

#### Current File Handling
```javascript
// Current: templates/document-processing-template/backend/server.js
const sampleDocuments = {
  'lease-agreement': {
    title: 'Commercial Lease Agreement',
    sections: [
      // Document sections stored in memory
    ]
  }
};
```

#### Supabase Storage Migration
```typescript
// New: supabase/functions/document-processor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { document_id, query } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch document from Supabase Storage
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single()

    if (error) throw error

    // Process document with AI
    const analysis = await analyzeDocument(document.content, query)

    return new Response(
      JSON.stringify(analysis),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

---

## 🗄️ Database Schema Migration

### Supabase PostgreSQL Tables

#### Chat Sessions Table
```sql
-- Create chat sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_stage TEXT DEFAULT 'initial',
  lead_score INTEGER DEFAULT 0,
  lead_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  confidence FLOAT DEFAULT 0.0,
  intent TEXT,
  lead_score_change INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL,
  sections JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_analyses table
CREATE TABLE email_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_content TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  priority_level TEXT NOT NULL,
  sentiment_score FLOAT,
  customer_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 Authentication Migration

### Supabase Auth Integration

#### Current Authentication (if any)
```javascript
// Current: Basic session management
const sessions = {};
```

#### Supabase Auth Migration
```typescript
// New: Authentication with Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// User authentication
const { data: { user }, error } = await supabase.auth.getUser()

// Row Level Security (RLS) policies
-- Enable RLS on chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🔄 API Endpoint Mapping

### Complete Endpoint Migration Table

| Current Endpoint | Supabase Edge Function | Method | Description |
|------------------|------------------------|--------|-------------|
| `POST /chat` (Tier 1) | `/functions/v1/tier1-chatbot` | POST | Basic chatbot responses |
| `POST /chat` (Tier 2) | `/functions/v1/tier2-chatbot` | POST | Enhanced chat with lead scoring |
| `POST /api/chat` (Tier 3) | `/functions/v1/tier3-chatbot` | POST | Enterprise AI assistant |
| `POST /api/analyze-documentation` | `/functions/v1/rag-system` | POST | Document analysis |
| `POST /analyze` | `/functions/v1/email-analyzer` | POST | Email analysis |
| `POST /analyze-document` | `/functions/v1/document-processor` | POST | Document processing |
| `GET /health` | `/functions/v1/health-check` | GET | Health monitoring |

---

## 📊 Data Migration Scripts

### Migration Utilities

#### Python to TypeScript Converter
```typescript
// Utility: Convert Python business logic to TypeScript
export function convertPythonLogic(pythonCode: string): string {
  // Basic conversion patterns
  const conversions = {
    'def ': 'function ',
    'async def ': 'async function ',
    'self.': 'this.',
    'None': 'null',
    'True': 'true',
    'False': 'false',
    'print(': 'console.log(',
    'f"': '`',
    '":': '`:',
  }

  let converted = pythonCode
  Object.entries(conversions).forEach(([python, typescript]) => {
    converted = converted.replace(new RegExp(python, 'g'), typescript)
  })

  return converted
}
```

#### Configuration Migration
```typescript
// Migrate JSON configs to Supabase
export async function migrateConfigs(supabase: any) {
  const configs = [
    'dental-office',
    'restaurant',
    'fitness-studio',
    'hair-salon',
    'law-firm',
    'ecommerce'
  ]

  for (const configId of configs) {
    const configPath = `./configs/${configId}.json`
    const config = JSON.parse(await Deno.readTextFile(configPath))

    await supabase
      .from('client_configs')
      .upsert({
        client_id: configId,
        config: config,
        updated_at: new Date().toISOString()
      })
  }
}
```

---

## 🧪 Testing Strategy

### Migration Testing Framework

#### Edge Function Testing
```typescript
// Test: supabase/functions/tier1-chatbot/test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts"

Deno.test("Tier 1 Chatbot - Basic Response", async () => {
  const request = new Request("http://localhost:54321/functions/v1/tier1-chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Hello",
      config: { business_name: "Test Business" }
    })
  })

  const response = await fetch(request)
  const result = await response.json()

  assertEquals(response.status, 200)
  assertEquals(typeof result.response, "string")
  assertEquals(typeof result.confidence, "number")
})
```

#### Integration Testing
```typescript
// Test: Integration tests for complete workflow
Deno.test("Complete Chat Workflow", async () => {
  const supabase = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY)

  // 1. Create session
  const { data: session } = await supabase
    .from('chat_sessions')
    .insert({
      client_id: 'test-client',
      session_id: 'test-session'
    })
    .select()
    .single()

  // 2. Send message
  const response = await fetch("/functions/v1/tier2-chatbot", {
    method: "POST",
    body: JSON.stringify({
      client_id: 'test-client',
      session_id: session.id,
      message: "I need help with my order"
    })
  })

  // 3. Verify response
  const result = await response.json()
  assertEquals(result.lead_score > 0, true)
})
```

---

## 🚀 Deployment Strategy

### Supabase Edge Function Deployment

#### Deployment Script
```bash
#!/bin/bash
# deploy-functions.sh

echo "🚀 Deploying AI Tools to Supabase..."

# Deploy all edge functions
supabase functions deploy tier1-chatbot
supabase functions deploy tier2-chatbot
supabase functions deploy tier3-chatbot
supabase functions deploy rag-system
supabase functions deploy email-analyzer
supabase functions deploy document-processor

# Set environment variables
supabase secrets set OPENAI_API_KEY=$OPENAI_API_KEY

# Run database migrations
supabase db push

echo "✅ Deployment complete!"
```

#### Environment Configuration
```bash
# .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
```

---

## 📈 Performance Optimization

### Supabase-Specific Optimizations

#### Database Indexing
```sql
-- Optimize chat queries
CREATE INDEX idx_chat_sessions_client_id ON chat_sessions(client_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Optimize document queries
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_created_at ON documents(created_at);
```

#### Edge Function Optimization
```typescript
// Optimize: Cache frequently used data
const cache = new Map()

export async function getCachedConfig(clientId: string) {
  if (cache.has(clientId)) {
    return cache.get(clientId)
  }

  const { data } = await supabase
    .from('client_configs')
    .select('config')
    .eq('client_id', clientId)
    .single()

  cache.set(clientId, data.config)
  return data.config
}
```

---

## 🔒 Security Considerations

### Supabase Security Best Practices

#### Row Level Security (RLS)
```sql
-- Secure chat sessions
CREATE POLICY "Secure chat sessions" ON chat_sessions
  FOR ALL USING (
    auth.uid() = user_id OR
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );

-- Secure documents
CREATE POLICY "Secure documents" ON documents
  FOR SELECT USING (
    document_type = 'public' OR
    auth.uid() IN (
      SELECT user_id FROM document_permissions
      WHERE document_id = documents.id
    )
  );
```

#### API Security
```typescript
// Security: Validate requests
export function validateRequest(req: any): boolean {
  const requiredFields = ['message', 'client_id']
  return requiredFields.every(field => req[field] !== undefined)
}

// Security: Rate limiting
const rateLimit = new Map()

export function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userRequests = rateLimit.get(userId) || []
  const recentRequests = userRequests.filter(time => now - time < 60000)

  if (recentRequests.length >= 10) {
    return false // Rate limit exceeded
  }

  recentRequests.push(now)
  rateLimit.set(userId, recentRequests)
  return true
}
```

This technical migration guide provides the foundation for successfully migrating all AI tools to Supabase while maintaining functionality and improving performance.
