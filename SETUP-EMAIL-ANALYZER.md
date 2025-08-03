# Email Analyzer Setup Guide

## 🎯 Access URL
Your AI Email Analyzer is now available at:
**http://localhost:5175/portfolio/ai-email-workflow**

## 🔧 Setup Required

### 1. Create Environment File
Create a `.env` file in the root directory with your OpenAI API key:

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 3. Restart Development Server
After adding the API key, restart the development server:
```bash
npm run dev
```

## 🧪 Testing the Application

1. **Navigate to**: `http://localhost:5175/portfolio/ai-email-workflow`
2. **Browse Email Categories**: Use the tabs (🚨 Urgent, 💰 Billing, 🔧 Technical, 😠 Complaints, 📝 General)
3. **Search Emails**: Use the search bar to find specific emails
4. **Click Any Email**: Select an email to see instant AI analysis
5. **View Results**: See comprehensive analysis in the right pane

## 📊 New Dual-Pane Interface

### Left Pane - Email Templates
- **Category Tabs**: Browse emails by urgency, billing, technical, complaints, general
- **Search Functionality**: Find emails by subject, sender, or content
- **Email Cards**: Clickable cards showing subject, sender, preview, timestamp
- **Email Counts**: Shows number of emails in each category

### Right Pane - AI Analysis Dashboard
- **Priority Analysis**: Large color-coded urgency/importance badges
- **Classification**: Category, sentiment, churn risk
- **Customer Profile**: Extracted contact information
- **Action Items**: Response time, routing, AI reasoning
- **Professional Cards**: Clean, organized information display

## 🎨 Features

- **AI-Powered Analysis**: Uses OpenAI GPT-3.5-turbo
- **Priority Classification**: Urgency and importance levels with color coding
- **Sentiment Analysis**: Customer emotion and churn risk
- **Customer Extraction**: Name, company, account details
- **Smart Routing**: Response time and team recommendations
- **Professional UI**: Clean, responsive design with Tailwind CSS
- **Real-time Analysis**: Instant AI analysis when selecting emails

## 🔄 Integration Details

- **Route**: `/portfolio/ai-email-workflow`
- **Component**: `src/pages/portfolio/AIEmailWorkflow.tsx`
- **Data**: `src/data/sample-emails.json`
- **Dependencies**: axios, shadcn/ui components

## 🚨 Troubleshooting

- **API Key Error**: Make sure your `.env` file is in the root directory and contains the correct API key
- **Build Errors**: Run `npm install` to ensure all dependencies are installed
- **Port Issues**: The app runs on port 5175 by default
- **Not Loading**: Make sure the main development server is running with `npm run dev`
