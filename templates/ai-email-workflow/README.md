# AI Customer Support Email Analysis Tool

A comprehensive AI-powered email analysis system that provides detailed insights, classifications, and actionable recommendations for customer service teams.

## 🚀 Features

### Core AI Analysis Components

#### 1. **Relevance Assessment (0-100 score)**
- Customer support relevance vs spam/sales/other communications
- Business impact assessment based on content analysis
- Account status consideration (new vs existing customer indicators)
- Context relevance to company's products/services

#### 2. **Urgency Detection (Critical/High/Medium/Low)**
- **Critical Triggers**: Time-sensitive keywords, service disruptions, business impact, escalation threats
- **Urgency Scoring Logic**: Service outages, legal threats, major revenue impact
- **Intelligent Classification**: Automatic detection of urgent vs non-urgent issues

#### 3. **Importance Classification (High/Medium/Low)**
- **High Importance**: Financial impact, technical severity, customer tier, compliance issues
- **Business Context**: Revenue impact assessment, customer value analysis
- **Risk Assessment**: Churn risk, contract value, customer lifetime value

#### 4. **Detailed Categorization System**
- **Technical Support**: Bug reports, integration issues, performance problems
- **Billing & Payments**: Invoice questions, payment failures, refund requests
- **Account Management**: Access issues, account suspension, user management
- **Feature Requests**: New features, enhancements, integrations
- **Complaints & Feedback**: Service dissatisfaction, competitor comparisons
- **General Inquiries**: Information requests, how-to questions, documentation

#### 5. **Advanced Sentiment Analysis**
- **Emotional State Detection**: Angry, frustrated, confused, happy, neutral
- **Customer Satisfaction Indicators**: Positive/negative signals, mixed feedback
- **Churn Risk Assessment**: High/medium/low risk based on sentiment patterns

#### 6. **Customer Context Extraction**
- **Contact Information**: Names, emails, phone numbers, companies
- **Account Details**: Account numbers, order numbers, subscription tiers
- **Product/Service References**: Features mentioned, versions, integrations
- **Timeline Information**: Issue duration, previous interactions

#### 7. **Actionable Insights & Recommendations**
- **Response Time Matrix**: Immediate to 3-day response recommendations
- **Team Routing Logic**: L1/L2/Billing/Account/Engineering/Leadership
- **Required Expertise Assessment**: Basic to specialist level requirements

#### 8. **Business Intelligence Metrics**
- **Revenue Impact Assessment**: High/medium/low with dollar estimates
- **Customer Lifecycle Stage**: Trial, new, established, at-risk, VIP
- **Issue Complexity Scoring**: 1-10 scale for resolution difficulty

## 🛠️ Technical Stack

### Backend
- **Node.js & Express**: RESTful API server
- **OpenAI GPT-4**: Advanced AI analysis engine
- **CORS & Helmet**: Security middleware
- **Morgan**: Request logging

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool

### AI Integration
- **OpenAI API**: GPT-4 for natural language processing
- **Structured Prompts**: Consistent JSON output format
- **Fallback Analysis**: Demo mode when API unavailable

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- OpenAI API key

### Backend Setup
```bash
# Navigate to the project directory
cd templates/ai-email-workflow

# Install dependencies
npm install

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd public

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build frontend
cd public && npm run build

# Start production server
npm start
```

## 🎯 Usage

### 1. **Email Input**
- Paste customer support email content into the text area
- Use sample emails for testing different scenarios
- Support for full email content analysis

### 2. **AI Analysis**
- Click "Analyze Email" to process the content
- Processing time: 2-3 seconds
- Real-time analysis with OpenAI GPT-4

### 3. **Results Dashboard**
- **Priority Analysis**: Urgency and importance levels
- **Customer Profile**: Extracted customer information
- **Action Recommendations**: Response times and team routing
- **Confidence Metrics**: AI confidence scores
- **Complete Analysis**: Detailed breakdown of all metrics

### 4. **Sample Emails**
The tool includes pre-configured sample emails:
- **Critical Issue**: System down, enterprise customer
- **High Priority**: Payment processing failure
- **Medium Priority**: Feature request with context
- **Low Priority**: General inquiry

## 📊 Sample Output

```
🚨 PRIORITY ANALYSIS
Relevance: 98/100 (High-priority customer support issue)
Urgency: CRITICAL (Service completely down for 3 hours)
Importance: HIGH (Enterprise customer, $50K annual contract)

📊 CLASSIFICATION
Primary Category: Technical Support → Complete Service Outage
Secondary Category: Infrastructure → Database Connectivity
Sentiment: Frustrated + Angry (Churn Risk: HIGH)
Customer Tier: Enterprise (VIP Support Required)

👤 CUSTOMER PROFILE
Name: Sarah Johnson, CTO at TechCorp
Account: ENT-4471 (Enterprise Plan - $4,200/month)
Tenure: 18 months (Established Customer)
Previous Issues: 2 resolved, 1 escalated

⚡ RECOMMENDED ACTIONS
Response Time: IMMEDIATE (<15 minutes)
Route To: Senior Technical Lead + Account Manager
CC: Engineering Manager, Customer Success Director
Escalation Level: Executive (notify VP of Engineering)
Follow-up Frequency: Every 30 minutes until resolved

📈 BUSINESS METRICS
Revenue Impact: HIGH ($50K+ at risk)
Complexity Score: 9/10 (Infrastructure issue)
SLA Target: 99.9% uptime (currently breached)
Customer Satisfaction Risk: CRITICAL

🤖 AI CONFIDENCE SCORES
Overall Analysis: 96%
Urgency Detection: 99%
Sentiment Analysis: 94%
Category Classification: 97%
Revenue Impact: 93%
```

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3003
NODE_ENV=production
```

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/sample-emails` - Get sample emails
- `POST /api/analyze-email` - Analyze email content

### Customization
- Modify sample emails in `server.js`
- Adjust AI prompts for different analysis focus
- Customize UI components in `src/components/`
- Update styling with Tailwind CSS classes

## 🎨 UI Components

### Core Components
- **EmailAnalysisForm**: Input form with sample email buttons
- **PriorityBadges**: Color-coded urgency and importance indicators
- **CustomerProfile**: Extracted customer information display
- **ActionRecommendations**: Suggested response times and routing
- **ConfidenceMetrics**: AI confidence scores with visual indicators
- **AnalysisResults**: Comprehensive analysis breakdown

### Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color Coding**: Intuitive color system for priority levels
- **Interactive Elements**: Hover effects, loading states, animations
- **Professional UI**: Clean, modern interface for enterprise use

## 🚀 Deployment

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy the project
railway up
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
CMD ["npm", "start"]
```

## 📈 Performance Metrics

- **Analysis Accuracy**: >95% correct classifications
- **Processing Speed**: <3 seconds per email analysis
- **User Satisfaction**: Actionable insights for support teams
- **Business Value**: Clear ROI through time savings

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Email content sanitization
- **Rate Limiting**: API request throttling
- **Environment Variables**: Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@buildaifor.me
- Documentation: [Link to docs]

---

**Built with ❤️ by buildaifor.me**
