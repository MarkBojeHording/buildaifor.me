# Authentication Systems

## Overview
This is a comprehensive authentication and authorization system that provides secure user management, role-based access control, and multi-factor authentication for all BuildAIFor.Me services. It supports multiple authentication methods and integrates with external identity providers.

## Features

### Core Functionality
- **User Management**: User registration, login, and profile management
- **Role-Based Access Control**: Granular permissions and role management
- **Multi-Factor Authentication**: SMS, email, and authenticator app support
- **Session Management**: Secure session handling and token management
- **OAuth Integration**: Support for Google, GitHub, and other providers

### Security Features
- **Password Security**: Secure password hashing and validation
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Complete authentication event logging
- **Account Lockout**: Protection against suspicious activity

## Technology Stack

### Backend
- **Python**: FastAPI framework
- **PostgreSQL**: User data and session storage
- **Redis**: Session caching and rate limiting
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

### Security
- **OAuth2**: OpenID Connect integration
- **TOTP**: Time-based one-time passwords
- **SMS/Email**: Multi-factor authentication
- **HTTPS**: Secure communication

### Infrastructure
- **Docker**: Containerized deployment
- **Kubernetes**: Orchestration and scaling
- **Prometheus**: Security metrics
- **Grafana**: Security dashboards

## Quick Start

### Prerequisites
- Python 3.9+ installed
- PostgreSQL database
- Redis server
- SMTP server (for email verification)

### Installation
```bash
# Clone the authentication system
cd shared/auth-systems

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
DATABASE_URL=postgresql://user:pass@localhost/auth_system
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your_secure_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Integration

### API Integration
```python
# Example authentication middleware
from auth_systems import AuthMiddleware, require_auth

# Initialize auth middleware
auth_middleware = AuthMiddleware(
    secret_key="your_secret_key",
    algorithm="HS256"
)

# Protected endpoint
@app.post("/api/protected")
@require_auth
async def protected_endpoint(current_user: User):
    return {"message": f"Hello {current_user.email}"}

# Role-based access
@app.post("/api/admin")
@require_auth(roles=["admin"])
async def admin_endpoint(current_user: User):
    return {"message": "Admin access granted"}
```

### Client Integration
```javascript
// JavaScript client integration
import { AuthClient } from '@buildaiforme/auth-client';

const authClient = new AuthClient({
    baseUrl: 'https://auth.buildaiforme.com',
    clientId: 'your_client_id'
});

// Login
const user = await authClient.login({
    email: 'user@example.com',
    password: 'password'
});

// Get user info
const userInfo = await authClient.getUser();

// Logout
await authClient.logout();
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User roles table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

### Authentication Configuration
```python
# config/auth_config.py
AUTH_CONFIG = {
    "password_policy": {
        "min_length": 8,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_numbers": True,
        "require_special_chars": True,
        "max_age_days": 90
    },
    "session_config": {
        "session_timeout": 3600,  # 1 hour
        "refresh_token_timeout": 604800,  # 7 days
        "max_concurrent_sessions": 5
    },
    "mfa_config": {
        "enabled": True,
        "methods": ["totp", "sms", "email"],
        "backup_codes": True,
        "remember_device": True
    },
    "rate_limiting": {
        "login_attempts": 5,
        "lockout_duration": 900,  # 15 minutes
        "reset_after": 3600  # 1 hour
    }
}
```

### OAuth Configuration
```python
# config/oauth_config.py
OAUTH_CONFIG = {
    "providers": {
        "google": {
            "client_id": "your_google_client_id",
            "client_secret": "your_google_client_secret",
            "authorization_url": "https://accounts.google.com/o/oauth2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "userinfo_url": "https://www.googleapis.com/oauth2/v2/userinfo",
            "scopes": ["openid", "email", "profile"]
        },
        "github": {
            "client_id": "your_github_client_id",
            "client_secret": "your_github_client_secret",
            "authorization_url": "https://github.com/login/oauth/authorize",
            "token_url": "https://github.com/login/oauth/access_token",
            "userinfo_url": "https://api.github.com/user",
            "scopes": ["read:user", "user:email"]
        }
    },
    "callback_urls": {
        "google": "https://your-domain.com/auth/callback/google",
        "github": "https://your-domain.com/auth/callback/github"
    }
}
```

## API Endpoints

### Authentication
```bash
# User registration
curl -X POST "https://auth.buildaiforme.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# User login
curl -X POST "https://auth.buildaiforme.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'

# Refresh token
curl -X POST "https://auth.buildaiforme.com/api/auth/refresh" \
  -H "Authorization: Bearer your_refresh_token"

# Logout
curl -X POST "https://auth.buildaiforme.com/api/auth/logout" \
  -H "Authorization: Bearer your_access_token"
```

