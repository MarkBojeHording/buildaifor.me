# 🚀 Tier 1 Chatbots Supabase Edge Function Deployment Guide

## 📋 Overview

This guide covers the migration of all 4 Tier 1 chatbots from the Python FastAPI server to a single Supabase Edge Function. The migration consolidates all chatbot configurations into one serverless function while maintaining the same API behavior.

## 🏗️ Architecture

### **Before Migration:**
- Python FastAPI server running on port 8001
- Separate JSON config files for each client
- Local file system configuration loading

### **After Migration:**
- Single Supabase Edge Function (`tier1-chatbots`)
- Embedded client configurations in TypeScript
- Serverless deployment with automatic scaling

## 📁 File Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts                    # Shared CORS configuration
│   └── tier1-chatbots/
│       └── index.ts                   # Main Edge Function
└── config.toml                        # Supabase configuration
```

## 🔧 Implementation Details

### **1. Client Configurations**
All 4 chatbot configurations are embedded in the Edge Function:

- **demo-dental**: Dental office responses and services
- **demo-restaurant**: Restaurant menu, hours, and reservations
- **demo-salon**: Hair salon services and pricing
- **demo-fitness**: Fitness studio classes and memberships

### **2. API Endpoints**
The Edge Function provides the same endpoints as the original Python server:

- `POST /chat` - Main chat endpoint
- `GET /health` - Health check
- `GET /clients/{client_id}/config` - Client configuration info

### **3. Request/Response Format**
Maintains the same JSON structure:

**Request:**
```json
{
  "message": "What are your hours?",
  "config": { "client_id": "demo-dental" },
  "conversation_id": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "🕒 Our hours are Mon-Fri 8AM-5PM, Sat 9AM-2PM.",
  "confidence": 0.9,
  "booking_created": false
}
```

## 🚀 Deployment Steps

### **Step 1: Prerequisites**
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (replace with your project ref)
supabase link --project-ref your-project-ref
```

### **Step 2: Deploy the Edge Function**
```bash
# Deploy the tier1-chatbots function
supabase functions deploy tier1-chatbots

# Or deploy all functions
supabase functions deploy
```

### **Step 3: Update Frontend Configuration**
Update `src/config/api.ts` with your Supabase project URL:

```typescript
const PRODUCTION_URLS = {
  tier1: 'https://your-project-ref.supabase.co/functions/v1/tier1-chatbots',
  // ... other URLs
};
```

### **Step 4: Test the Deployment**
```bash
# Test the health endpoint
curl https://your-project-ref.supabase.co/functions/v1/tier1-chatbots/health

# Test a chat request
curl -X POST https://your-project-ref.supabase.co/functions/v1/tier1-chatbots/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your hours?",
    "config": { "client_id": "demo-dental" }
  }'
```

## 🔄 Frontend Updates

### **Updated Demo Pages:**
- `src/pages/DentalOfficeDemo.tsx`
- `src/pages/RestaurantDemo.tsx`
- `src/pages/HairSalonDemo.tsx`
- `src/pages/FitnessStudioDemo.tsx`

### **Key Changes:**
1. **API URL**: Now uses `getApiUrl('tier1')` instead of hardcoded localhost
2. **Error Messages**: Updated to reference Supabase Edge Function
3. **Import**: Added `getApiUrl` import from `@/config/api`

## 🧪 Testing

### **Local Testing:**
```bash
# Start Supabase locally
supabase start

# Test the function locally
supabase functions serve tier1-chatbots

# Test endpoints
curl http://localhost:54321/functions/v1/tier1-chatbots/health
curl -X POST http://localhost:54321/functions/v1/tier1-chatbots/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "config": {"client_id": "demo-dental"}}'
```

### **Production Testing:**
Test each chatbot demo page:
1. Dental Office: `/demo/dental-office`
2. Restaurant: `/demo/restaurant`
3. Hair Salon: `/demo/hair-salon`
4. Fitness Studio: `/demo/fitness-studio`

## 🔧 Configuration Management

### **Adding New Clients:**
To add a new client configuration:

1. **Add to CLIENT_CONFIGS** in `supabase/functions/tier1-chatbots/index.ts`:
```typescript
"demo-new-client": {
  business_name: "New Business",
  contact: { phone: "(555) 123-4567" },
  industry: "general",
  responses: {
    "hours|open|time": "🕒 Our hours are...",
    // ... more responses
  }
}
```

2. **Deploy the updated function**:
```bash
supabase functions deploy tier1-chatbots
```

### **Modifying Existing Clients:**
1. Update the configuration in the Edge Function
2. Deploy the changes
3. No frontend changes needed (uses same client_id)

## 📊 Monitoring & Logs

### **View Function Logs:**
```bash
# View recent logs
supabase functions logs tier1-chatbots

# Follow logs in real-time
supabase functions logs tier1-chatbots --follow
```

### **Supabase Dashboard:**
- Navigate to your Supabase project dashboard
- Go to Edge Functions section
- View logs, metrics, and deployment status

## 🔒 Security Considerations

### **CORS Configuration:**
The Edge Function includes proper CORS headers for cross-origin requests.

### **Rate Limiting:**
Supabase provides built-in rate limiting for Edge Functions.

### **Environment Variables:**
No sensitive data is stored in the function (all configs are public demo data).

## 🚨 Troubleshooting

### **Common Issues:**

1. **CORS Errors:**
   - Ensure the `corsHeaders` are properly applied
   - Check that the frontend URL is allowed

2. **Function Not Found:**
   - Verify the function is deployed: `supabase functions list`
   - Check the project ref in the URL

3. **Configuration Not Loading:**
   - Verify the client_id matches exactly
   - Check the CLIENT_CONFIGS object in the function

4. **Response Format Issues:**
   - Ensure the response matches the expected ChatResponse interface
   - Check that all required fields are present

### **Debug Commands:**
```bash
# Check function status
supabase functions list

# View function details
supabase functions show tier1-chatbots

# Redeploy if needed
supabase functions deploy tier1-chatbots --no-verify-jwt
```

## 📈 Performance Benefits

### **Advantages of Edge Function Migration:**
1. **Automatic Scaling**: No need to manage server capacity
2. **Global Distribution**: Faster response times worldwide
3. **Cost Efficiency**: Pay only for actual usage
4. **Simplified Deployment**: No server management required
5. **Built-in Monitoring**: Supabase provides logs and metrics

### **Expected Performance:**
- **Cold Start**: ~100-200ms
- **Warm Response**: ~10-50ms
- **Concurrent Requests**: Handled automatically by Supabase

## 🔄 Migration Checklist

- [ ] Deploy Supabase Edge Function
- [ ] Update frontend API configuration
- [ ] Test all 4 chatbot demos
- [ ] Verify health endpoint
- [ ] Check error handling
- [ ] Monitor function logs
- [ ] Update documentation
- [ ] Decommission old Python server (optional)

## 📞 Support

For issues with the Supabase Edge Function:
1. Check the Supabase documentation
2. Review function logs
3. Test locally first
4. Verify configuration syntax

The migration maintains 100% API compatibility while providing better scalability and reduced maintenance overhead.
