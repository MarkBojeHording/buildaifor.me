# 🚀 Chatbot Deployment Guide

## Overview
This guide explains how to deploy your chatbot backends to Railway so they work in production without manual server startup.

## Current Problem
- All chatbots connect to `localhost` ports
- These don't work in production because `localhost` refers to user's machine, not your server
- Users can't use chatbots without you manually starting servers

## Solution: Deploy Backend Servers to Railway

### Step 1: Create Separate Railway Projects

You need to create 3 new Railway projects for your backend servers:

#### 1. Tier 1 Chatbot Backend
```bash
# Create new Railway project for Tier 1
railway init tier1-chatbot-backend
cd tier1-chatbot-backend
# Copy files from templates/chatbot-template/customer_service_ai/tier1-chatbot/
```

#### 2. Tier 2 Chatbot Backend
```bash
# Create new Railway project for Tier 2
railway init tier2-chatbot-backend
cd tier2-chatbot-backend
# Copy files from templates/chatbot-template/customer_service_ai/tier2-chatbot/
```

#### 3. Tier 3 Chatbot Backend
```bash
# Create new Railway project for Tier 3
railway init tier3-chatbot-backend
cd tier3-chatbot-backend
# Copy files from templates/chatbot-template/customer_service_ai/tier3-chatbot/
```

### Step 2: Update Frontend Configuration

The frontend now uses `src/config/api.ts` to automatically switch between development and production URLs.

**Development (localhost):**
- Tier 1: http://localhost:8001
- Tier 2: http://localhost:3001
- Tier 3: http://localhost:8003

**Production (Railway URLs):**
- Tier 1: https://tier1-chatbot-production.up.railway.app
- Tier 2: https://tier2-chatbot-production.up.railway.app
- Tier 3: https://tier3-chatbot-production.up.railway.app

### Step 3: Update Frontend Components

All chatbot demo pages need to use the new API configuration:

```typescript
import { getApiUrl } from '@/config/api';

// Instead of hardcoded localhost URLs:
const response = await fetch(`${getApiUrl('tier2')}/chat`, {
  // ... rest of fetch config
});
```

### Step 4: Environment Variables

Each Railway project needs these environment variables:

**Tier 1 (Python/FastAPI):**
```env
OPENAI_API_KEY=your_openai_key_here
PORT=8001
```

**Tier 2 (Node.js/Express):**
```env
OPENAI_API_KEY=your_openai_key_here
PORT=3001
```

**Tier 3 (Node.js/Express):**
```env
OPENAI_API_KEY=your_openai_key_here
PORT=8003
```

### Step 5: Deploy to Railway

For each backend project:

1. **Initialize Railway project:**
   ```bash
   railway login
   railway init
   ```

2. **Add environment variables:**
   ```bash
   railway variables set OPENAI_API_KEY=your_key_here
   railway variables set PORT=3001
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

4. **Get the production URL:**
   ```bash
   railway domain
   ```

### Step 6: Update Production URLs

Once deployed, update `src/config/api.ts` with the actual Railway URLs:

```typescript
const PRODUCTION_URLS = {
  tier1: 'https://your-tier1-project.up.railway.app',
  tier2: 'https://your-tier2-project.up.railway.app',
  tier3: 'https://your-tier3-project.up.railway.app',
  rag: 'https://your-rag-project.up.railway.app'
};
```

### Step 7: Test and Deploy Frontend

1. **Test locally:**
   ```bash
   npm run dev
   # Test all chatbot demos
   ```

2. **Deploy frontend:**
   ```bash
   git add .
   git commit -m "Update chatbot APIs for production"
   git push origin master
   ```

## Benefits

✅ **Always Available:** Chatbots work 24/7 without manual server startup
✅ **Scalable:** Railway automatically scales based on traffic
✅ **Reliable:** Automatic restarts and health checks
✅ **Cost Effective:** Pay only for actual usage
✅ **Easy Maintenance:** Centralized deployment and monitoring

## Troubleshooting

### Common Issues:

1. **CORS Errors:** Ensure Railway domains are in CORS configuration
2. **Environment Variables:** Check Railway dashboard for correct variables
3. **Port Issues:** Railway automatically assigns ports, use `process.env.PORT`
4. **Build Failures:** Check Railway build logs for dependency issues

### Health Checks:

Test each deployed backend:
```bash
curl https://your-tier2-project.up.railway.app/test
curl https://your-tier3-project.up.railway.app/test
```

## Next Steps

1. Create the 3 Railway projects
2. Deploy each backend
3. Update production URLs in frontend config
4. Test all chatbots
5. Deploy updated frontend

This will make your chatbots fully production-ready!
