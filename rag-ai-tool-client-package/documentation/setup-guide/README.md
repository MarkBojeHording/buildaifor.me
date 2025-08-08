# RAG AI Tool - Quick Start Guide

> Get your intelligent document search system running in 30 minutes or less

## 🚀 **30-Second Overview**

The RAG AI Tool transforms your documents into an intelligent, searchable knowledge base. Upload PDFs, docs, and text files, then ask questions in natural language to get instant, accurate answers backed by your content.

### **What You'll Achieve**
- **90% faster** document search compared to traditional methods
- **95% accuracy** with AI-powered semantic understanding
- **Real-time insights** from your document collection
- **Enterprise-grade** security and scalability

---

## 📋 **Prerequisites**

### **Required Accounts & Services**
- ✅ **Supabase Account**: [Sign up free](https://supabase.com)
- ✅ **OpenAI API Key**: [Get your key](https://platform.openai.com/api-keys)
- ✅ **Node.js 18+**: [Download here](https://nodejs.org)
- ✅ **Git**: [Install Git](https://git-scm.com)

### **Recommended Tools**
- **VS Code** with Supabase extension
- **Postman** for API testing
- **pgAdmin** for database management

---

## ⚡ **Quick Setup (30 Minutes)**

### **Step 1: Project Setup (5 minutes)**

```bash
# Clone the repository
git clone https://github.com/your-org/rag-ai-tool-client.git
cd rag-ai-tool-client

# Install dependencies
npm install

# Install Supabase CLI
npm install -g @supabase/cli
```

### **Step 2: Supabase Configuration (10 minutes)**

#### **2.1 Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: `rag-ai-tool-production`
   - **Database Password**: Generate secure password
   - **Region**: Choose closest to your users
4. Wait for project initialization (2-3 minutes)

#### **2.2 Get Project Credentials**
```bash
# Navigate to Settings > API in Supabase Dashboard
# Copy these values:
PROJECT_URL=https://your-project-ref.supabase.co
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **2.3 Initialize Supabase Locally**
```bash
# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to your cloud project
supabase link --project-ref your-project-ref-here
```

### **Step 3: Database Setup (5 minutes)**

```bash
# Deploy database schema
supabase db push

# Verify tables were created
supabase db status
```

**Expected Output:**
```
✅ Connected to project: rag-ai-tool-production
✅ Database migrations applied successfully
✅ Tables created: 9
✅ Functions created: 3
✅ Indexes created: 15
```

### **Step 4: Environment Configuration (5 minutes)**

#### **4.1 Create Environment File**
```bash
# Copy example environment file
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

#### **4.2 Configure Environment Variables**
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# Optional: Customize app settings
VITE_APP_NAME="Your Company RAG Tool"
VITE_BRAND_COLOR="#3B82F6"
VITE_ENABLE_ANALYTICS=true
```

#### **4.3 Configure Supabase Secrets**
```bash
# Set OpenAI API key in Supabase
supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here

# Set other required secrets
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 5: Deploy Edge Functions (5 minutes)**

```bash
# Deploy all Edge Functions
supabase functions deploy

# Or deploy individually
supabase functions deploy semantic-search
supabase functions deploy document-processor
supabase functions deploy analytics-tracker
```

**Verify Deployment:**
```bash
# Test health check
curl -X POST https://your-project-ref.supabase.co/functions/v1/semantic-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{"action": "health_check"}'
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "semantic-search",
  "version": "1.0.0"
}
```

### **Step 6: Launch Application (2 minutes)**

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### **Step 7: First Document Upload (3 minutes)**

1. **Access the Application**: Navigate to http://localhost:3000
2. **Upload Your First Document**:
   - Click the "Documents" tab
   - Drag and drop a PDF file (or click to select)
   - Wait for processing (usually 30-60 seconds)
   - Status will change from "Processing" to "Ready"

3. **Test Search**:
   - Go to "Search" tab
   - Type a question about your document
   - Get instant AI-powered answers!

---

## 🎯 **Instant Value Demo**

Once setup is complete, try these demo scenarios:

### **Demo 1: Technical Documentation**
1. Upload an API documentation PDF
2. Ask: "How do I authenticate API requests?"
3. Get instant, contextual answers with source citations

### **Demo 2: Company Policies**
1. Upload your employee handbook
2. Ask: "What is the vacation policy?"
3. See how AI extracts exact policy details

### **Demo 3: Research Papers**
1. Upload academic papers or reports
2. Ask: "What are the main findings?"
3. Get comprehensive summaries with confidence scores

---

## 🔧 **Configuration Options**

### **Search Settings**
```bash
# In your .env.local file
VITE_DEFAULT_SEARCH_MODE=semantic  # semantic, keyword, hybrid
VITE_RESULTS_PER_PAGE=10
VITE_SIMILARITY_THRESHOLD=0.7
VITE_MAX_CHUNK_SIZE=1000
```

### **File Upload Settings**
```bash
VITE_MAX_FILE_SIZE_MB=50
VITE_ALLOWED_FILE_TYPES=pdf,txt,md,doc,docx
VITE_MAX_FILES_PER_UPLOAD=10
```

### **AI Model Settings**
```bash
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=500
```

---

## 📊 **Verify Everything is Working**

### **1. Health Checks**
```bash
# Check all services
curl -X POST https://your-project-ref.supabase.co/functions/v1/semantic-search \
  -H "Authorization: Bearer your-anon-key" \
  -d '{"action": "health_check"}'

curl -X GET https://your-project-ref.supabase.co/functions/v1/document-processor \
  -H "Authorization: Bearer your-anon-key"
```

### **2. Database Verification**
```bash
# Check tables exist
supabase db status

# View sample data
psql postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres \
  -c "SELECT COUNT(*) FROM documents;"
```

### **3. Frontend Verification**
- ✅ App loads at http://localhost:3000
- ✅ No console errors in browser
- ✅ All tabs (Search, Documents, Analytics) accessible
- ✅ File upload works without errors

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

#### **Issue: "OpenAI API key not configured"**
```bash
# Solution: Set the API key in Supabase secrets
supabase secrets set OPENAI_API_KEY=sk-your-actual-key-here

# Verify it was set
supabase secrets list
```

#### **Issue: "Database connection failed"**
```bash
# Solution: Check your project URL and keys
# Verify in .env.local:
VITE_SUPABASE_URL=https://correct-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=correct-anon-key

# Test connection
supabase db status
```

#### **Issue: "File upload fails"**
```bash
# Solution: Check file size and type
# Ensure file is < 50MB and type is supported
# Check console for detailed error messages
```

#### **Issue: "Search returns no results"**
```bash
# Solution: Verify documents are processed
# Check document status in database:
psql your-connection-string -c "SELECT title, status FROM documents;"

# Ensure status is 'ready', not 'processing' or 'error'
```

#### **Issue: "Edge Functions not responding"**
```bash
# Solution: Redeploy functions
supabase functions deploy --no-verify-jwt

# Check function logs
supabase functions logs semantic-search
```

### **Debug Mode**
Enable detailed logging by adding to `.env.local`:
```bash
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

---

## 📈 **Performance Optimization**

### **Recommended Settings for Production**

#### **Database Optimization**
```sql
-- Increase work_mem for better query performance
ALTER SYSTEM SET work_mem = '256MB';

-- Optimize for vector operations
ALTER SYSTEM SET shared_preload_libraries = 'vector';
```

#### **Edge Function Optimization**
```typescript
// In your edge functions, enable caching
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

#### **Frontend Optimization**
```bash
# Build for production
npm run build

# Serve with optimizations
npm run preview
```

---

## 🔒 **Security Checklist**

Before going to production, ensure:

- ✅ **Environment Variables**: All secrets in `.env.local`, not committed to git
- ✅ **Database Security**: Row Level Security (RLS) enabled on all tables
- ✅ **API Keys**: OpenAI API key set in Supabase secrets, not frontend
- ✅ **CORS**: Properly configured for your domain
- ✅ **File Validation**: Size and type restrictions enforced
- ✅ **Rate Limiting**: Search rate limits configured
- ✅ **User Authentication**: Supabase auth properly configured

---

## 🎓 **Next Steps**

### **Immediate Actions**
1. **Upload Sample Documents**: Add 5-10 documents to test search quality
2. **Customize Branding**: Update colors, logo, and company name
3. **Configure Integrations**: Set up Slack/Teams notifications
4. **Test Performance**: Upload larger documents and test response times

### **Advanced Configuration**
- **Custom Prompts**: Modify AI prompts for your domain
- **Advanced Analytics**: Set up custom dashboards
- **Multi-language Support**: Configure language detection
- **Custom Embeddings**: Fine-tune embeddings for your content

### **Production Deployment**
- **Domain Setup**: Configure custom domain
- **SSL Certificate**: Ensure HTTPS everywhere
- **Monitoring**: Set up uptime and performance monitoring
- **Backup Strategy**: Configure database backups

---

## 💬 **Support & Resources**

### **Need Help?**
- 📧 **Email Support**: support@your-domain.com
- 📱 **Community**: Join our Slack/Discord
- 📚 **Documentation**: Full docs at docs.your-domain.com
- 🎥 **Video Tutorials**: Watch setup videos

### **Useful Links**
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🎉 **Congratulations!**

You've successfully deployed your RAG AI Tool! Your intelligent document search system is now ready to:

- **Transform** how your team finds information
- **Accelerate** decision-making with instant answers
- **Scale** your knowledge management effortlessly
- **Impress** users with AI-powered search capabilities

**Ready to see the magic?** Upload your first document and ask it a question! 🚀

---

**© 2024 RAG AI Tool - Professional Client Package. Transform your documents into intelligent answers.**
