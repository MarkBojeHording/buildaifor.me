# Business Logic Configuration Guide

## Overview

The Tier 2 Advanced Business Logic Chatbot provides sophisticated, configurable business rules that can be tailored to your specific industry and business needs. This guide covers all aspects of business logic customization, from lead scoring algorithms to conversation workflows.

## 🎯 Lead Scoring Configuration

### Real Estate Lead Scoring

```json
{
  "lead_scoring": {
    "real_estate": {
      "weights": {
        "budget": 30,
        "timeline": 25,
        "property_type": 20,
        "location": 15,
        "engagement": 10
      },
      "budget_ranges": {
        "luxury": { "min": 1000000, "points": 30 },
        "high_end": { "min": 500000, "max": 999999, "points": 25 },
        "mid_range": { "min": 300000, "max": 499999, "points": 20 },
        "affordable": { "min": 200000, "max": 299999, "points": 15 },
        "budget": { "max": 199999, "points": 10 }
      },
      "timeline_urgency": {
        "immediate": { "keywords": ["urgent", "asap", "immediately"], "points": 25 },
        "quick": { "keywords": ["soon", "quickly", "fast"], "points": 20 },
        "flexible": { "keywords": ["month", "timeline"], "points": 15 },
        "no_timeline": { "points": 5 }
      },
      "property_types": {
        "house": { "points": 20, "keywords": ["house", "home", "single family"] },
        "condo": { "points": 18, "keywords": ["condo", "condominium", "apartment"] },
        "townhouse": { "points": 16, "keywords": ["townhouse", "town home"] },
        "land": { "points": 12, "keywords": ["land", "lot", "acreage"] },
        "commercial": { "points": 15, "keywords": ["commercial", "office", "retail"] }
      }
    }
  }
}
```

### Legal Case Scoring

```json
{
  "lead_scoring": {
    "legal": {
      "weights": {
        "case_severity": 35,
        "liability_strength": 25,
        "damage_potential": 20,
        "practice_area": 15,
        "urgency": 5
      },
      "case_severity": {
        "critical": { "keywords": ["serious", "severe", "critical", "emergency"], "points": 35 },
        "moderate": { "keywords": ["moderate", "significant", "substantial"], "points": 25 },
        "minor": { "keywords": ["minor", "small", "simple"], "points": 15 }
      },
      "liability_factors": {
        "clear_fault": { "keywords": ["clear fault", "negligence", "at fault"], "points": 25 },
        "mixed_liability": { "keywords": ["partial", "shared", "mixed"], "points": 15 },
        "unclear": { "keywords": ["unclear", "uncertain", "investigation"], "points": 10 }
      },
      "damage_types": {
        "medical": { "keywords": ["medical bills", "hospital", "treatment"], "points": 20 },
        "lost_wages": { "keywords": ["lost wages", "income", "work"], "points": 18 },
        "pain_suffering": { "keywords": ["pain", "suffering", "emotional"], "points": 15 },
        "property": { "keywords": ["property damage", "vehicle", "belongings"], "points": 12 }
      }
    }
  }
}
```

### E-commerce Purchase Intent

```json
{
  "lead_scoring": {
    "ecommerce": {
      "weights": {
        "purchase_intent": 40,
        "budget_qualification": 25,
        "product_specificity": 20,
        "urgency": 15
      },
      "purchase_signals": {
        "strong": { "keywords": ["buy", "purchase", "order", "checkout"], "points": 40 },
        "medium": { "keywords": ["interested", "considering", "looking"], "points": 30 },
        "weak": { "keywords": ["browse", "explore", "learn"], "points": 20 }
      },
      "budget_indicators": {
        "specific_budget": { "keywords": ["budget", "price range", "cost"], "points": 25 },
        "price_sensitive": { "keywords": ["affordable", "cheap", "discount"], "points": 20 },
        "premium": { "keywords": ["premium", "quality", "best"], "points": 15 }
      }
    }
  }
}
```

## 🧠 Intent Detection Rules

### Custom Intent Patterns

