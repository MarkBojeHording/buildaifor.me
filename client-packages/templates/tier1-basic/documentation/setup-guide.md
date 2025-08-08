# Tier 1 Basic Chatbot - Setup Guide

Welcome to the Tier 1 Basic Chatbot template! This professional FAQ chatbot is designed to handle common customer inquiries with customizable responses and branding.

## 🚀 Quick Start

### 1. Choose Your Deployment Option

This template supports multiple deployment options:

- **Supabase Edge Functions** (Recommended) - Serverless, easy setup
- **FastAPI** - Python-based, traditional server
- **Express.js** - Node.js-based, traditional server
- **Docker** - Containerized deployment
- **Railway** - Cloud platform deployment

### 2. Select Your Industry Template

Pre-configured industry templates are available:

- **Dental Office** - Patient inquiries, appointments, services
- **Restaurant** - Menu, reservations, hours
- **Hair Salon** - Services, booking, pricing
- **Fitness Studio** - Classes, membership, schedules
- **Real Estate** - Property inquiries, viewings
- **Custom** - Create your own configuration

### 3. Deploy Your Backend

Follow the deployment guide for your chosen option:

- [Supabase Deployment Guide](./deployment/supabase-setup.md)
- [FastAPI Deployment Guide](./deployment/fastapi-setup.md)
- [Express.js Deployment Guide](./deployment/express-setup.md)
- [Docker Deployment Guide](./deployment/docker-setup.md)
- [Railway Deployment Guide](./deployment/railway-setup.md)

### 4. Integrate Frontend

Choose your frontend integration:

- **React Components** - Ready-to-use React components
- **Vanilla JavaScript** - Framework-agnostic implementation
- **Custom Integration** - Use the API directly

## 📁 Package Structure

```
tier1-basic/
├── backend/
│   ├── supabase-version/     # Edge Functions
│   ├── fastapi-version/      # Python FastAPI
│   └── express-version/      # Node.js Express
├── frontend/
│   ├── react-components/     # Reusable chat components
│   ├── vanilla-js/           # Framework-agnostic
│   └── themes/               # Customizable UI themes
├── config/
│   ├── industries/           # Pre-built industry configs
│   ├── template.json         # Base configuration
│   └── branding.json         # Customization options
├── deployment/
│   ├── supabase-setup.md     # Supabase deployment
│   ├── docker/               # Container deployment
│   ├── railway/              # Railway deployment
│   └── self-hosted/          # Traditional server setup
└── documentation/
    ├── setup-guide.md
    ├── customization-guide.md
    └── api-documentation.md
```

## ⚙️ Configuration

### Basic Configuration

1. **Update branding.json:**
   ```json
   {
     "branding": {
       "company": {
         "name": "Your Company Name",
         "description": "Your company description"
       },
       "chatbot": {
         "name": "AI Assistant",
         "description": "How can I help you today?"
       }
     }
   }
   ```

2. **Customize theme colors:**
   ```json
   {
     "ui": {
       "theme": {
         "primaryColor": "#3b82f6",
         "secondaryColor": "#1e40af",
         "backgroundColor": "#ffffff",
         "textColor": "#1f2937"
       }
     }
   }
   ```

### Industry-Specific Configuration

1. **Choose an industry template:**
   ```bash
   cp config/industries/dental-office.json config/client-config.json
   ```

2. **Customize responses:**
   - Update business information
   - Modify response messages
   - Add custom keywords
   - Configure quick replies

## 🔧 Customization

### Adding Custom Responses

1. **Edit the backend configuration:**
   ```typescript
   const responses = {
     "custom_topic": {
       "keywords": ["keyword1", "keyword2"],
       "response": "Your custom response here"
     }
   };
   ```

2. **Update quick replies:**
   ```json
   {
     "quickReplies": [
       {
         "text": "Your custom question",
         "icon": "IconName",
         "category": "custom"
       }
     ]
   }
   ```

