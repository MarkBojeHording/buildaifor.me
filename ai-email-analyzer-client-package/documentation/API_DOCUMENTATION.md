# AI Email Analyzer - API Documentation

> Complete API reference for the AI Email Analyzer client package with detailed endpoint specifications, authentication, and integration examples.

## 🔐 Authentication

All API endpoints require authentication via Supabase JWT tokens.

### Authentication Headers
```javascript
const { data: { session } } = await supabase.auth.getSession()
const token = session.access_token

// Include in requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Anonymous Access (Demo Mode)
For demo purposes, you can use the anonymous key:
```javascript
headers: {
  'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
}
```

---

## 📧 Core Endpoints

### POST /functions/v1/email-analyzer-demo
Analyze a single email for priority, sentiment, and routing.

#### Request Body
```json
{
  "subject": "Urgent: Payment Processing Issue",
  "body": "I'm unable to complete my purchase. The payment keeps failing and I'm getting error messages. This is affecting my business operations.",
  "senderEmail": "customer@example.com",
  "receivedAt": "2024-01-15T10:30:00Z"
}
```

#### Response
```json
{
  "success": true,
  "analysis": {
    "id": "uuid",
    "priority_level": "high",
    "sentiment_score": -0.34,
    "sentiment_label": "negative",
    "urgency_score": 8,
    "primary_category": "billing_issues",
    "secondary_categories": ["payment_processing", "technical_support"],
    "recommended_department": "billing",
    "summary": "Customer experiencing payment processing failures affecting business operations",
    "key_issues": ["payment_failure", "business_impact", "technical_issue"],
    "suggested_response": "Thank you for contacting us about the payment issue. We understand this is affecting your business operations and we're here to help resolve this immediately.",
    "escalation_required": true,
    "estimated_resolution_time": 30,
    "analysis_confidence": 0.94,
    "processing_time_ms": 847
  },
  "processing_time_ms": 1205
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Missing required fields: subject, body, senderEmail",
  "message": "Validation failed"
}
```

### POST /functions/v1/get-analytics
Retrieve analytics dashboard data.

#### Request Body
```json
{
  "period": "7d"
}
```

#### Response
```json
{
  "success": true,
  "analytics": {
    "summary": {
      "totalEmails": 1247,
      "avgSentiment": 0.12,
      "highPriorityCount": 89,
      "avgProcessingTime": 847
    },
    "dailyMetrics": [
      {
        "date": "2024-01-15",
        "count": 45,
        "avgSentiment": 0.15,
        "highPriorityCount": 3
      }
    ],
    "categoryBreakdown": [
      {
        "category": "Technical Support",
        "count": 45,
        "percentage": 30
      }
    ],
    "sentimentTrend": [
      {
        "date": "2024-01-15",
        "positive": 15,
        "negative": 8,
        "neutral": 22
      }
    ],
    "priorityDistribution": [
      {
        "priority": "High",
        "count": 25,
        "percentage": 17
      }
    ]
  },
  "period": "7d"
}
```

---

## 🗄️ Database Direct Access

### Email Analyses Table
```sql
-- Get all analyses for a user
SELECT * FROM email_analyses
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 50;

-- Get analyses by priority level
SELECT * FROM email_analyses
WHERE user_id = auth.uid()
AND priority_level = 'high'
ORDER BY created_at DESC;

-- Get sentiment analysis summary
SELECT
  sentiment_label,
  COUNT(*) as count,
  AVG(sentiment_score) as avg_score
FROM email_analyses
WHERE user_id = auth.uid()
GROUP BY sentiment_label;
```

### Performance Metrics
```sql
-- Get user performance metrics
SELECT * FROM performance_metrics
WHERE user_id = auth.uid()
AND period_start >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY period_start DESC;
```

### User Preferences
```sql
-- Get user preferences
SELECT * FROM user_preferences
WHERE user_id = auth.uid();

-- Update user preferences
UPDATE user_preferences
SET theme = 'dark', language = 'en'
WHERE user_id = auth.uid();
```

---

## 🔄 Real-time Subscriptions

### WebSocket Subscriptions
```javascript
// Subscribe to new email analyses
const subscription = supabase
  .channel('email_analyses')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'email_analyses',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New analysis:', payload.new)
      // Handle new analysis
    }
  )
  .subscribe()

// Subscribe to analytics updates
const analyticsSubscription = supabase
  .channel('analytics_updates')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'analytics_logs',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New analytics:', payload.new)
      // Update analytics dashboard
    }
  )
  .subscribe()
