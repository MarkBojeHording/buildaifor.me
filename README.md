# BuildAIFor.Me Business Platform

A comprehensive AI-powered business solutions platform with multiple specialized chatbots and automation tools.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation
```bash
git clone <repository-url>
cd BuildAIFor.Me-Business
npm install
```

## 📋 Server Startup Instructions

### 1. Main Website (Frontend)
**Port:** 5173
**Purpose:** Main business website with portfolio, services, and demo pages

```bash
# From project root
npm run dev
```
**Access:** http://localhost:5173

### 2. Tier 2 Law Firm Chatbot (Backend)
**Port:** 3001
**Purpose:** Advanced AI-powered legal chatbot with lead scoring, intent detection, and case assessment

```bash
# From project root
cd templates/chatbot-template/customer_service_ai/tier2-chatbot
PORT=3001 node server.js
```
**Access:** http://localhost:3001
**Test Endpoint:** http://localhost:3001/test

### 3. Tier 1 Basic Chatbot (Backend)
**Port:** 8001
**Purpose:** Basic chatbot for simple business interactions

```bash
# From project root
cd templates/chatbot-template/customer_service_ai/tier1-chatbot
npm start
```
**Access:** http://localhost:8001

### 4. AI Email Workflow System
**Port:** 3000
**Purpose:** Automated email processing and response system

```bash
# From project root
cd workflow-automation/ai-email-workflow
npm start
```
**Access:** http://localhost:3000

## 🔧 Development Commands

### Kill All Node Processes
```bash
pkill -f "node"
```

### Start All Servers (Development)
```bash
# Terminal 1: Main website
npm run dev

# Terminal 2: Law Firm Chatbot
cd templates/chatbot-template/customer_service_ai/tier2-chatbot && PORT=3001 node server.js

# Terminal 3: Basic Chatbot
cd templates/chatbot-template/customer_service_ai/tier1-chatbot && npm start

# Terminal 4: Email Workflow
cd workflow-automation/ai-email-workflow && npm start
```

## 📁 Project Structure

```
BuildAIFor.Me-Business/
├── website/                          # Main React frontend
├── templates/                        # Chatbot templates
│   └── chatbot-template/
│       └── customer_service_ai/
│           ├── tier1-chatbot/       # Basic chatbot
│           └── tier2-chatbot/       # Advanced law firm chatbot
├── workflow-automation/              # Email automation system
├── packages/                         # Tier-based packages
└── docs/                            # Documentation
```

## 🎯 Key Features

### Tier 2 Law Firm Chatbot
- **AI Response Generation:** Conversational, natural responses
- **Lead Scoring:** Rule-based scoring with consistency logic
- **Intent Detection:** Specialized legal intent recognition
- **Case Assessment:** Automated case strength evaluation
- **Attorney Routing:** Smart attorney recommendation system
- **Criminal Defense:** Specialized handling for criminal cases

### Main Website
- **Portfolio Showcase:** Interactive project demonstrations
- **Service Pages:** Detailed service offerings
- **Demo Pages:** Live chatbot demonstrations
- **Responsive Design:** Mobile-optimized interface

## 🔍 Testing

### Test Law Firm Chatbot
```bash
# Test basic interaction
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "clientId": "law-firm-demo"}'

# Test personal injury case
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I was in a car accident with a drunk driver", "clientId": "law-firm-demo"}'

# Test criminal defense
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I was arrested for DUI", "clientId": "law-firm-demo"}'
```

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill processes using specific ports
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
lsof -ti:8001 | xargs kill -9
```

### Server Not Starting
1. Check if Node.js is installed: `node --version`
2. Verify dependencies: `npm install`
3. Check port availability
4. Review server logs for errors

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📞 Support

For technical issues or questions about the platform, please refer to the documentation in the `docs/` directory or contact the development team.

## 📄 License

This project is proprietary software. All rights reserved.