### Branding Customization

1. **Company logo:**
   - Add logo URL to branding configuration
   - Supported formats: PNG, JPG, SVG
   - Recommended size: 32x32px

2. **Color scheme:**
   - Primary color for buttons and highlights
   - Secondary color for accents
   - Background and text colors

3. **Welcome message:**
   - Customize the initial greeting
   - Include company name and description
   - Add emojis for personality

## 📊 Features

### Core Features

- **Keyword-based responses** - Intelligent message matching
- **Quick reply buttons** - Pre-defined common questions
- **Customizable branding** - Company colors and logos
- **Multiple deployment options** - Choose your preferred platform
- **Industry templates** - Pre-configured for common businesses

### Advanced Features

- **Fallback responses** - Handles unknown queries gracefully
- **Error handling** - Robust error management
- **CORS support** - Cross-origin request handling
- **Health checks** - Monitoring endpoint availability
- **Rate limiting** - Built-in request throttling

## 🔌 API Reference

### Endpoints

- `POST /chat` - Send a message and get response
- `GET /health` - Check service health
- `GET /clients/{client_id}/config` - Get client configuration

### Request Format

```json
{
  "message": "What are your hours?",
  "config": {
    "client_id": "your-client-id"
  }
}
```

### Response Format

```json
{
  "response": "Our hours are Monday-Friday 9AM-5PM",
  "session_id": "unique-session-id",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🚀 Deployment Options

### Supabase (Recommended)

- **Pros:** Serverless, easy setup, automatic scaling
- **Cons:** Vendor lock-in, limited customization
- **Best for:** Small to medium businesses, quick deployment

### FastAPI

- **Pros:** Full control, Python ecosystem, high performance
- **Cons:** Server management, scaling complexity
- **Best for:** Python shops, custom requirements

### Express.js

- **Pros:** Node.js ecosystem, familiar for web developers
- **Cons:** Server management, scaling complexity
- **Best for:** JavaScript/Node.js teams

### Docker

- **Pros:** Consistent environment, easy deployment
- **Cons:** Container management, infrastructure complexity
- **Best for:** DevOps teams, production environments

## 📈 Monitoring & Analytics

### Built-in Monitoring

- Function execution times
- Error rates and types
- Request volume
- Response quality

### Recommended Tools

- **Supabase Dashboard** - Built-in monitoring
- **Sentry** - Error tracking
- **Google Analytics** - User behavior
- **Custom Analytics** - Business metrics

## 🔒 Security Considerations

### Production Security

1. **Authentication:**
   - Implement JWT verification
   - Add API key authentication
   - Use HTTPS only

2. **Rate Limiting:**
   - Implement request throttling
   - Monitor for abuse
   - Set usage limits

3. **Data Protection:**
   - Encrypt sensitive data
   - Implement data retention policies
   - Comply with privacy regulations

## 🆘 Support & Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check domain configuration
   - Verify CORS headers
   - Test with different browsers

2. **Authentication Errors:**
   - Verify API keys
   - Check JWT configuration
   - Review authentication flow

3. **Response Issues:**
   - Check keyword matching
   - Verify response configuration
   - Test with sample messages

### Getting Help

1. **Documentation:** Review all guides thoroughly
2. **Examples:** Check provided sample configurations
3. **Logs:** Review function logs for errors
4. **Community:** Check Supabase/Stack Overflow
5. **Support:** Contact with specific error details

## 🎯 Next Steps

After successful setup:

1. **Customize for your business**
2. **Test with real users**
3. **Monitor performance**
4. **Iterate and improve**
5. **Scale as needed**

## 📚 Additional Resources

- [API Documentation](./api-documentation.md)
- [Customization Guide](./customization-guide.md)
- [Deployment Guides](./deployment/)
- [Industry Templates](./config/industries/)

---

**Need help?** Check the troubleshooting section or contact support with specific error details.