```

---

## 🔗 Integration Examples

### CRM Integration (Salesforce)
```javascript
async function syncToSalesforce(analysis) {
  const caseData = {
    Subject: analysis.email_subject,
    Priority: analysis.priority_level,
    Status: 'New',
    Origin: 'Email',
    Description: analysis.summary,
    Type: analysis.primary_category,
    Sentiment__c: analysis.sentiment_label,
    Urgency_Score__c: analysis.urgency_score
  }

  try {
    const response = await fetch('/api/salesforce/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${salesforceToken}`
      },
      body: JSON.stringify(caseData)
    })

    return await response.json()
  } catch (error) {
    console.error('Salesforce sync error:', error)
    throw error
  }
}
```

### Help Desk Integration (Zendesk)
```javascript
async function createZendeskTicket(analysis) {
  const ticket = {
    subject: analysis.email_subject,
    priority: mapPriority(analysis.priority_level),
    tags: analysis.secondary_categories,
    comment: {
      body: analysis.suggested_response
    },
    custom_fields: [
      {
        id: 360000123456, // Sentiment field ID
        value: analysis.sentiment_label
      },
      {
        id: 360000123457, // Urgency field ID
        value: analysis.urgency_score
      }
    ]
  }

  try {
    const response = await fetch('/api/zendesk/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${zendeskToken}`
      },
      body: JSON.stringify(ticket)
    })

    return await response.json()
  } catch (error) {
    console.error('Zendesk integration error:', error)
    throw error
  }
}

function mapPriority(priority) {
  const priorityMap = {
    'high': 'urgent',
    'medium': 'high',
    'low': 'normal'
  }
  return priorityMap[priority] || 'normal'
}
```

### Slack Integration
```javascript
async function sendSlackNotification(analysis) {
  const message = {
    channel: '#support-alerts',
    text: 'New high-priority email detected',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Email Analysis*\n*Subject:* ${analysis.email_subject}\n*Priority:* ${analysis.priority_level}\n*Sentiment:* ${analysis.sentiment_label}\n*Department:* ${analysis.recommended_department}`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Details'
            },
            url: `${dashboardUrl}/analysis/${analysis.id}`
          }
        ]
      }
    ]
  }

  try {
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })

    return response.ok
  } catch (error) {
    console.error('Slack notification error:', error)
    throw error
  }
}
```

### Email Integration (SendGrid)
```javascript
async function sendEmailNotification(analysis) {
  const emailData = {
    to: analysis.assigned_agent_email,
    from: 'noreply@yourcompany.com',
    subject: `New ${analysis.priority_level} priority email assigned`,
    template_id: 'd-1234567890abcdef',
    dynamic_template_data: {
      email_subject: analysis.email_subject,
      priority_level: analysis.priority_level,
      sentiment: analysis.sentiment_label,
      department: analysis.recommended_department,
      estimated_time: analysis.estimated_resolution_time,
      dashboard_url: `${dashboardUrl}/analysis/${analysis.id}`
    }
  }

  try {
    const response = await fetch('/api/sendgrid/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sendgridApiKey}`
      },
      body: JSON.stringify(emailData)
    })

    return await response.json()
  } catch (error) {
    console.error('Email notification error:', error)
    throw error
  }
}
```

---

## 📊 Analytics API

### Batch Analytics
```javascript
async function getBatchAnalytics(filters) {
  const response = await fetch('/api/analytics/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      filters: {
        priority: ['high', 'medium'],
        sentiment: ['negative'],
        category: ['technical_support', 'billing']
      },
      groupBy: ['date', 'category'],
      metrics: ['count', 'avg_sentiment', 'avg_processing_time']
    })
  })

  return await response.json()
}
```

### Custom Reports
```javascript
async function generateCustomReport(reportConfig) {
  const response = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Monthly Support Report',
      type: 'email_analysis',
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      filters: reportConfig.filters,
      columns: reportConfig.columns,
      sortOrder: reportConfig.sortOrder,
      exportFormat: 'pdf'
    })
  })

  return await response.json()
}
```

---

## 🔧 Configuration API

### System Configuration
```javascript
async function getSystemConfig() {
  const response = await fetch('/api/config/system', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return await response.json()
}

async function updateSystemConfig(config) {
  const response = await fetch('/api/config/system', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(config)
  })

  return await response.json()
}
```

### Custom Rules Engine
```javascript
async function getCustomRules() {
  const response = await fetch('/api/rules/custom', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return await response.json()
}

async function createCustomRule(rule) {
  const response = await fetch('/api/rules/custom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'High Value Customer Rule',
      description: 'Automatically escalate emails from high-value customers',
      conditions: {
        customer_tier: 'enterprise',
        monthly_spend: { operator: 'gte', value: 10000 }
      },
      actions: {
        priority_boost: 2,
        department_override: 'enterprise_support',
        escalation_required: true
      },
      enabled: true
    })
  })

  return await response.json()
}
```

---

## 🚨 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details",
    "suggestion": "How to fix the error"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `RATE_LIMITED`: Rate limit exceeded
- `VALIDATION_ERROR`: Request validation failed
- `OPENAI_ERROR`: OpenAI API error
- `DATABASE_ERROR`: Database operation failed
- `INTEGRATION_ERROR`: Third-party integration error

### Error Handling Example
```javascript
async function handleApiCall(apiFunction) {
  try {
    const result = await apiFunction()
    return { success: true, data: result }
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data

      switch (errorData.code) {
        case 'AUTH_REQUIRED':
          // Redirect to login
          window.location.href = '/login'
          break
        case 'RATE_LIMITED':
          // Show rate limit message
          showRateLimitMessage(errorData.details.retry_after)
          break
        case 'OPENAI_ERROR':
          // Fallback to rule-based analysis
          return await fallbackAnalysis()
        default:
          // Show generic error
          showErrorMessage(errorData.error)
      }
    } else {
      // Network error
      showErrorMessage('Network error. Please check your connection.')
    }

    return { success: false, error: error.message }
  }
}
```

---

## 📈 Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
Retry-After: 60
```

