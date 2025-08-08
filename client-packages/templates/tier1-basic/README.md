# Tier 1 Basic Chatbot - Client Package

A professional, customizable FAQ chatbot template designed for businesses to handle common customer inquiries with intelligent responses and branded interfaces.

## 🎯 Overview

This package provides everything you need to deploy a professional chatbot for your business:

- **Multiple deployment options** (Supabase, FastAPI, Express.js, Docker)
- **Industry-specific templates** (Dental, Restaurant, Salon, Fitness, Real Estate)
- **Customizable branding** and themes
- **Ready-to-use frontend components**
- **Comprehensive documentation**

## 🚀 Quick Start

### 1. Choose Your Deployment

```bash
# Supabase (Recommended - Serverless)
cd backend/supabase-version
supabase functions deploy tier1-chatbots

# FastAPI (Python)
cd backend/fastapi-version
pip install -r requirements.txt
uvicorn main:app --reload

# Express.js (Node.js)
cd backend/express-version
npm install
npm start
```

### 2. Select Industry Template

```bash
# Copy your preferred industry configuration
cp config/industries/dental-office.json config/client-config.json

# Customize for your business
# Edit config/client-config.json with your information
```

### 3. Integrate Frontend

```jsx
// React Component
import ChatInterface from './frontend/react-components/ChatInterface';

<ChatInterface
  apiUrl="https://your-api.com"
  clientId="your-client-id"
  branding={{
    name: "Your Business Name",
    description: "How can I help you today?"
  }}
  theme={{
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af"
  }}
/>
```

## 📦 What's Included

### Backend Options
- **Supabase Edge Functions** - Serverless deployment
- **FastAPI** - Python-based API
- **Express.js** - Node.js API server

### Frontend Components
- **React Components** - Ready-to-use chat interface
- **Vanilla JavaScript** - Framework-agnostic implementation
- **Customizable Themes** - Multiple UI themes

### Configuration
- **Industry Templates** - Pre-built for common businesses
- **Branding Options** - Customizable colors, logos, messages
- **Response Management** - Easy keyword and response editing

### Documentation
- **Setup Guides** - Step-by-step deployment instructions
- **API Documentation** - Complete endpoint reference
- **Customization Guide** - How to tailor for your business

## 🏢 Industry Templates

### Available Templates

| Industry | Description | Features |
|----------|-------------|----------|
| **Dental Office** | Patient inquiries & appointments | Hours, services, insurance, emergency care |
| **Restaurant** | Menu & reservations | Hours, menu, booking, specials |
| **Hair Salon** | Services & booking | Services, pricing, appointments, styling |
| **Fitness Studio** | Classes & membership | Classes, schedules, membership, trainers |
| **Real Estate** | Property inquiries | Listings, viewings, pricing, agents |

### Custom Template

Create your own industry template by copying an existing one and customizing:

```bash
cp config/industries/dental-office.json config/industries/your-industry.json
# Edit the file with your specific responses and branding
```

## ⚙️ Configuration

### Basic Setup

1. **Update branding:**
   ```json
   {
     "branding": {
       "company": {
         "name": "Your Company Name",
         "description": "Your company description"
       }
     }
   }
   ```

2. **Customize theme:**
   ```json
   {
     "theme": {
       "primaryColor": "#3b82f6",
       "secondaryColor": "#1e40af"
     }
   }
   ```

3. **Add responses:**
   ```json
   {
     "responses": {
       "custom_topic": {
         "keywords": ["keyword1", "keyword2"],
         "response": "Your custom response"
       }
     }
   }
   ```

### Advanced Customization

- **Quick Reply Buttons** - Pre-defined common questions
- **Fallback Responses** - Handle unknown queries
- **Error Messages** - Custom error handling
- **Welcome Messages** - Personalized greetings

## 🔧 Features

### Core Features
- ✅ **Keyword-based responses** - Intelligent message matching
- ✅ **Quick reply buttons** - Pre-defined common questions
- ✅ **Customizable branding** - Company colors and logos
- ✅ **Multiple deployment options** - Choose your platform
- ✅ **Industry templates** - Pre-configured for common businesses

