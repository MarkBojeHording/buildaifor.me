# EcommerceSalesIntelligence Dashboard - Deployment Guide

## 🚀 Quick Start Deployment

This guide provides step-by-step instructions for deploying the EcommerceSalesIntelligence Dashboard across multiple platforms.

## 📋 Prerequisites

### Required Accounts & Services
- **Supabase Account** - [Sign up here](https://supabase.com)
- **OpenAI API Key** - [Get your key here](https://platform.openai.com/api-keys)
- **GitHub Account** (for version control)
- **Domain Name** (optional, for custom branding)

### Technical Requirements
- **Node.js 18+** and npm
- **Git** for version control
- **Supabase CLI** (for local development)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🎯 Deployment Options

### Option 1: Supabase (Recommended) ⭐

**Best for:** Production deployments, scalability, serverless architecture

#### Step 1: Set Up Supabase Project

1. **Create Supabase Project:**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Create new project
   supabase projects create ecommerce-dashboard
   ```

2. **Get Project Credentials:**
   - Go to your Supabase dashboard
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

#### Step 2: Deploy Edge Function

```bash
# Navigate to supabase-version directory
cd ecommerce-sales-intelligence-package/supabase-version

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Deploy the Edge Function
supabase functions deploy ecommerce-dashboard

# Set environment variables
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

#### Step 3: Deploy Frontend

```bash
# Install dependencies
npm install

# Set environment variables
cp env.example .env
# Edit .env with your Supabase credentials

# Build for production
npm run build

# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod
```

### Option 2: React Application

**Best for:** Custom frontend, full control, existing React projects

#### Step 1: Set Up React Project

```bash
# Navigate to react-version directory
cd ecommerce-sales-intelligence-package/react-version

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### Step 2: Configure Backend

Choose one of these backend options:

**A. Use Supabase Edge Function (Recommended)**
```bash
# Follow Supabase deployment steps above
# Then update your .env file with Supabase credentials
```

**B. Deploy Custom Backend**
```bash
# Navigate to nodejs-version/backend
cd ../nodejs-version/backend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

# Start development server
npm run dev

# For production
npm run build
npm start
```

#### Step 3: Deploy Frontend

```bash
# Build for production
npm run build

# Deploy to your preferred platform
# Vercel (recommended)
vercel --prod

# Netlify
npm install -g netlify-cli
netlify deploy --prod

# AWS S3 + CloudFront
aws s3 sync dist/ s3://your-bucket-name
```

### Option 3: Docker Container

**Best for:** Enterprise deployments, on-premises, containerized environments

#### Step 1: Build Docker Image

```bash
# Navigate to docker-version directory
cd ecommerce-sales-intelligence-package/docker-version

# Build the image
docker build -t ecommerce-dashboard .

# Run locally
docker run -p 3000:3000 -e OPENAI_API_KEY=your-key ecommerce-dashboard
```

#### Step 2: Deploy to Production

```bash
# Deploy to Docker Hub
docker tag ecommerce-dashboard your-username/ecommerce-dashboard
docker push your-username/ecommerce-dashboard

# Deploy to Kubernetes
kubectl apply -f k8s-deployment.yaml

# Deploy to AWS ECS
aws ecs create-service --cluster your-cluster --service-name ecommerce-dashboard
```

### Option 4: Python/FastAPI

**Best for:** ML-focused applications, Python environments

#### Step 1: Set Up Python Environment

```bash
# Navigate to python-version directory
cd ecommerce-sales-intelligence-package/python-version

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 2: Deploy Backend

```bash
# Development
uvicorn app.main:app --reload

# Production with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Deploy to Railway
railway login
railway init
railway up
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```bash
# Required
OPENAI_API_KEY=your-openai-api-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional
VITE_APP_NAME=Ecommerce Sales Intelligence
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production
```

### Custom Branding

1. **Update Company Information:**
   ```bash
   # Edit src/config/branding.json
   {
     "companyName": "Your Company Name",
     "logo": "/path/to/your/logo.png",
     "primaryColor": "#3B82F6",
     "secondaryColor": "#1E40AF"
   }
   ```

2. **Custom Domain Setup:**
   ```bash
   # For Vercel
   vercel domains add your-domain.com

   # For Netlify
   netlify domains:add your-domain.com
   ```

## 📊 Database Setup

### Supabase Database (Recommended)

```sql
-- Run the migration file
-- supabase-version/supabase/migrations/001_ecommerce_tables.sql

-- Or use Supabase CLI
supabase db push
```

### Custom Database

If using a custom database, create the required tables:

```sql
-- Ecommerce analyses table
CREATE TABLE ecommerce_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  data JSONB NOT NULL,
  metrics JSONB NOT NULL,
  analysis_type TEXT DEFAULT 'comprehensive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_ecommerce_analyses_user_id ON ecommerce_analyses(user_id);
CREATE INDEX idx_ecommerce_analyses_created_at ON ecommerce_analyses(created_at DESC);
```

## 🔒 Security Configuration

### Authentication Setup

1. **Supabase Auth (Recommended):**
   ```bash
   # Enable authentication in Supabase dashboard
   # Go to Authentication > Settings
   # Configure your preferred auth providers
   ```

2. **Custom Auth:**
   ```bash
   # Implement JWT authentication
   # Set up user management system
   # Configure role-based access control
   ```

### API Security

```bash
# Set up CORS properly
# Configure rate limiting
# Implement API key validation
# Set up request logging
```

## 📈 Performance Optimization

### Frontend Optimization

```bash
# Enable code splitting
# Implement lazy loading
# Optimize bundle size
# Enable caching strategies
```

### Backend Optimization

```bash
# Set up database indexes
# Implement caching (Redis)
# Configure CDN
# Monitor performance metrics
```

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] User acceptance testing done
- [ ] Documentation updated
- [ ] Team training completed

## 🔍 Monitoring & Analytics

### Set Up Monitoring

```bash
# Application monitoring
npm install @sentry/react @sentry/tracing

# Performance monitoring
npm install web-vitals

# Error tracking
npm install bugsnag-js
```

### Analytics Configuration

```bash
# Google Analytics
npm install gtag

# Custom analytics
# Implement your preferred analytics solution
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors:**
   ```bash
   # Check CORS configuration in your backend
   # Ensure proper headers are set
   ```

2. **API Key Issues:**
   ```bash
   # Verify OpenAI API key is valid
   # Check environment variable names
   # Ensure proper permissions
   ```

3. **Database Connection:**
   ```bash
   # Verify database credentials
   # Check network connectivity
   # Validate connection strings
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Check logs
tail -f logs/app.log
```

## 📞 Support

### Getting Help

1. **Documentation:** Check the API documentation
2. **Issues:** Create an issue in the repository
3. **Community:** Join our Discord server
4. **Email:** support@yourcompany.com

### Maintenance

- **Regular Updates:** Keep dependencies updated
- **Security Patches:** Monitor for security vulnerabilities
- **Performance Monitoring:** Track key metrics
- **Backup Verification:** Test backup and restore procedures

---

**Ready to deploy?** Choose your preferred option above and follow the step-by-step instructions! 🚀
