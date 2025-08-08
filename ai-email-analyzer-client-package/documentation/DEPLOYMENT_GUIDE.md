# AI Email Analyzer - Deployment Guide

> Complete deployment guide for the AI Email Analyzer client package across multiple platforms and environments.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ and npm installed
- Supabase account (free tier available)
- OpenAI API key (GPT-4o-mini recommended)

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/ai-email-analyzer-client.git
cd ai-email-analyzer-client
npm install
```

### 2. Configure Environment
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

### 3. Deploy to Supabase
```bash
npm run deploy:supabase
```

### 4. Launch Application
```bash
npm run dev
```

Your AI Email Analyzer will be running at `http://localhost:3000`!

---

## 📋 Detailed Deployment Options

### Option 1: Supabase + Vercel (Recommended)

#### Step 1: Supabase Setup
1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Click "New Project"
   # Name: "ai-email-analyzer-production"
   # Region: Choose closest to your users
   # Database Password: Generate secure password
   ```

2. **Configure Database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Initialize project
   supabase init

   # Link to your project
   supabase link --project-ref your-project-ref

   # Deploy database schema
   supabase db push
   ```

3. **Deploy Edge Functions**
   ```bash
   # Deploy email analyzer function
   supabase functions deploy email-analyzer-demo

   # Set environment variables
   supabase secrets set OPENAI_API_KEY=sk-your-openai-key
   ```

#### Step 2: Vercel Deployment
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   # Build the application
   npm run build

   # Deploy to Vercel
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from your `.env.local` file

### Option 2: Supabase + Netlify

#### Step 1: Supabase Setup (Same as above)

#### Step 2: Netlify Deployment
1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required environment variables

### Option 3: Self-Hosted Deployment

#### Docker Deployment
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

2. **Build and Run**
   ```bash
   docker build -t ai-email-analyzer .
   docker run -p 3000:3000 ai-email-analyzer
   ```

#### Traditional Server Deployment
1. **Server Setup**
   ```bash
   # Install Node.js 18+ on your server
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Clone repository
   git clone https://github.com/your-org/ai-email-analyzer-client.git
   cd ai-email-analyzer-client

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start application
   npm run preview
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 4: Cloud Platform Deployments

#### AWS Deployment
1. **AWS Amplify**
   ```bash
   # Install AWS Amplify CLI
   npm install -g @aws-amplify/cli

   # Initialize Amplify
   amplify init

   # Add hosting
   amplify add hosting

   # Deploy
   amplify publish
   ```

2. **AWS S3 + CloudFront**
   ```bash
   # Build application
   npm run build

   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name

   # Configure CloudFront distribution
   # Point to your S3 bucket
   ```

#### Google Cloud Platform
1. **Google Cloud Run**
   ```bash
   # Build Docker image
   docker build -t gcr.io/your-project/ai-email-analyzer .

   # Push to Google Container Registry
   docker push gcr.io/your-project/ai-email-analyzer

   # Deploy to Cloud Run
   gcloud run deploy ai-email-analyzer \
     --image gcr.io/your-project/ai-email-analyzer \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Microsoft Azure
1. **Azure Static Web Apps**
   ```bash
   # Install Azure CLI
   npm install -g azure-cli

   # Login to Azure
   az login

   # Create Static Web App
   az staticwebapp create \
     --name ai-email-analyzer \
     --resource-group your-resource-group \
     --source . \
     --location "West US 2"
   ```

---

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key
```

### Optional Environment Variables
```bash
# Application Branding
VITE_APP_NAME="Your Company Email Intelligence"
VITE_BRAND_COLOR=#3B82F6

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WHITE_LABEL=false

# Performance Monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_USE_MOCK_DATA=true
```

#### Staging
```bash
NODE_ENV=staging
VITE_DEBUG_MODE=false
VITE_USE_MOCK_DATA=false
```

#### Production
```bash
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_USE_MOCK_DATA=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

---

## 🔒 Security Configuration

### CORS Settings
```javascript
// Configure allowed origins
VITE_ALLOWED_ORIGINS=https://your-domain.com,https://app.your-domain.com
```