### User Management
```bash
# Get user profile
curl -X GET "https://auth.buildaiforme.com/api/users/profile" \
  -H "Authorization: Bearer your_access_token"

# Update user profile
curl -X PUT "https://auth.buildaiforme.com/api/users/profile" \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith"
  }'

# Change password
curl -X POST "https://auth.buildaiforme.com/api/users/change-password" \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "oldpassword",
    "new_password": "newpassword123"
  }'
```

### Multi-Factor Authentication
```bash
# Enable MFA
curl -X POST "https://auth.buildaiforme.com/api/auth/mfa/enable" \
  -H "Authorization: Bearer your_access_token"

# Verify MFA
curl -X POST "https://auth.buildaiforme.com/api/auth/mfa/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "method": "totp"
  }'
```

## Security Features

### Password Security
```python
# Password hashing and validation
from auth_systems.security import PasswordManager

password_manager = PasswordManager()

# Hash password
hashed_password = password_manager.hash_password("securepassword123")

# Verify password
is_valid = password_manager.verify_password("securepassword123", hashed_password)

# Check password strength
strength = password_manager.check_strength("password123")
```

### JWT Token Management
```python
# JWT token handling
from auth_systems.jwt import JWTManager

jwt_manager = JWTManager(
    secret_key="your_secret_key",
    algorithm="HS256"
)

# Create token
token = jwt_manager.create_token(
    user_id=123,
    email="user@example.com",
    roles=["user"]
)

# Verify token
payload = jwt_manager.verify_token(token)

# Refresh token
new_token = jwt_manager.refresh_token(refresh_token)
```

### Rate Limiting
```python
# Rate limiting configuration
RATE_LIMIT_CONFIG = {
    "login": {
        "max_attempts": 5,
        "window": 900,  # 15 minutes
        "lockout_duration": 1800  # 30 minutes
    },
    "registration": {
        "max_attempts": 3,
        "window": 3600,  # 1 hour
        "lockout_duration": 7200  # 2 hours
    },
    "password_reset": {
        "max_attempts": 3,
        "window": 3600,  # 1 hour
        "lockout_duration": 7200  # 2 hours
    }
}
```

## Monitoring and Alerts

### Security Monitoring
- **Failed Login Attempts**: Track and alert on suspicious activity
- **Account Lockouts**: Monitor and manage locked accounts
- **Token Usage**: Track JWT token usage and expiration
- **Session Activity**: Monitor active sessions and anomalies

### Audit Logging
```python
# Audit log configuration
AUDIT_CONFIG = {
    "events": [
        "user_login",
        "user_logout",
        "password_change",
        "mfa_enabled",
        "role_assigned",
        "account_locked"
    ],
    "retention_days": 365,
    "encryption": True,
    "export_format": "json"
}
```

## Compliance and Privacy

### GDPR Compliance
- **Data Portability**: Export user data on request
- **Right to Deletion**: Complete account deletion
- **Consent Management**: Track and manage user consent
- **Data Minimization**: Collect only necessary data

### Security Standards
- **OWASP Guidelines**: Follow OWASP security best practices
- **SOC 2 Compliance**: Security and availability controls
- **ISO 27001**: Information security management
- **PCI DSS**: Payment card industry standards

## Performance Optimization

### Caching Strategy
```python
# Caching configuration
CACHE_CONFIG = {
    "redis": {
        "host": "localhost",
        "port": 6379,
        "db": 1,
        "max_connections": 20
    },
    "cache_ttl": {
        "user_profile": 3600,  # 1 hour
        "user_roles": 1800,    # 30 minutes
        "session_data": 300    # 5 minutes
    }
}
```

### Database Optimization
```python
# Database optimization
DB_CONFIG = {
    "connection_pool": {
        "min_size": 5,
        "max_size": 20,
        "max_queries": 50000
    },
    "indexes": [
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_sessions_token ON sessions(session_token)",
        "CREATE INDEX idx_user_roles_user_id ON user_roles(user_id)"
    ]
}
```

## Support and Documentation

### Documentation
- [API Reference](./docs/api-reference.md)
- [Integration Guide](./docs/integration-guide.md)
- [Security Guide](./docs/security-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)

### Support Channels
- **Email Support**: support@buildaiforme.com
- **Documentation**: docs.buildaiforme.com
- **Community Forum**: community.buildaiforme.com

---

*This authentication system provides secure, scalable user management and access control for all BuildAIFor.Me services.*
