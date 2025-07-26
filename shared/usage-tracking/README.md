# Usage Tracking System

## Overview
This is a comprehensive usage tracking system that monitors API usage, user activity, and system performance across all BuildAIFor.Me services. It provides real-time analytics, billing integration, and performance insights.

## Features

### Core Functionality
- **API Usage Monitoring**: Track API calls, response times, and error rates
- **User Activity Tracking**: Monitor user sessions, feature usage, and engagement
- **Performance Metrics**: System performance, resource utilization, and bottlenecks
- **Billing Integration**: Usage-based billing and cost tracking
- **Real-time Analytics**: Live dashboards and reporting

### Tracking Capabilities
- **Request/Response Logging**: Complete API request and response tracking
- **Error Monitoring**: Error tracking, alerting, and resolution
- **Rate Limiting**: Dynamic rate limiting based on usage patterns
- **Cost Analysis**: Detailed cost breakdown by service and user
- **Usage Forecasting**: Predict future usage and costs

## Technology Stack

### Backend
- **Python**: FastAPI framework
- **PostgreSQL**: Usage data storage
- **Redis**: Real-time caching and session management
- **Apache Kafka**: Event streaming for high-volume data
- **Elasticsearch**: Log aggregation and search

### Analytics
- **Pandas**: Data processing and analysis
- **NumPy**: Numerical computations
- **Matplotlib/Plotly**: Data visualization
- **Custom ML Models**: Usage pattern analysis

### Infrastructure
- **Docker**: Containerized deployment
- **Kubernetes**: Orchestration and scaling
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

## Quick Start

### Prerequisites
- Python 3.9+ installed
- PostgreSQL database
- Redis server
- Apache Kafka (optional for high-volume)

### Installation
```bash
# Clone the usage tracking system
cd shared/usage-tracking

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python manage.py migrate

# Start the service
python app.py
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/usage_tracking
REDIS_URL=redis://localhost:6379

# Kafka (optional)
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC=usage_events

# Elasticsearch (optional)
ELASTICSEARCH_URL=http://localhost:9200

# Application
LOG_LEVEL=info
RETENTION_DAYS=90
BATCH_SIZE=1000
```

## Integration

### API Integration
```python
# Example usage tracking middleware
from usage_tracking import UsageTracker

# Initialize tracker
tracker = UsageTracker(
    api_key="your_api_key",
    service_name="chatbot",
    endpoint="https://tracking.buildaiforme.com"
)

# Track API call
@tracker.track_request
def process_chat_message(message, user_id):
    # Your API logic here
    response = ai_service.process(message)

    # Track response
    tracker.track_response(
        user_id=user_id,
        tokens_used=response.tokens,
        cost=response.cost,
        duration=response.duration
    )

    return response
```

### Webhook Integration
```python
# Configure webhooks for real-time notifications
WEBHOOK_CONFIG = {
    "usage_threshold": "https://your-app.com/webhook/usage-threshold",
    "billing_alert": "https://your-app.com/webhook/billing-alert",
    "error_alert": "https://your-app.com/webhook/error-alert"
}
```

### Database Schema
```sql
-- Usage events table
CREATE TABLE usage_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    service_name VARCHAR(100),
    endpoint VARCHAR(255),
    method VARCHAR(10),
    request_size INTEGER,
    response_size INTEGER,
    duration_ms INTEGER,
    status_code INTEGER,
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- User sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_requests INTEGER,
    total_cost DECIMAL(10,4),
    user_agent TEXT,
    ip_address INET
);
```

## Configuration

### Tracking Configuration
```python
# config/tracking_config.py
TRACKING_CONFIG = {
    "api_tracking": {
        "enabled": True,
        "track_request_body": False,  # Privacy concern
        "track_response_body": False,
        "track_headers": ["user-agent", "authorization"],
        "exclude_paths": ["/health", "/metrics"]
    },
    "user_tracking": {
        "enabled": True,
        "track_sessions": True,
        "track_page_views": True,
        "track_clicks": True,
        "anonymize_data": True
    },
    "performance_tracking": {
        "enabled": True,
        "track_response_time": True,
        "track_memory_usage": True,
        "track_cpu_usage": True,
        "track_database_queries": True
    }
}
```

### Billing Configuration
```python
# config/billing_config.py
BILLING_CONFIG = {
    "pricing": {
        "openai_gpt4": 0.03,  # per 1K tokens
        "openai_gpt35": 0.002,  # per 1K tokens
        "anthropic_claude": 0.015,  # per 1K tokens
        "custom_model": 0.01  # per 1K tokens
    },
    "limits": {
        "free_tier": {
            "daily_requests": 1000,
            "daily_cost": 10.00,
            "concurrent_requests": 5
        },
        "pro_tier": {
            "daily_requests": 10000,
            "daily_cost": 100.00,
            "concurrent_requests": 20
        }
    },
    "alerts": {
        "cost_threshold": 0.8,  # 80% of limit
        "request_threshold": 0.9,  # 90% of limit
        "notification_channels": ["email", "webhook"]
    }
}
```