```json
{
  "intent_detection": {
    "confidence_threshold": 0.7,
    "multi_intent_support": true,
    "fallback_intent": "general_inquiry",
    "custom_intents": {
      "appointment_booking": {
        "patterns": [
          "schedule appointment",
          "book consultation",
          "make appointment",
          "set up meeting",
          "reserve time"
        ],
        "confidence": 0.9,
        "category": "action"
      },
      "pricing_inquiry": {
        "patterns": [
          "how much",
          "what's the cost",
          "pricing",
          "fees",
          "rates"
        ],
        "confidence": 0.85,
        "category": "information"
      },
      "complaint": {
        "patterns": [
          "complaint",
          "issue",
          "problem",
          "dissatisfied",
          "unhappy"
        ],
        "confidence": 0.8,
        "category": "support"
      }
    }
  }
}
```

### Industry-Specific Intents

```json
{
  "industry_intents": {
    "real_estate": {
      "property_search": {
        "patterns": ["property", "home", "house", "buy", "search"],
        "response_template": "I can help you find the perfect property! What type of home are you looking for?"
      },
      "market_analysis": {
        "patterns": ["market", "trends", "prices", "values"],
        "response_template": "Let me provide you with current market information for your area."
      }
    },
    "legal": {
      "case_assessment": {
        "patterns": ["case", "legal", "attorney", "lawyer"],
        "response_template": "I can help assess your case. Can you tell me more about your situation?"
      },
      "consultation_booking": {
        "patterns": ["consultation", "meeting", "appointment"],
        "response_template": "I'd be happy to schedule a consultation with one of our attorneys."
      }
    }
  }
}
```

## 💬 Conversation Workflows

### Multi-Stage Conversations

```json
{
  "conversation_workflows": {
    "lead_qualification": {
      "stages": [
        {
          "name": "initial_contact",
          "triggers": ["greeting", "general_inquiry"],
          "actions": ["welcome", "ask_qualifying_questions"],
          "next_stage": "qualification"
        },
        {
          "name": "qualification",
          "triggers": ["budget_info", "timeline_info"],
          "actions": ["score_lead", "collect_details"],
          "next_stage": "nurturing"
        },
        {
          "name": "nurturing",
          "triggers": ["lead_score_60_plus"],
          "actions": ["provide_value", "build_relationship"],
          "next_stage": "closing"
        },
        {
          "name": "closing",
          "triggers": ["lead_score_80_plus"],
          "actions": ["schedule_appointment", "request_contact"],
          "next_stage": "conversion"
        }
      ]
    }
  }
}
```

### Dynamic Response Generation

```json
{
  "response_generation": {
    "templates": {
      "welcome": {
        "real_estate": "Hello! Welcome to {business_name}! 🏠 I'm here to help you find your perfect property. How can I assist you today?",
        "legal": "Hello! Welcome to {business_name}! ⚖️ I'm here to help with your legal needs. How can I assist you today?",
        "ecommerce": "Hello! Welcome to {business_name}! 🛒 I'm here to help you find the perfect products. How can I assist you today?"
      },
      "qualification": {
        "budget_question": "What's your budget range for {service_type}?",
        "timeline_question": "What's your timeline for {action}?",
        "preference_question": "What are your preferences for {category}?"
      },
      "appointment": {
        "scheduling": "Great! I can help you schedule a {appointment_type}. What day works best for you?",
        "confirmation": "Perfect! Your {appointment_type} is confirmed for {date} at {time}."
      }
    },
    "variables": {
      "business_name": "Your Company Name",
      "service_type": "property search",
      "action": "purchasing",
      "category": "properties",
      "appointment_type": "consultation"
    }
  }
}
```

## 📅 Appointment Scheduling Logic

### Availability Rules

```json
{
  "appointment_scheduling": {
    "availability_rules": {
      "business_hours": {
        "monday": { "start": "09:00", "end": "18:00" },
        "tuesday": { "start": "09:00", "end": "18:00" },
        "wednesday": { "start": "09:00", "end": "18:00" },
        "thursday": { "start": "09:00", "end": "18:00" },
        "friday": { "start": "09:00", "end": "18:00" },
        "saturday": { "start": "10:00", "end": "16:00" },
        "sunday": { "start": "12:00", "end": "16:00" }
      },
      "buffer_time": 15,
      "max_appointments_per_day": 8,
      "advance_booking_limit": 30
    },
    "appointment_types": {
      "initial_consultation": {
        "duration": 30,
        "price": 0,
        "available_for": ["hot", "warm"],
        "required_fields": ["name", "email", "phone"]
      },
      "detailed_consultation": {
        "duration": 60,
        "price": 100,
        "available_for": ["hot"],
        "required_fields": ["name", "email", "phone", "case_details"]
      },
      "property_viewing": {
        "duration": 45,
        "price": 0,
        "available_for": ["hot", "warm"],
        "required_fields": ["name", "email", "phone", "property_address"]
      }
    }
  }
}
```

