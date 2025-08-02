# Technical Documentation RAG System Setup

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the `templates/rag-system-template/` folder:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration (optional)
PORT=3001
```

### 3. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 4. Start the Backend Server
```bash
node server.js
```

### 5. Start the Frontend (in a new terminal)
```bash
npm run dev
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 🔧 Features

### AI-Powered Search
- Real-time document analysis using GPT-3.5-turbo
- Intelligent code generation
- Semantic similarity matching
- Confidence scoring

### Vector Search Simulation
- Document relevance scoring
- Top-k document retrieval
- Query-document matching

### Fallback System
- Graceful degradation if AI fails
- Sample results as backup
- Error handling and logging

## 📁 Project Structure

```
templates/rag-system-template/
├── src/
│   ├── pages/
│   │   └── TechnicalDocumentationRAG.tsx  # Main component
│   ├── main.tsx                           # Entry point
│   └── index.css                          # Styles
├── server.js                              # Backend API
├── package.json                           # Dependencies
├── vite.config.ts                         # Build config
├── .env                                   # Environment variables
└── SETUP.md                               # This file
```

## 🔍 API Endpoints

### POST /api/analyze-documentation
Analyzes technical documentation queries using AI.

**Request Body:**
```json
{
  "query": "How do I authenticate API requests?",
  "documents": [
    {
      "title": "Authentication Guide",
      "content": "API Key Authentication: Initialize the API client..."
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "API Key Authentication",
      "description": "Learn how to authenticate...",
      "codeBlock": {
        "language": "JavaScript",
        "code": "const apiClient = new APIClient...",
        "emoji": "🟨"
      },
      "source": {
        "document": "Authentication Guide",
        "section": "API Key Authentication"
      },
      "confidence": 0.94
    }
  ]
}
```

### GET /api/health
Health check endpoint.

## 🛠️ Troubleshooting

### OpenAI API Key Issues
- Ensure your API key is valid and has credits
- Check the `.env` file is in the correct location
- Verify the key format: `sk-...`

### Server Connection Issues
- Make sure the backend server is running on port 3001
- Check that the proxy configuration in `vite.config.ts` is correct
- Verify CORS settings if accessing from different domains

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (recommended: 16+)
- Clear node_modules and reinstall if needed

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- Monitor API usage to avoid unexpected charges
- Consider rate limiting for production use

## 🚀 Production Deployment

For production deployment:
1. Set up proper environment variables
2. Configure HTTPS
3. Add rate limiting
4. Set up monitoring and logging
5. Consider using a proper vector database
6. Implement caching for better performance