## API Endpoints

### Usage Analytics
```bash
# Get usage summary
curl -X GET "https://tracking.buildaiforme.com/api/usage/summary" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json"

# Get detailed usage report
curl -X POST "https://tracking.buildaiforme.com/api/usage/report" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "group_by": "service",
    "format": "json"
  }'

# Get real-time usage
curl -X GET "https://tracking.buildaiforme.com/api/usage/realtime" \
  -H "Authorization: Bearer your_api_key"
```

### Billing Information
```bash
# Get current billing status
curl -X GET "https://tracking.buildaiforme.com/api/billing/status" \
  -H "Authorization: Bearer your_api_key"

# Get billing history
curl -X GET "https://tracking.buildaiforme.com/api/billing/history" \
  -H "Authorization: Bearer your_api_key"

# Get cost breakdown
curl -X POST "https://tracking.buildaiforme.com/api/billing/breakdown" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "group_by": ["service", "user"]
  }'
```

## Monitoring and Alerts

### Built-in Dashboards
- **Usage Overview**: Total requests, costs, and trends
- **Service Performance**: Response times and error rates by service
- **User Analytics**: User engagement and usage patterns
- **Cost Analysis**: Cost breakdown and forecasting

### Alert Configuration
```python
# config/alerts.py
ALERT_CONFIG = {
    "cost_alerts": {
        "daily_limit_80": {
            "condition": "daily_cost > daily_limit * 0.8",
            "notification": "email",
            "message": "Daily cost limit approaching"
        },
        "daily_limit_exceeded": {
            "condition": "daily_cost > daily_limit",
            "notification": "webhook",
            "message": "Daily cost limit exceeded"
        }
    },
    "performance_alerts": {
        "high_error_rate": {
            "condition": "error_rate > 0.05",  # 5%
            "notification": "slack",
            "message": "High error rate detected"
        },
        "slow_response_time": {
            "condition": "avg_response_time > 5000",  # 5 seconds
            "notification": "email",
            "message": "Slow response times detected"
        }
    }
}
```

## Data Retention and Privacy

### Data Retention Policy
```python
# config/retention.py
RETENTION_CONFIG = {
    "usage_events": {
        "retention_days": 90,
        "archive_after_days": 30,
        "delete_after_days": 365
    },
    "user_sessions": {
        "retention_days": 30,
        "anonymize_after_days": 7
    },
    "performance_metrics": {
        "retention_days": 180,
        "aggregate_after_days": 30
    }
}
```

### Privacy Compliance
- **GDPR Compliance**: Data anonymization and deletion
- **Data Encryption**: Encrypt sensitive data at rest and in transit
- **Access Control**: Role-based access to usage data
- **Audit Logging**: Track all access to usage data

## Performance Optimization

### Caching Strategy
```python
# config/caching.py
CACHE_CONFIG = {
    "redis": {
        "host": "localhost",
        "port": 6379,
        "db": 0,
        "max_connections": 20
    },
    "cache_ttl": {
        "usage_summary": 300,  # 5 minutes
        "user_stats": 600,     # 10 minutes
        "billing_info": 3600   # 1 hour
    }
}
```

### Database Optimization
```python
# config/database.py
DATABASE_CONFIG = {
    "connection_pool": {
        "min_size": 5,
        "max_size": 20,
        "max_queries": 50000
    },
    "indexes": [
        "CREATE INDEX idx_usage_events_user_id ON usage_events(user_id)",
        "CREATE INDEX idx_usage_events_timestamp ON usage_events(timestamp)",
        "CREATE INDEX idx_usage_events_service ON usage_events(service_name)"
    ],
    "partitioning": {
        "table": "usage_events",
        "partition_by": "timestamp",
        "partition_interval": "month"
    }
}
```

## Support and Documentation

### Documentation
- [API Reference](./docs/api-reference.md)
- [Integration Guide](./docs/integration-guide.md)
- [Configuration Guide](./docs/configuration-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)

### Support Channels
- **Email Support**: support@buildaiforme.com
- **Documentation**: docs.buildaiforme.com
- **Community Forum**: community.buildaiforme.com

---

*This usage tracking system provides comprehensive monitoring and analytics for all BuildAIFor.Me services, enabling data-driven decisions and cost optimization.*