## 🔄 Lead Routing Logic

### Automatic Assignment Rules

```json
{
  "lead_routing": {
    "assignment_rules": {
      "high_value_leads": {
        "condition": "lead_score >= 85",
        "action": "assign_senior_agent",
        "priority": "urgent"
      },
      "practice_area_match": {
        "condition": "practice_area_detected",
        "action": "assign_specialist",
        "priority": "high"
      },
      "geographic_routing": {
        "condition": "location_specified",
        "action": "assign_local_agent",
        "priority": "medium"
      },
      "default_routing": {
        "condition": "default",
        "action": "assign_next_available",
        "priority": "normal"
      }
    },
    "escalation_rules": {
      "urgent_cases": {
        "condition": "urgency = high AND lead_score >= 90",
        "action": "notify_manager",
        "timeout": "1 hour"
      },
      "no_response": {
        "condition": "no_response_for_24_hours",
        "action": "escalate_to_supervisor",
        "timeout": "24 hours"
      }
    }
  }
}
```

## 📊 Analytics & Tracking

### Custom Metrics

```json
{
  "analytics": {
    "custom_metrics": {
      "lead_quality_score": {
        "calculation": "weighted_average(budget_score, timeline_score, engagement_score)",
        "thresholds": {
          "excellent": 85,
          "good": 70,
          "fair": 50,
          "poor": 30
        }
      },
      "conversation_efficiency": {
        "calculation": "messages_to_conversion / total_messages",
        "target": "< 0.3"
      },
      "response_quality": {
        "calculation": "user_satisfaction_score * intent_accuracy",
        "target": "> 0.8"
      }
    },
    "tracking_events": [
      "lead_created",
      "lead_qualified",
      "appointment_scheduled",
      "conversation_completed",
      "conversion_achieved"
    ],
    "conversion_funnels": {
      "lead_generation": {
        "stages": ["visit", "engagement", "qualification", "appointment", "conversion"],
        "targets": [100, 60, 30, 15, 8]
      }
    }
  }
}
```

## 🔌 Integration Logic

### CRM Integration Rules

```json
{
  "crm_integration": {
    "hubspot": {
      "lead_creation": {
        "trigger": "lead_score >= 60",
        "mapping": {
          "firstname": "user_profile.name",
          "email": "user_profile.email",
          "phone": "user_profile.phone",
          "lead_score": "lead_score",
          "source": "chatbot"
        },
        "properties": {
          "lead_status": "New",
          "lead_source": "AI Chatbot",
          "conversation_id": "session_id"
        }
      },
      "activity_logging": {
        "enabled": true,
        "events": [
          "message_sent",
          "appointment_scheduled",
          "lead_qualified"
        ]
      }
    }
  }
}
```

### Email Automation Rules

```json
{
  "email_automation": {
    "triggers": {
      "new_lead": {
        "condition": "lead_created",
        "template": "welcome_email",
        "delay": "5 minutes"
      },
      "appointment_confirmation": {
        "condition": "appointment_scheduled",
        "template": "appointment_confirmation",
        "delay": "immediate"
      },
      "follow_up": {
        "condition": "no_response_for_24_hours",
        "template": "follow_up_email",
        "delay": "24 hours"
      }
    },
    "templates": {
      "welcome_email": {
        "subject": "Welcome to {business_name}",
        "body": "Hi {name},\n\nThank you for reaching out! We're excited to help you.\n\nBest regards,\n{business_name} Team",
        "variables": ["name", "business_name"]
      }
    }
  }
}
```

## 🎨 Customization Examples

### Real Estate Customization