### Rate Limit Handling
```javascript
async function makeRateLimitedRequest(url, options) {
  const response = await fetch(url, options)

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After')
    const waitTime = parseInt(retryAfter) * 1000

    console.log(`Rate limited. Waiting ${waitTime}ms before retry.`)

    await new Promise(resolve => setTimeout(resolve, waitTime))
    return makeRateLimitedRequest(url, options)
  }

  return response
}
```

---

## 🔍 Search & Filtering

### Email Search API
```javascript
async function searchEmails(searchParams) {
  const response = await fetch('/api/emails/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: searchParams.query,
      filters: {
        dateRange: {
          start: '2024-01-01',
          end: '2024-01-31'
        },
        priority: ['high', 'medium'],
        sentiment: ['negative'],
        category: ['technical_support'],
        department: ['billing', 'support']
      },
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 50
    })
  })

  return await response.json()
}
```

### Advanced Filtering
```javascript
const advancedFilters = {
  textSearch: {
    fields: ['subject', 'body', 'sender_email'],
    query: 'payment failed'
  },
  dateFilters: {
    created_at: {
      operator: 'gte',
      value: '2024-01-01'
    },
    updated_at: {
      operator: 'lte',
      value: '2024-01-31'
    }
  },
  numericFilters: {
    sentiment_score: {
      operator: 'lt',
      value: -0.5
    },
    urgency_score: {
      operator: 'gte',
      value: 8
    }
  },
  arrayFilters: {
    secondary_categories: {
      operator: 'contains',
      value: ['payment_processing']
    }
  }
}
```

---

## 📤 Export & Reporting

### Export API
```javascript
async function exportData(exportConfig) {
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      format: 'csv', // 'csv', 'json', 'pdf', 'excel'
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      filters: exportConfig.filters,
      columns: exportConfig.columns,
      includeAnalytics: true,
      includeRawData: false
    })
  })

  if (response.ok) {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-analysis-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
```

### Scheduled Reports
```javascript
async function createScheduledReport(reportConfig) {
  const response = await fetch('/api/reports/scheduled', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Weekly Support Summary',
      schedule: {
        frequency: 'weekly',
        dayOfWeek: 1, // Monday
        time: '09:00',
        timezone: 'America/New_York'
      },
      recipients: ['manager@company.com', 'support@company.com'],
      reportConfig: {
        type: 'analytics_summary',
        dateRange: 'last_week',
        format: 'pdf'
      }
    })
  })

  return await response.json()
}
```

---

## 🔐 Security & Compliance

### Data Encryption
All sensitive data is encrypted at rest and in transit using industry-standard encryption.

### GDPR Compliance
```javascript
// Data export for GDPR compliance
async function exportUserData(userId) {
  const response = await fetch('/api/gdpr/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: userId,
      includeAnalytics: true,
      includePreferences: true
    })
  })

  return await response.json()
}

// Data deletion for GDPR compliance
async function deleteUserData(userId) {
  const response = await fetch('/api/gdpr/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: userId,
      confirmation: 'I understand this action cannot be undone'
    })
  })

  return await response.json()
}
```

### Audit Logging
```javascript
// Get audit logs
async function getAuditLogs(filters) {
  const response = await fetch('/api/audit/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      actions: ['email_analyzed', 'data_exported', 'settings_changed'],
      userId: 'optional-user-id'
    })
  })

  return await response.json()
}
```

---

## 📞 Support & Resources

### API Status
```javascript
// Check API health
async function checkApiHealth() {
  const response = await fetch('/api/health')
  return await response.json()
}

// Get API status
async function getApiStatus() {
  const response = await fetch('/api/status')
  return await response.json()
}
```

### Documentation Links
- [Interactive API Documentation](https://docs.ai-email-analyzer.com/api)
- [SDK Documentation](https://docs.ai-email-analyzer.com/sdk)
- [Integration Examples](https://docs.ai-email-analyzer.com/integrations)
- [Troubleshooting Guide](https://docs.ai-email-analyzer.com/troubleshooting)

### Support Channels
- Email: api-support@ai-email-analyzer.com
- Documentation: https://docs.ai-email-analyzer.com
- GitHub Issues: https://github.com/your-org/ai-email-analyzer-client/issues
- Discord: https://discord.gg/ai-email-analyzer

---

## 📋 API Versioning

### Version Headers
```javascript
// Specify API version
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-API-Version': 'v1'
}
```

### Version Compatibility
- Current Version: v1
- Deprecation Policy: 12 months notice
- Breaking Changes: 6 months notice
- Migration Guides: Available for all version changes

---

**Ready to integrate?** Start with the core endpoints and gradually add advanced features as needed. The API is designed to be simple to use while providing powerful capabilities for enterprise applications.
