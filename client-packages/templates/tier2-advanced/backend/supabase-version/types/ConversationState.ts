export interface Message {
  text: string
  timestamp: string
  sender: 'user' | 'bot'
}

export interface UserProfile {
  name?: string
  email?: string
  phone?: string
  budget?: string
  preferences?: string[]
  urgency?: string
  location?: string
  timeline?: string
  propertyType?: string
  caseType?: string
  productCategory?: string
}

export interface LeadData {
  budgetRange?: string
  timeline?: string
  location?: string
  propertyType?: string
  caseSeverity?: string
  practiceArea?: string
  purchaseIntent?: string
  urgency?: string
  contactPreference?: string
  additionalNotes?: string
}

export interface ConversationState {
  sessionId: string
  clientId: string
  conversationHistory: Message[]
  leadScore: number
  detectedIntents: string[]
  userProfile: UserProfile
  lastActivity: Date
  conversationStage: string
  leadData: LeadData
  messageCount: number
  leadQualificationLevel: 'cold' | 'warm' | 'hot'
  nextAction?: string
  followUpRequired?: boolean
  appointmentScheduled?: boolean
  documentsUploaded?: string[]
  customFields?: Record<string, any>
}

export interface ChatRequest {
  message: string
  client_id?: string
  clientId?: string
  session_id?: string
  sessionId?: string
  conversationId?: string
  userProfile?: Partial<UserProfile>
  leadData?: Partial<LeadData>
}

export interface ChatResponse {
  response: string
  session_id?: string
  lead_score?: number
  intent?: string
  confidence?: number
  next_steps?: string[]
  conversationStage?: string
  leadQualificationLevel?: 'cold' | 'warm' | 'hot'
  aiData?: {
    lead_score: number
    intent: string
    confidence: number
    reasoning: string
    suggestedActions?: string[]
    followUpQuestions?: string[]
  }
  userProfile?: Partial<UserProfile>
  leadData?: Partial<LeadData>
}
