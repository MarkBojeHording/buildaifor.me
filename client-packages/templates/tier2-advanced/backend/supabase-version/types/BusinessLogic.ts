export interface ClientConfig {
  client_id: string
  business_name: string
  industry: string
  business_type?: string
  contact: {
    phone: string
    email?: string
    website?: string
    address?: string
  }
  ai_features?: {
    lead_scoring?: boolean
    case_assessment?: boolean
    dynamic_responses?: boolean
    intent_detection?: boolean
    followup_generation?: boolean
    appointment_scheduling?: boolean
    file_upload?: boolean
    crm_integration?: boolean
  }
  lead_capture?: {
    enabled?: boolean
    required_fields?: string[]
    optional_fields?: string[]
    case_types?: string[]
    product_categories?: string[]
    budget_ranges?: string[]
    qualification_thresholds?: {
      hot_lead?: number
      warm_lead?: number
      cold_lead?: number
    }
  }
  practice_areas?: Record<string, any>
  lead_routing?: {
    high_value_threshold?: number
    senior_attorney_threshold?: number
    urgent_escalation_threshold?: number
    attorney_specializations?: Record<string, string[]>
    auto_assignment?: boolean
    escalation_rules?: EscalationRule[]
  }
  appointment_scheduling?: {
    enabled?: boolean
    calendar_integration?: 'calendly' | 'acuity' | 'builtin'
    available_hours?: {
      monday?: { start: string; end: string }
      tuesday?: { start: string; end: string }
      wednesday?: { start: string; end: string }
      thursday?: { start: string; end: string }
      friday?: { start: string; end: string }
      saturday?: { start: string; end: string }
      sunday?: { start: string; end: string }
    }
    appointment_types?: AppointmentType[]
    confirmation_workflow?: boolean
    reminder_system?: boolean
  }
  integrations?: {
    crm?: {
      enabled?: boolean
      provider?: 'hubspot' | 'salesforce' | 'pipedrive'
      api_key?: string
      auto_create_leads?: boolean
      sync_activities?: boolean
    }
    payment?: {
      enabled?: boolean
      provider?: 'stripe' | 'paypal' | 'square'
      api_key?: string
      consultation_fees?: Record<string, number>
    }
    email?: {
      enabled?: boolean
      provider?: 'sendgrid' | 'mailgun' | 'aws_ses'
      api_key?: string
      templates?: EmailTemplate[]
    }
  }
  fallback_response?: string
  responses: Record<string, string>
  quick_replies?: string[]
  theme?: Record<string, string>
  analytics?: {
    enabled?: boolean
    tracking_events?: string[]
    conversion_goals?: ConversionGoal[]
  }
}

export interface EscalationRule {
  condition: string
  threshold: number
  action: 'notify_manager' | 'assign_senior' | 'urgent_contact' | 'custom'
  custom_action?: string
}

export interface AppointmentType {
  name: string
  duration: number // minutes
  price?: number
  description?: string
  required_fields?: string[]
  available_for?: string[] // lead qualification levels
}

export interface EmailTemplate {
  name: string
  subject: string
  body: string
  triggers: string[] // when to send
  variables?: string[] // dynamic content
}

export interface ConversionGoal {
  name: string
  type: 'appointment' | 'contact_form' | 'purchase' | 'download'
  value?: number
  tracking_code?: string
}

export interface LeadScoringConfig {
  weights: {
    budget?: number
    timeline?: number
    urgency?: number
    location?: number
    engagement?: number
    qualification?: number
  }
  thresholds: {
    hot_lead: number
    warm_lead: number
    cold_lead: number
  }
  industry_specific?: Record<string, any>
}

export interface IntentDetectionConfig {
  confidence_threshold: number
  multi_intent_support: boolean
  fallback_intent: string
  industry_patterns?: Record<string, string[]>
  custom_patterns?: Record<string, string[]>
}

export interface SessionConfig {
  timeout_minutes: number
  max_messages: number
  auto_cleanup: boolean
  persistence: 'memory' | 'database' | 'redis'
  backup_frequency: number // minutes
}