```json
{
  "real_estate_customization": {
    "property_search_logic": {
      "budget_matching": {
        "enabled": true,
        "tolerance": 0.2,
        "fallback": "nearest_match"
      },
      "location_preferences": {
        "school_districts": true,
        "commute_time": true,
        "amenities": true
      },
      "property_features": {
        "bedrooms": "exact_match",
        "bathrooms": "range_match",
        "square_footage": "range_match"
      }
    },
    "market_analysis": {
      "comparable_sales": true,
      "price_trends": true,
      "days_on_market": true,
      "inventory_levels": true
    }
  }
}
```

### Legal Practice Customization

```json
{
  "legal_customization": {
    "case_assessment": {
      "practice_areas": {
        "personal_injury": {
          "qualification_questions": [
            "When did the accident occur?",
            "What type of injuries did you sustain?",
            "Have you received medical treatment?"
          ],
          "success_factors": ["clear_liability", "significant_damages", "recent_incident"]
        },
        "family_law": {
          "qualification_questions": [
            "What type of family law matter do you need help with?",
            "Are there children involved?",
            "What is your timeline?"
          ],
          "success_factors": ["complexity", "asset_value", "urgency"]
        }
      }
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Business Rules

```json
{
  "custom_business_rules": {
    "lead_qualification": {
      "minimum_budget": {
        "real_estate": 200000,
        "legal": 5000,
        "ecommerce": 100
      },
      "geographic_restrictions": {
        "enabled": true,
        "allowed_regions": ["CA", "NY", "TX"],
        "fallback_action": "refer_to_partner"
      },
      "time_based_rules": {
        "business_hours_only": true,
        "after_hours_action": "schedule_callback"
      }
    },
    "conversation_limits": {
      "max_messages_per_session": 50,
      "session_timeout": 3600,
      "daily_message_limit": 200
    }
  }
}
```

### Performance Optimization

```json
{
  "performance": {
    "caching": {
      "session_cache": {
        "enabled": true,
        "ttl": 3600,
        "storage": "redis"
      },
      "response_cache": {
        "enabled": true,
        "ttl": 300,
        "storage": "memory"
      }
    },
    "rate_limiting": {
      "requests_per_minute": 60,
      "burst_limit": 10,
      "penalty": "temporary_ban"
    }
  }
}
```

## 📋 Implementation Checklist

### Configuration Steps

- [ ] **Lead Scoring Setup**
  - [ ] Configure industry-specific weights
  - [ ] Set qualification thresholds
  - [ ] Test scoring algorithms

- [ ] **Intent Detection**
  - [ ] Define custom intents
  - [ ] Set confidence thresholds
  - [ ] Configure fallback responses

- [ ] **Conversation Workflows**
  - [ ] Define conversation stages
  - [ ] Set transition triggers
  - [ ] Configure response templates

- [ ] **Appointment Scheduling**
  - [ ] Set business hours
  - [ ] Configure appointment types
  - [ ] Set booking rules

- [ ] **Lead Routing**
  - [ ] Define assignment rules
  - [ ] Set escalation triggers
  - [ ] Configure priority levels

- [ ] **Integrations**
  - [ ] Configure CRM connection
  - [ ] Set up email automation
  - [ ] Test webhook endpoints

- [ ] **Analytics**
  - [ ] Define custom metrics
  - [ ] Set up tracking events
  - [ ] Configure reporting

### Testing & Validation

- [ ] **Lead Scoring Accuracy**
  - [ ] Test with sample conversations
  - [ ] Validate scoring logic
  - [ ] Adjust weights as needed

- [ ] **Intent Detection**
  - [ ] Test intent recognition
  - [ ] Validate confidence scores
  - [ ] Refine keyword patterns

- [ ] **Workflow Testing**
  - [ ] Test conversation flows
  - [ ] Validate transitions
  - [ ] Check response quality

- [ ] **Integration Testing**
  - [ ] Test CRM sync
  - [ ] Validate email sending
  - [ ] Check webhook delivery

---

This business logic configuration provides the foundation for a sophisticated, enterprise-grade AI chatbot that can handle complex business scenarios and deliver measurable ROI. Customize these rules to match your specific business requirements and industry needs.