### API Rate Limiting
```bash
# Configure rate limits
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=60000
```

### SSL/TLS Configuration
- Enable HTTPS for all production deployments
- Configure SSL certificates (Let's Encrypt recommended)
- Set up HSTS headers

### Environment Variable Security
- Never commit `.env` files to version control
- Use environment-specific `.env` files
- Rotate API keys regularly
- Use secrets management services

---

## 📊 Monitoring & Analytics

### Performance Monitoring
```bash
# Enable performance monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ANALYTICS_ID=your-analytics-id
```

### Error Tracking
```bash
# Configure error reporting
VITE_ERROR_REPORTING_URL=https://your-error-service.com
```

### Health Checks
```bash
# Health check endpoint
curl https://your-domain.com/api/health
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy AI Email Analyzer

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI Example
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK
  only:
    - main
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues
```bash
# Check Supabase project status
supabase status

# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test connection
curl -X POST https://your-project.supabase.co/functions/v1/email-analyzer-demo \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"subject":"test","body":"test","senderEmail":"test@test.com"}'
```

#### 2. OpenAI API Issues
```bash
# Verify OpenAI API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Check API quota
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/usage
```

#### 3. Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix
```

#### 4. Deployment Issues
```bash
# Check build output
npm run build

# Verify environment variables
npm run build:check

# Test locally
npm run preview
```

### Performance Optimization

#### 1. Bundle Size Optimization
```bash
# Analyze bundle size
npm run build:analyze

# Enable compression
npm run build:compressed
```

#### 2. Caching Strategy
```javascript
// Configure caching headers
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3. CDN Configuration
- Configure CDN for static assets
- Enable gzip compression
- Set up proper cache headers

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers for multiple instances
- Configure auto-scaling based on traffic
- Implement session management

### Database Scaling
- Monitor database performance
- Implement read replicas if needed
- Consider database sharding for large datasets

### API Scaling
- Implement API rate limiting
- Use caching for frequently accessed data
- Monitor API response times

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks
1. **Security Updates**
   ```bash
   npm audit
   npm update
   ```

2. **Database Maintenance**
   ```sql
   -- Clean up old data
   DELETE FROM email_analyses
   WHERE created_at < NOW() - INTERVAL '2 years';
   ```

3. **Performance Monitoring**
   - Monitor response times
   - Check error rates
   - Review analytics data

### Update Procedures
1. **Backup Data**
   ```bash
   # Backup database
   supabase db dump --data-only > backup.sql
   ```

2. **Deploy Updates**
   ```bash
   # Pull latest changes
   git pull origin main

   # Install dependencies
   npm install

   # Deploy
   npm run deploy:supabase
   npm run deploy:vercel
   ```

3. **Verify Deployment**
   - Test all features
   - Check performance metrics
   - Monitor error logs

---

## 📞 Support & Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Customization Guide](./CUSTOMIZATION_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

### Support Channels
- Email: support@ai-email-analyzer.com
- Documentation: https://docs.ai-email-analyzer.com
- GitHub Issues: https://github.com/your-org/ai-email-analyzer-client/issues

### Community Resources
- Discord: https://discord.gg/ai-email-analyzer
- Blog: https://blog.ai-email-analyzer.com
- YouTube: https://youtube.com/@ai-email-analyzer

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Supabase project created and configured
- [ ] OpenAI API key obtained and tested
- [ ] Database schema deployed
- [ ] Edge functions deployed
- [ ] SSL certificate configured (production)

### Deployment
- [ ] Application built successfully
- [ ] All tests passing
- [ ] Environment variables set in deployment platform
- [ ] Application deployed and accessible
- [ ] Health checks passing

### Post-Deployment
- [ ] All features tested
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Analytics working
- [ ] Backup procedures tested
- [ ] Documentation updated

### Production Readiness
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Load testing completed
- [ ] Disaster recovery plan in place
- [ ] Monitoring and alerting configured
- [ ] Support procedures documented

---

**Ready to deploy?** Follow this guide step-by-step and you'll have your AI Email Analyzer running in production in under 30 minutes!
