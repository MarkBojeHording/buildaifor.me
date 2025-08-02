# Interactive Legal Document Analyzer

A sophisticated AI-powered document analysis system that allows users to interact with legal documents through natural language queries with precise citations.

## Features

- **Split-Screen Interface**: Document viewer on the left, AI chat on the right
- **5 Sample Legal Documents**: Commercial Lease, Employment Contract, Purchase Agreement, Service Agreement, Partnership Agreement
- **AI-Powered Analysis**: Natural language queries with precise citations
- **Interactive Citations**: Clickable citations that highlight referenced text
- **Real-time Chat**: Conversational interface with message history
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **OpenAI API** for AI-powered analysis
- **CORS** for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key

### 1. Clone and Setup

```bash
# Navigate to the template directory
cd templates/document-processing-template

# Setup Frontend
cd frontend
npm install
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd ../backend
npm install

# Create .env file
echo "PORT=3002
FRONTEND_URL=http://localhost:5174
OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Start the Application

```bash
# Terminal 1: Start Backend (from backend directory)
npm start

# Terminal 2: Start Frontend (from frontend directory)
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5174
- Backend API: http://localhost:3002
- Health Check: http://localhost:3002/api/health

## Usage

### Document Navigation
- Use the document tabs at the top to switch between different legal documents
- Each document has multiple sections that can be viewed in the document viewer

### AI Chat Interface
- Ask questions about the current document in natural language
- Receive AI-powered responses with precise citations
- Click on citations to highlight the referenced text in the document
- Use sample questions for quick testing

### Sample Questions by Document

#### Commercial Lease Agreement
- "What's the monthly rent?"
- "What happens if I break the lease early?"
- "Who's responsible for maintenance?"

#### Employment Contract
- "What's the salary and benefits?"
- "What are the non-compete restrictions?"
- "How much vacation time do I get?"

#### Purchase Agreement
- "What's the total purchase price?"
- "What assets are included in the sale?"
- "When is the closing date?"

#### Service Agreement
- "What services are provided?"
- "What's the monthly fee?"
- "What's the uptime guarantee?"

#### Partnership Agreement
- "How are profits shared?"
- "What are the capital contributions?"
- "How are decisions made?"

## API Endpoints

### POST /api/chat
Send a message to the AI document analyzer.

**Request Body:**
```json
{
  "message": "What's the monthly rent?",
  "documentId": "lease-agreement",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hello! I'm here to help you analyze legal documents."
    }
  ]
}
```

**Response:**
```json
{
  "response": "According to Section 2.1 on page 2, the monthly rent is Eight Thousand Five Hundred Dollars ($8,500.00) per month...",
  "citations": [
    {
      "documentId": "lease-agreement",
      "section": "2.1",
      "page": 2,
      "paragraph": 1,
      "text": "Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month"
    }
  ],
  "confidence": 0.95
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Project Structure

```
document-processing-template/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentViewer.tsx
│   │   │   ├── DocumentTabs.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── data/
│   │   │   └── sampleDocuments.ts
│   │   ├── services/
│   │   │   └── aiChatService.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Customization

### Adding New Documents
1. Add document data to `frontend/src/data/sampleDocuments.ts`
2. Add corresponding sections to the backend `server.js`
3. Update the document tabs component if needed

### Modifying AI Responses
1. Update the prompt in `backend/server.js`
2. Adjust the OpenAI model parameters
3. Add more document context as needed

### Styling Changes
1. Modify Tailwind classes in components
2. Update CSS variables in `frontend/src/index.css`
3. Customize component themes

## Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
# Set environment variables on your hosting platform
npm start
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is correctly set in the backend `.env` file
2. **OpenAI API Errors**: Verify your API key is valid and has sufficient credits
3. **Port Conflicts**: Change ports in `vite.config.ts` and `server.js` if needed

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the backend console for detailed error logs
- Test the health endpoint to verify backend connectivity

## License

This project is part of the BuildAIFor.Me Business portfolio and is intended for demonstration purposes.
