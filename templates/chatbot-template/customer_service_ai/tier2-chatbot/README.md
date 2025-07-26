# Tier 2 Chatbot System

Advanced AI-powered chatbot system with lead capture, analytics, and multi-industry support.

## 🚀 Features

- **Multi-Industry Support**: Pre-configured for Legal, Real Estate, and E-commerce
- **AI-Powered Responses**: OpenAI integration for intelligent conversations
- **Lead Capture System**: Automatic lead qualification and scoring
- **Analytics Dashboard**: Comprehensive reporting and insights
- **Customizable Themes**: Industry-specific styling and branding
- **RESTful API**: Full API for integration and management
- **Real-time Chat**: WebSocket support for live conversations
- **Mobile Responsive**: Works seamlessly on all devices

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- OpenAI API key (optional, for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/buildaiforme/tier2-chatbot.git
   cd tier2-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Create necessary directories**
   ```bash
   mkdir -p logs data uploads
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## 🎯 Quick Start

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
NODE_ENV=production npm start
```

### Run Demos
```bash
npm run demo
```

## 📁 Project Structure

```
tier2-chatbot/
├── api/                    # API server and routes
│   ├── middleware/        # Authentication and CORS
│   ├── routes/           # API endpoints
│   └── server.js         # Main server file
├── configs/              # Chatbot configurations
│   ├── law-firm-demo.json
│   ├── real-estate-demo.json
│   └── ecommerce-demo.json
├── core/                 # Core chatbot logic
│   ├── chatbot.js        # Main chatbot class
│   ├── message-processor.js
│   ├── response-generator.js
│   ├── lead-capture.js
│   └── ai-service.js
├── demos/                # Demo pages
│   ├── law-firm.html
│   ├── real-estate.html
│   └── ecommerce.html
├── public/               # Static assets
│   ├── css/             # Stylesheets and themes
│   └── js/              # Frontend JavaScript
├── templates/            # Response templates
├── utils/                # Utility functions
├── data/                 # Data storage
├── logs/                 # Application logs
└── server.js             # Entry point
```

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Server
NODE_ENV=development
PORT=3001

# OpenAI (for AI features)
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Authentication
API_KEYS=demo-key-123,your-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com
```

### Chatbot Configuration

Each chatbot is configured via JSON files in `configs/`:

```json
{
  "client_id": "law-firm-demo",
  "business_name": "Justice & Associates",
  "industry": "legal",
  "ai_enabled": true,
  "lead_capture": {
    "enabled": true,
    "required_fields": ["name", "email"]
  },
  "responses": {
    "greeting|hello": {
      "response": "Hello! How can I help you today?",
      "category": "greeting"
    }
  }
}
```

## 🌐 API Endpoints

### Chat Endpoints
- `POST /api/chat` - Process chat message
- `GET /api/chat/conversation/:id` - Get conversation history
- `DELETE /api/chat/conversation/:id` - Clear conversation
- `POST /api/chat/lead` - Submit lead capture form

### Configuration Endpoints
- `GET /api/config/:clientId` - Get chatbot configuration
- `PUT /api/config/:clientId` - Update configuration
- `GET /api/config/templates` - Get available templates

### Lead Management
- `GET /api/leads` - List leads with filtering
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `GET /api/leads/analytics/summary` - Get lead analytics

### Demo Pages
- `GET /demo/law-firm` - Legal chatbot demo
- `GET /demo/real-estate` - Real estate chatbot demo
- `GET /demo/ecommerce` - E-commerce chatbot demo

## 🎨 Customization

### Adding New Industries

1. **Create configuration file**
   ```bash
   cp configs/law-firm-demo.json configs/your-industry.json
   ```

2. **Update configuration**
   - Set `industry` field
   - Customize `responses`
   - Configure `lead_capture` fields
   - Set `theme` colors

3. **Create response templates**
   ```javascript
   // templates/your-industry-responses.js
   module.exports = {
     responses: [
       {
         pattern: "your|keywords",
         response: "Your custom response here"
       }
     ]
   };
   ```

4. **Add theme CSS**
   ```css
   /* public/css/themes/your-industry-theme.css */
   :root {
     --chat-primary-color: #your-color;
   }
   ```

### Custom Themes

Themes are defined in CSS files under `public/css/themes/`:

```css
:root {
  --chat-primary-color: #007bff;
  --chat-secondary-color: #6c757d;
  --chat-accent-color: #28a745;
  --chat-font-family: 'Arial', sans-serif;
  --chat-border-radius: 8px;
}
```

## 🤖 AI Integration

### OpenAI Setup

1. **Get API key** from [OpenAI](https://platform.openai.com/)
2. **Add to environment**:
   ```env
   OPENAI_API_KEY=your-api-key
   ```
3. **Enable in config**:
   ```json
   {
     "ai_enabled": true,
     "openai_config": {
       "model": "gpt-3.5-turbo",
       "max_tokens": 150,
       "temperature": 0.7
     }
   }
   ```

### Custom AI Prompts

Modify system prompts in `core/ai-service.js`:

```javascript
buildSystemPrompt() {
  return `You are a helpful ${this.config.industry} assistant.
  Provide accurate, helpful responses about ${this.config.business_name}.`;
}
```

## 📊 Analytics

### Lead Analytics

Access lead analytics via API:

```bash
curl "http://localhost:3001/api/leads/analytics/summary?client_id=law-firm-demo"
```

### Log Analytics

View application logs:

```bash
# Error logs
tail -f logs/error.log

# Combined logs
tail -f logs/combined.log

# Access logs
tail -f logs/access.log
```

## 🔒 Security

### API Authentication

Protected endpoints require API key:

```bash
curl -H "X-API-Key: your-api-key" \
  http://localhost:3001/api/leads
```

### Rate Limiting

Built-in rate limiting (100 requests per 15 minutes by default).

### CORS Configuration

Configure allowed origins in `.env`:

```env
ALLOWED_ORIGINS=https://yoursite.com,https://app.yoursite.com
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### API Testing
```bash
# Test chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "law-firm-demo",
    "message": "Hello"
  }'
```

## 🚀 Deployment

### Production Setup

1. **Environment**
   ```bash
   NODE_ENV=production
   LOG_LEVEL=WARN
   ```

2. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "tier2-chatbot"
   pm2 startup
   pm2 save
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Log Rotation
Logs are automatically rotated when they exceed 10MB.

### Performance Monitoring
Monitor key metrics:
- Response times
- Error rates
- Lead conversion rates
- API usage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://buildaiforme.com/docs](https://buildaiforme.com/docs)
- **Issues**: [GitHub Issues](https://github.com/buildaiforme/tier2-chatbot/issues)
- **Email**: support@buildaiforme.com

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Multi-industry support
- AI integration
- Lead capture system
- Analytics dashboard
- RESTful API
- Demo pages

---

**Built with ❤️ by [BuildAIFor.Me](https://buildaiforme.com)**