### Advanced Features
- ✅ **Fallback responses** - Graceful handling of unknown queries
- ✅ **Error handling** - Robust error management
- ✅ **CORS support** - Cross-origin request handling
- ✅ **Health checks** - Monitoring endpoint availability
- ✅ **Session management** - Conversation context tracking

## 🚀 Deployment Options

### Supabase (Recommended)
```bash
# Easy serverless deployment
supabase functions deploy tier1-chatbots --no-verify-jwt
```

**Pros:** Serverless, automatic scaling, easy setup
**Cons:** Vendor lock-in, limited customization

### FastAPI
```bash
# Traditional Python server
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Pros:** Full control, Python ecosystem, high performance
**Cons:** Server management, scaling complexity

### Express.js
```bash
# Node.js server
npm install
npm start
```

**Pros:** Node.js ecosystem, familiar for web developers
**Cons:** Server management, scaling complexity

### Docker
```bash
# Containerized deployment
docker build -t tier1-chatbot .
docker run -p 8000:8000 tier1-chatbot
```

**Pros:** Consistent environment, easy deployment
**Cons:** Container management, infrastructure complexity

## 📊 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send message and get response |
| `GET` | `/health` | Check service health |
| `GET` | `/clients/{id}/config` | Get client configuration |

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

## 🎨 Frontend Integration

### React Component
```jsx
import ChatInterface from './frontend/react-components/ChatInterface';

function App() {
  return (
    <div className="h-screen p-4">
      <ChatInterface
        apiUrl="https://your-api.com"
        clientId="your-client-id"
        branding={{
          name: "Your Business",
          description: "How can I help you?"
        }}
        quickReplies={[
          { text: "What are your hours?", icon: Clock },
          { text: "Book appointment", icon: Calendar }
        ]}
      />
    </div>
  );
}
```

### Vanilla JavaScript
```html
<div id="chat-container"></div>
<script src="./frontend/vanilla-js/chat-interface.js"></script>
<script>
  const chat = new ChatInterface({
    container: '#chat-container',
    apiUrl: 'https://your-api.com',
    clientId: 'your-client-id'
  });
</script>
```

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

## 🔒 Security

### Production Security
1. **Authentication** - Implement JWT verification
2. **Rate Limiting** - Request throttling
3. **HTTPS Only** - Secure communication
4. **Data Protection** - Encrypt sensitive data

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🆘 Support

### Documentation
- [Setup Guide](./documentation/setup-guide.md)
- [API Documentation](./documentation/api-documentation.md)
- [Customization Guide](./documentation/customization-guide.md)
- [Deployment Guides](./deployment/)

### Troubleshooting
1. **CORS Errors** - Check domain configuration
2. **Authentication Errors** - Verify API keys
3. **Response Issues** - Check keyword matching

### Getting Help
- Review documentation thoroughly
- Check function logs for errors
- Test with provided examples
- Contact support with specific error details

## 🎯 Use Cases

### Perfect For
- **Small businesses** - Handle common customer inquiries
- **Service providers** - Appointment booking and information
- **E-commerce** - Product support and order status
- **Healthcare** - Patient information and scheduling
- **Real estate** - Property inquiries and viewings

### Business Benefits
- **24/7 Availability** - Always-on customer support
- **Reduced Support Load** - Handle common questions automatically
- **Improved Customer Experience** - Instant responses
- **Scalable Solution** - Handle multiple conversations
- **Professional Appearance** - Branded, polished interface

## 📚 Additional Resources

- [API Documentation](./documentation/api-documentation.md)
- [Customization Guide](./documentation/customization-guide.md)
- [Deployment Guides](./deployment/)
- [Industry Templates](./config/industries/)

## 🤝 Contributing

This is a client package template. For customizations or improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This template is provided as-is for client use. Customize and deploy according to your business needs.

---

**Ready to deploy?** Start with the [Setup Guide](./documentation/setup-guide.md) or choose your preferred [Deployment Option](./deployment/).
