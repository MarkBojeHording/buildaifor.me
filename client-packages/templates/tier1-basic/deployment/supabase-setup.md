# Supabase Deployment Guide - Tier 1 Chatbot

This guide will help you deploy your Tier 1 chatbot to Supabase Edge Functions.

## Prerequisites

- Supabase account
- Supabase CLI installed
- Node.js 18+ installed
- Git repository

## Step 1: Set Up Supabase Project

1. **Create a new Supabase project:**
   ```bash
   # Go to https://supabase.com and create a new project
   # Note down your project URL and anon key
   ```

2. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

3. **Login to Supabase:**
   ```bash
   supabase login
   ```

## Step 2: Initialize Supabase in Your Project

1. **Navigate to your project directory:**
   ```bash
   cd your-chatbot-project
   ```

2. **Initialize Supabase:**
   ```bash
   supabase init
   ```

3. **Link to your Supabase project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

## Step 3: Configure Environment Variables

1. **Create a `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your environment variables:**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Set secrets in Supabase:**
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key
   ```

## Step 4: Deploy Edge Functions

1. **Deploy the chatbot function:**
   ```bash
   supabase functions deploy tier1-chatbots --no-verify-jwt
   ```

2. **Verify deployment:**
   ```bash
   supabase functions list
   ```

## Step 5: Test Your Deployment

1. **Test the health endpoint:**
   ```bash
   curl -X GET "https://your-project.supabase.co/functions/v1/tier1-chatbots/health"
   ```

2. **Test the chat endpoint:**
   ```bash
   curl -X POST "https://your-project.supabase.co/functions/v1/tier1-chatbots/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "What are your hours?",
       "config": {"client_id": "demo-dental"}
     }'
   ```

## Step 6: Configure Frontend

1. **Update your frontend API URL:**
   ```javascript
   const API_URL = 'https://your-project.supabase.co/functions/v1/tier1-chatbots';
   ```

2. **Test the integration:**
   - Open your frontend application
   - Send a test message
   - Verify the response

## Step 7: Customize for Your Business

1. **Update client configuration:**
   - Edit `backend/supabase-version/index.ts`
   - Replace demo configurations with your business information
   - Update responses, branding, and contact details

2. **Redeploy after changes:**
   ```bash
   supabase functions deploy tier1-chatbots --no-verify-jwt
   ```

## Troubleshooting

### Common Issues

1. **Function not found:**
   - Ensure the function is deployed: `supabase functions list`
   - Check the function name matches your deployment

2. **CORS errors:**
   - The function includes CORS headers by default
   - If issues persist, check your frontend domain

3. **Authentication errors:**
   - The function is deployed with `--no-verify-jwt` for public access
   - Remove this flag if you want authentication

4. **OpenAI API errors:**
   - Verify your API key is set correctly
   - Check your OpenAI account has sufficient credits

### Debugging

1. **View function logs:**
   ```bash
   supabase functions logs tier1-chatbots
   ```

2. **Test locally:**
   ```bash
   supabase functions serve tier1-chatbots
   ```

## Production Considerations

1. **Security:**
   - Consider adding authentication for production use
   - Implement rate limiting
   - Monitor API usage

2. **Performance:**
   - Monitor function execution times
   - Consider caching for common responses
   - Optimize response payloads

3. **Monitoring:**
   - Set up error tracking
   - Monitor usage metrics
   - Configure alerts for failures

## Support

If you encounter issues:

1. Check the Supabase documentation
2. Review function logs
3. Test with the provided examples
4. Contact support with specific error messages

## Next Steps

After successful deployment:

1. Customize the chatbot for your business
2. Integrate with your website
3. Set up analytics and monitoring
4. Train your team on managing responses
