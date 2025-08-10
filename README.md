# BuildAIFor.Me Business Platform

> ⚠️ **PROPRIETARY SOFTWARE** - This repository contains confidential business information and proprietary code. **NOT for public use, copying, or distribution.** See [Important Notice](#-important-notice) below.

A comprehensive AI-powered business solutions platform with multiple specialized chatbots, automation tools, and enterprise-grade AI systems built with modern technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase account (for production deployment)

### Installation
```bash
git clone <repository-url>
cd BuildAIFor.Me-Business
npm install
```

### Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Add your API keys
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Development Server
```bash
npm run dev
```
**Access:** http://localhost:5173

## 🏗️ Project Overview

### What It Is
BuildAIFor.Me is a comprehensive AI automation platform that provides:

- **AI Chatbots** (Tier 1-3): From basic FAQ bots to enterprise AI assistants
- **Document Processing**: AI-powered document analysis and Q&A
- **Email Analysis**: Automated email processing and response generation
- **RAG Systems**: Retrieval Augmented Generation for knowledge bases
- **Business Intelligence**: Data automation and analytics dashboards
- **Workflow Automation**: AI-powered business process automation

### Key Features
- **Multi-tier AI Solutions**: Scalable from basic to enterprise needs
- **Supabase Integration**: Production-ready serverless architecture
- **Real-time Analytics**: Live performance monitoring and insights
- **Enterprise Security**: Row-level security, authentication, and compliance
- **Responsive Design**: Mobile-optimized interfaces
- **API-First Architecture**: Easy integration with existing systems

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions + PostgreSQL
- **AI**: OpenAI GPT-4, Claude, and custom models
- **Deployment**: Railway, Vercel, Supabase
- **Authentication**: Supabase Auth with JWT
- **Real-time**: Supabase Realtime subscriptions

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Supabase (if using local development)
npm run supabase:start  # Start local Supabase
npm run supabase:stop   # Stop local Supabase
npm run supabase:reset  # Reset local database

# Functions
npm run supabase:functions    # Serve Edge Functions locally
npm run supabase:deploy      # Deploy Edge Functions
```

### Project Structure
```
BuildAIFor.Me-Business/
├── src/                    # Main React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components and demos
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── config/            # Configuration files
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge Functions
│   ├── migrations/        # Database migrations
│   └── config.toml        # Supabase config
├── templates/             # Client-ready templates
├── demos/                 # Interactive demonstrations
├── client-packages/       # Sellable client packages
└── docs/                  # Documentation
```

### AI Tools Overview

#### Tier 1 Chatbots (Basic)
- **Purpose**: Simple FAQ and information retrieval
- **Technology**: Supabase Edge Functions
- **Examples**: Dental office, restaurant, hair salon, fitness studio
- **Features**: Basic conversation flow, service information

#### Tier 2 Chatbots (Advanced)
- **Purpose**: Lead qualification and business logic
- **Technology**: Supabase Edge Functions + AI
- **Examples**: Law firm, real estate, ecommerce
- **Features**: Lead scoring, intent detection, case assessment

#### Tier 3 Chatbots (Enterprise)
- **Purpose**: Complex AI assistants with workflow automation
- **Technology**: Supabase + OpenAI + Real-time features
- **Features**: Multi-modal AI, analytics, workflow automation

#### Document Processing
- **Purpose**: AI-powered document analysis and Q&A
- **Technology**: Supabase + OpenAI + Vector search
- **Features**: Document upload, analysis, intelligent Q&A

#### Email Analysis
- **Purpose**: Automated email processing and response generation
- **Technology**: Supabase + OpenAI + Analytics
- **Features**: Priority classification, sentiment analysis, auto-response

#### RAG Systems
- **Purpose**: Knowledge base search and retrieval
- **Technology**: Supabase + Vector embeddings + AI
- **Features**: Semantic search, document indexing, intelligent answers

## 🚀 Deployment

### Production Deployment
- **Frontend**: Vercel (automatic deployments, global CDN)
- **Backend**: Supabase Edge Functions (serverless, scalable)
- **Database**: Supabase PostgreSQL (built-in auth, real-time)
- **Benefits**: Zero server management, automatic scaling, enterprise-grade performance

### Environment Variables
```env
# Required for AI features
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Edge Functions (auto-configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Deployment Steps
1. **Set up Supabase project** and Edge Functions
2. **Deploy frontend** to Vercel
3. **Configure environment variables** in Vercel
4. **Set up custom domain** (optional)
5. **Configure monitoring** and analytics

## 🧪 Testing

### Local Testing
```bash
# Test main website
npm run dev
# Visit: http://localhost:5173

# Test Supabase functions locally
npm run supabase:start
npm run supabase:functions
```

### API Testing
```bash
# Test Tier 1 chatbot
curl -X POST http://localhost:54321/functions/v1/tier1-chatbots/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your hours?", "config": {"client_id": "demo-dental"}}'

# Test email analyzer
curl -X POST http://localhost:54321/functions/v1/analyze-email \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test", "body": "Test email", "senderEmail": "test@example.com"}'
```

### Demo Pages
- **Dental Office**: `/demo/dental-office`
- **Restaurant**: `/demo/restaurant`
- **Hair Salon**: `/demo/hair-salon`
- **Fitness Studio**: `/demo/fitness-studio`
- **Law Firm**: `/demo/law-firm`
- **Real Estate**: `/demo/real-estate`
- **Email Analyzer**: `/portfolio/email-analyzer-supabase`
- **Document Processing**: `/portfolio/document-analyzer`
- **RAG System**: `/portfolio/technical-documentation-rag`

## 🛠️ Troubleshooting

### Common Issues

#### Development Server Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Supabase Issues
```bash
# Reset local Supabase
npm run supabase:stop
npm run supabase:start

# Check function logs
supabase functions logs
```

#### API Key Issues
- Ensure `.env.local` file exists in root directory
- Verify API keys are correct and have sufficient credits
- Check browser console for CORS errors

#### Port Conflicts
```bash
# Kill processes using specific ports
lsof -ti:5173 | xargs kill -9
lsof -ti:54321 | xargs kill -9
```

## 📚 Documentation

### Detailed Guides
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Complete Vercel + Supabase deployment instructions
- **[Project Structure](./STRUCTURE.md)**: Detailed project organization
- **[Business Strategy](./README-STRATEGY.md)**: Business strategy and roadmap

### API Documentation
- **Tier 1 Chatbots**: Basic conversation endpoints
- **Tier 2 Chatbots**: Advanced chat with lead scoring
- **Tier 3 Chatbots**: Enterprise AI assistant
- **Email Analyzer**: Email processing and analysis
- **Document Processor**: Document analysis and Q&A
- **RAG System**: Knowledge base search

### Support Resources
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI API Documentation**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **React Documentation**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🎯 Business Value

### For Clients
- **Cost Reduction**: 60% lower operational costs
- **Performance**: 40% faster response times
- **Scalability**: Handle enterprise-level traffic
- **Reliability**: 99.9% uptime guarantee
- **Security**: Enterprise-grade security and compliance

### For Developers
- **Rapid Development**: Pre-built templates and components
- **Easy Deployment**: One-command deployment process
- **Scalable Architecture**: Serverless and auto-scaling
- **Modern Stack**: Latest technologies and best practices
- **Comprehensive Documentation**: Complete guides and examples

## 📞 Support

For technical support or questions:
- **Email**: contact@buildaifor.me
- **Documentation**: Check the guides in the `docs/` directory
- **Issues**: Create an issue in the repository

## ⚠️ Important Notice

### **Proprietary Software - Not for Public Use**

**This repository contains proprietary software and intellectual property owned by BuildAIFor.Me. This software is NOT open source and is NOT available for public use, copying, or distribution.**

### **Usage Restrictions**
- ❌ **No copying, forking, or cloning** of this repository
- ❌ **No commercial use** without explicit written permission
- ❌ **No redistribution** of code, assets, or documentation
- ❌ **No derivative works** based on this codebase
- ❌ **No reverse engineering** or decompilation

### **What This Repository Is For**
- ✅ **Portfolio showcase** of AI development capabilities
- ✅ **Demonstration** of technical expertise and solutions
- ✅ **Reference** for potential clients and partners
- ✅ **Documentation** of completed projects and services

### **Contact for Licensing**
If you're interested in:
- **Custom AI development services**
- **Licensing this technology**
- **Partnership opportunities**
- **Commercial use of similar solutions**

**Contact**: contact@buildaifor.me

## 📄 License

**Copyright © 2024 BuildAIFor.Me. All rights reserved.**

This project is proprietary software and confidential business information. Unauthorized copying, distribution, or use of this software is strictly prohibited and may result in legal action.

---

**BuildAIFor.Me** - Transforming businesses through intelligent AI automation.
