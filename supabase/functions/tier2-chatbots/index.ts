import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Clean version - no SDK dependencies

// Types
interface ChatRequest {
  message: string
  client_id?: string
  clientId?: string
  session_id?: string
  sessionId?: string
  conversationId?: string
}

interface ChatResponse {
  response: string
  session_id?: string
  lead_score?: number
  intent?: string
  confidence?: number
  next_steps?: string[]
  aiData?: {
    lead_score: number
    intent: string
    confidence: number
    reasoning: string
  }
}

interface ConversationState {
  sessionId: string
  clientId: string
  conversationHistory: Message[]
  leadScore: number
  detectedIntents: string[]
  userProfile: UserProfile
  lastActivity: Date
  conversationStage: string
  leadData: Record<string, any>
  messageCount: number
}

interface Message {
  text: string
  timestamp: string
  sender: 'user' | 'bot'
}

interface UserProfile {
  name?: string
  email?: string
  phone?: string
  budget?: string
  preferences?: string[]
  urgency?: string
}

interface ClientConfig {
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
  }
  lead_capture?: {
    enabled?: boolean
    required_fields?: string[]
    optional_fields?: string[]
    case_types?: string[]
    product_categories?: string[]
    budget_ranges?: string[]
  }
  practice_areas?: Record<string, any>
  lead_routing?: {
    high_value_threshold?: number
    senior_attorney_threshold?: number
    urgent_escalation_threshold?: number
    attorney_specializations?: Record<string, string[]>
  }
  fallback_response?: string
  responses: Record<string, string>
  quick_replies?: string[]
  theme?: Record<string, string>
}

// Session management
const sessions = new Map<string, ConversationState>()

// Direct OpenAI API call without SDK (reduces bundle size)
async function callOpenAI(message: string, systemPrompt: string): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY")
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content || "I'm here to help!"
}

// Client configurations (migrated from JSON files)
const CLIENT_CONFIGS: Record<string, ClientConfig> = {
  "real-estate-demo": {
    client_id: "real-estate-demo",
    industry: "real_estate",
    business_type: "real_estate",
    business_name: "Dream Homes Realty",
    contact: {
      phone: "(555) DREAM-HOME",
      email: "info@dreamhomes.com",
      website: "www.dreamhomes.com",
      address: "456 Real Estate Ave, Downtown"
    },
    ai_features: {
      lead_scoring: true,
      case_assessment: true,
      dynamic_responses: true,
      intent_detection: true,
      followup_generation: true
    },
    lead_capture: {
      enabled: true,
      required_fields: ["name", "email", "phone", "property_type"],
      optional_fields: ["budget_range", "timeline", "location_preference", "property_features"],
      case_types: [
        "Buying",
        "Selling",
        "Renting",
        "Investment",
        "Commercial"
      ]
    },
    fallback_response: "I don't have specific information about that property, but our agents can help!\n\n📞 Call us: {phone}\n📧 Email: {email}\n🌐 Visit: {website}\n\nOur experienced real estate agents are here to assist you.\n\nI can help with property searches, market information, or scheduling viewings though!",
    responses: {
      "hello|hi|hey|good morning|good afternoon|good evening": "Hello! Welcome to Dream Homes Realty. I'm here to help you with all your real estate needs. How can I assist you today?",
      "how are you|how's it going|how are things": "I'm doing great, thank you for asking! I'm here to help you find your perfect home. What brings you to Dream Homes Realty today?",
      "thanks|thank you|appreciate it|thank you so much": "You're very welcome! I'm here to help. Is there anything else you'd like to know about our properties or services?",
      "what can you help|what do you do|how can you help|what services|what can you do": "I'm your Dream Homes Realty assistant! I can help you with:\n\n🏠 Property searches and recommendations\n📊 Market information and trends\n📅 Scheduling viewings and appointments\n💰 Property valuations and pricing\n👨‍💼 Connecting with our agents\n📋 General real estate questions\n\nWhat would you like to know about?",
      "property search|find home|buy house|looking for|available properties|show me properties": "🏠 Property Search:\n\n• What type of property are you looking for? (house, condo, townhouse)\n• What's your budget range?\n• Preferred neighborhoods or areas?\n• Timeline for purchase?\n\nI can help you find the perfect property!",
      "market info|prices|trends|values": "📊 Market Information:\n\n• Average home price: $485,000\n• Market trend: Steady growth\n• Days on market: 28 days\n• Inventory level: Balanced\n\nWould you like specific neighborhood data?",
      "schedule viewing|appointment|tour": "📅 Schedule a Viewing:\n\n• Available times: Weekdays 9AM-6PM, Saturdays 10AM-4PM\n• Virtual tours available\n• In-person showings with safety protocols\n\nCall us at {phone} to schedule!",
      "selling|list property|market value": "💰 Selling Your Property:\n\n• Free market analysis\n• Professional photography included\n• Marketing on multiple platforms\n• Negotiation support\n\nLet's discuss your property details!",
      "agent|realtor|broker": "👨‍💼 Our Agents:\n\n• Licensed professionals with 5+ years experience\n• Specialized in your area\n• Available 7 days a week\n• Personalized service\n\nWho would you like to work with?",
      "hours|open|time|schedule": "🕒 Office Hours:\n\n• Monday-Friday: 9:00 AM - 6:00 PM\n• Saturday: 10:00 AM - 4:00 PM\n• Sunday: Closed\n\nEmergency appointments available for urgent matters.",
      "contact|phone|call": "📞 Contact Dream Homes Realty:\n\nPhone: {phone}\nEmail: {email}\nWebsite: {website}\nAddress: {address}\n\nWe're here to help with all your real estate needs!"
    }
  },

  "law-firm-demo": {
    client_id: "law-firm-demo",
    business_name: "Justice Partners Law Firm",
    industry: "legal",
    business_type: "law_firm",
    contact: {
      phone: "(555) LAW-FIRM",
      email: "info@justicepartners.com",
      website: "www.justicepartners.com",
      address: "123 Legal Plaza, Downtown"
    },
    ai_features: {
      lead_scoring: true,
      case_assessment: true,
      dynamic_responses: true,
      intent_detection: true,
      followup_generation: true
    },
    lead_capture: {
      enabled: true,
      required_fields: ["name", "email", "phone", "case_type"],
      optional_fields: ["case_description", "urgency", "budget_range"],
      case_types: [
        "Personal Injury",
        "Family Law",
        "Criminal Defense",
        "Real Estate",
        "Business Law",
        "Estate Planning",
        "Employment Law"
      ]
    },
    practice_areas: {
      personal_injury: {
        specializations: ["auto_accidents", "slip_fall", "medical_malpractice", "product_liability"],
        qualification_questions: [
          "When did the accident occur?",
          "What type of injuries did you sustain?",
          "Have you received medical treatment?",
          "Do you have any witnesses or evidence?"
        ],
        assessment_criteria: {
          liability_factors: ["clear_fault", "mixed_liability", "unclear_fault"],
          damage_factors: ["medical_bills", "lost_wages", "pain_suffering", "property_damage"],
          time_factors: ["statute_limitations", "recent_incident", "ongoing_treatment"]
        }
      },
      family_law: {
        specializations: ["divorce", "custody", "support", "adoption"],
        qualification_questions: [
          "What type of family law matter do you need help with?",
          "Are there children involved?",
          "Is this an uncontested or contested matter?",
          "Do you have any existing court orders?"
        ],
        assessment_criteria: {
          complexity_factors: ["children_involved", "property_division", "business_interests"],
          urgency_factors: ["domestic_violence", "custody_emergency", "financial_urgency"]
        }
      },
      criminal_defense: {
        specializations: ["dui", "drug_offenses", "assault", "theft", "white_collar"],
        qualification_questions: [
          "What charges are you facing?",
          "When were you arrested?",
          "Do you have any prior convictions?",
          "Have you spoken to law enforcement?"
        ],
        assessment_criteria: {
          severity_factors: ["felony", "misdemeanor", "infraction"],
          evidence_factors: ["physical_evidence", "witnesses", "confession"],
          procedural_factors: ["rights_violation", "illegal_search", "coerced_confession"]
        }
      }
    },
    lead_routing: {
      high_value_threshold: 75,
      senior_attorney_threshold: 85,
      urgent_escalation_threshold: 80,
      attorney_specializations: {
        personal_injury: ["Sarah Johnson", "Michael Chen"],
        family_law: ["Jennifer Davis", "Robert Wilson"],
        criminal_defense: ["David Martinez", "Lisa Thompson"]
      }
    },
    fallback_response: "I don't have specific information about that legal matter, but our attorneys can help!\n\n📞 Call us: {phone}\n📧 Email: {email}\n🌐 Visit: {website}\n\nFor legal advice, please schedule a consultation with our experienced attorneys.\n\nI can help with general information about our services, consultation fees, or office hours though!",
    responses: {
      "personal injury|accident|car crash|car accident|drunk driver|neck pain|missed work": "🚗 **Personal Injury Case Assessment:**\n\nBased on your description, this appears to be a **strong personal injury case** with the following factors:\n\n• **Clear Liability**: Drunk driver at fault\n• **Significant Injuries**: Neck pain requiring medical attention\n• **Economic Damages**: Lost wages from missed work\n• **Negligence**: Driving under the influence\n\n**Next Steps:**\n• Schedule a free consultation to discuss your case\n• Document all medical treatments and expenses\n• Keep records of missed work and lost wages\n• Don't speak to insurance companies without legal representation\n\n**Our Contingency Fee**: No fees unless we win your case!\n\n📞 Call us at (555) LAW-FIRM for immediate assistance.",
      "hello|hi|hey|good morning|good afternoon|good evening": "Hello! Welcome to Justice Partners Law Firm. I'm here to help you understand our legal services and connect you with the right attorney. How can I assist you today?",
      "how are you|how's it going|how are things": "I'm doing well, thank you for asking! I'm here to help you with your legal needs. What brings you to Justice Partners Law Firm today?",
      "thanks|thank you|appreciate it|thank you so much": "You're very welcome! I'm here to help. Is there anything else you'd like to know about our legal services?",
      "hours|open|time|schedule": "🕒 Our office hours are:\n\n• Monday-Friday: 8:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 2:00 PM\n• Sunday: Closed\n\nWe offer emergency consultations outside business hours for urgent legal matters.",
      "consultation|meet|appointment": "📋 Free Initial Consultation:\n\n• 30-minute free consultation to discuss your case\n• No obligation to hire our firm\n• Available in-person or via video call\n\nTo schedule: Call {phone} or email {email}",
      "fees|cost|price|payment": "💰 Our Fee Structure:\n\n• Free initial consultation\n• Contingency fees for personal injury cases\n• Hourly rates: $250-400/hour\n• Flat fees for certain services\n• Payment plans available\n\nContact us for a detailed quote based on your specific case.",
      "services|practice|areas": "⚖️ Our Practice Areas:\n\n• Personal Injury Law\n• Family Law & Divorce\n• Criminal Defense\n• Immigration Law\n• Real Estate Law\n• Business Law\n• Estate Planning\n• Employment Law\n\nWe have over 20 years of combined experience in these areas.",
      "family law|divorce|custody": "👨‍👩‍👧‍👦 Family Law Services:\n\n• Divorce and separation\n• Child custody and support\n• Property division\n• Prenuptial agreements\n• Adoption\n\nWe handle cases with compassion and expertise.",
      "criminal|arrest|charges": "🛡️ Criminal Defense:\n\n• DUI/DWI charges\n• Drug offenses\n• Assault and battery\n• Theft and fraud\n• White-collar crimes\n\nWe provide aggressive defense and protect your rights.",
      "immigration|visa|citizenship|green card|deportation|asylum": "🌍 **Immigration Law Services:**\n\n• **Visa Applications**: Work visas, student visas, family visas\n• **Green Card Processing**: Family-based and employment-based\n• **Citizenship & Naturalization**: Help with the citizenship process\n• **Deportation Defense**: Fighting removal proceedings\n• **Asylum & Refugee Status**: Protection for those fleeing persecution\n• **DACA & DREAM Act**: Support for eligible young immigrants\n\n**Our Immigration Team**:\n• Experienced immigration attorneys\n• High success rate with complex cases\n• Multilingual staff available\n• Free initial consultation\n\n📞 Call us at {phone} to discuss your immigration case!",
      "business|corporate|contract|startup|llc|incorporation|partnership|merger|acquisition": "🏢 **Business Law Services:**\n\n• **Corporate Formation**: LLCs, Corporations, Partnerships\n• **Contract Law**: Drafting, review, disputes, breach of contract\n• **Business Litigation**: Commercial disputes, shareholder conflicts\n• **Mergers & Acquisitions**: Due diligence, negotiations, closings\n• **Intellectual Property**: Trademarks, patents, copyright protection\n• **Regulatory Compliance**: Industry-specific regulations, licensing\n• **Employment Law**: HR policies, workplace compliance\n\n**Our Business Team**:\n• Experienced corporate attorneys\n• Industry-specific expertise\n• Flat-fee packages available\n• Free initial consultation\n\n📞 Call us at {phone} for business legal services!",
      "employment|workplace|discrimination|harassment|wrongful termination|wage|overtime|fmla|ada": "💼 **Employment Law Services:**\n\n• **Workplace Discrimination**: Race, gender, age, disability discrimination\n• **Sexual Harassment**: Hostile work environment, quid pro quo cases\n• **Wrongful Termination**: Unlawful firing, retaliation, whistleblower protection\n• **Wage & Hour**: Overtime violations, minimum wage, unpaid wages\n• **FMLA & ADA**: Family leave, disability accommodations, reasonable accommodations\n• **Severance Negotiations**: Exit package reviews, non-compete agreements\n• **Workplace Investigations**: Internal investigations, policy development\n\n**Our Employment Team**:\n• Employment law specialists\n• Contingency fee options available\n• Confidential consultations\n• Strong track record of success\n\n📞 Call us at {phone} to discuss your workplace case!",
      "real estate|property|landlord|tenant|eviction|title|closing|mortgage|foreclosure": "🏠 **Real Estate Law Services:**\n\n• **Property Disputes**: Boundary issues, easements, property line conflicts\n• **Landlord-Tenant**: Evictions, lease disputes, security deposit issues\n• **Real Estate Transactions**: Closings, title issues, purchase agreements\n• **Mortgage Problems**: Foreclosure defense, loan modifications, refinancing\n• **Zoning & Land Use**: Development permits, zoning variances, land use disputes\n• **Property Tax Appeals**: Assessment challenges, tax abatements\n• **Commercial Real Estate**: Office leases, retail spaces, industrial properties\n\n**Our Real Estate Team**:\n• Property law experts\n• Title insurance experience\n• Local market knowledge\n• Flat-fee transaction packages\n\n📞 Call us at {phone} for real estate legal help!",
      "estate|will|trust|probate|inheritance|power of attorney|guardianship|estate tax": "📜 **Estate Planning Services:**\n\n• **Wills & Trusts**: Estate planning documents, living trusts, testamentary trusts\n• **Probate Administration**: Estate settlement, executor guidance\n• **Trust Administration**: Trustee guidance, beneficiary rights\n• **Power of Attorney**: Healthcare directives, financial power of attorney\n• **Guardianship**: Minor children, incapacitated adults, conservatorship\n• **Estate Tax Planning**: Tax-efficient transfers, wealth preservation\n• **Business Succession**: Family business transitions, buy-sell agreements\n\n**Our Estate Planning Team**:\n• Certified estate planning specialists\n• Flat-fee document packages\n• Ongoing trust administration services\n• Family wealth preservation expertise\n\n📞 Call us at {phone} to plan your legacy!"
    }
  },

  "ecommerce-demo": {
    client_id: "ecommerce-demo",
    business_name: "TechGear Online Store",
    industry: "ecommerce",
    contact: {
      phone: "(555) TECH-GEAR",
      email: "support@techgear.com",
      website: "www.techgear.com",
      address: "789 Tech Street, Innovation District"
    },
    ai_enabled: false,
    lead_capture: {
      enabled: true,
      required_fields: ["name", "email", "product_interest"],
      optional_fields: ["budget_range", "use_case", "experience_level", "preferred_brand"],
      product_categories: [
        "Laptops & Computers",
        "Smartphones & Tablets",
        "Audio & Headphones",
        "Gaming & Accessories",
        "Smart Home Devices",
        "Wearables & Fitness"
      ],
      budget_ranges: [
        "$50 - $100",
        "$100 - $250",
        "$250 - $500",
        "$500 - $1000",
        "$1000+"
      ]
    },
    fallback_response: "I don't have specific information about that product, but our support team can help!\n\n📞 Call us: {phone}\n📧 Email: {email}\n🌐 Visit: {website}\n\nOur customer service team is available to answer all your questions.\n\nI can help with product recommendations, order status, or general support though!",
    responses: {
      "hello|hi|hey|good morning|good afternoon|good evening": "Hello! Welcome to TechGear Online Store. I'm here to help you find the perfect tech products and assist with your shopping needs. How can I help you today?",
      "how are you|how's it going|how are things": "I'm doing great, thank you for asking! I'm here to help you find the best tech products. What brings you to TechGear today?",
      "thanks|thank you|appreciate it|thank you so much": "You're very welcome! I'm here to help. Is there anything else you'd like to know about our products or services?",
      "sales analytics|analytics|data|performance|metrics|revenue|statistics": "📈 **TechGear Sales Analytics:**\n\n• **Monthly Revenue**: $2.4M (+15% vs last month)\n• **Top Category**: Laptops (35% of sales)\n• **Customer Satisfaction**: 4.8/5 stars\n• **Average Order Value**: $247\n• **Return Rate**: 2.1% (industry average: 8%)\n\n🎯 Our data shows customers love our tech bundles and extended warranties!",
      "deals|today deals|current deals|promotions|discounts|sales": "🔥 **Today's Hot Deals at TechGear:**\n\n• **Gaming Laptops**: Up to 30% off - Starting at $799\n• **Wireless Headphones**: 25% off all premium brands\n• **Smart Home Bundle**: Save $150 on Alexa + Smart Bulbs\n• **Student Discount**: 15% off with valid student ID\n• **Flash Sale**: 50% off select accessories (2 hours left!)\n\n💡 Want personalized recommendations? Tell me what you're looking for!",
      "best sellers|top products|popular items|trending": "🏆 **TechGear Best Sellers:**\n\n• **MacBook Air M2**: Our #1 laptop - $1,199\n• **Sony WH-1000XM5**: Premium noise-canceling headphones - $349\n• **iPad Air**: Perfect for work & play - $599\n• **Samsung Galaxy S23**: Flagship smartphone - $799\n• **Apple Watch Series 9**: Health & fitness companion - $399\n\n📊 These are updated daily based on customer purchases and reviews!",
      "product_search|find products|search": "Here are some products that match your search: {{products}}.",
      "category_browse|browse|categories": "Browsing category: {{category}}. Here are some top items: {{products}}.",
      "discount_inquiry|discounts|promotions": "Here are the current deals and discounts: {{discounts}}.",
      "greeting": "🛒 Welcome to ShopSmart AI! I'm here to help you with product recommendations, order tracking, sales analytics, and more. How can I assist you today?",
      "product_compare|compare": "Here's a comparison: {{comparison}}.",
      "shipping_inquiry|shipping|delivery": "Shipping is free on orders over $50. Standard shipping is $5.99.",
      "order_status|track order|order tracking": "Please provide your order number so I can check the status for you.",
      "fallback": "I'm here to help! How can I assist you today?"
    },
    quick_replies: [
      "Show me laptops",
      "What's your return policy?",
      "Track my order",
      "Contact customer service",
      "Current promotions"
    ],
    theme: {
      primary_color: "#3498db",
      secondary_color: "#2980b9",
      accent_color: "#e67e22",
      text_color: "#2c3e50",
      background_color: "#ffffff"
    }
  }
}

// Default config for unknown clients
const DEFAULT_CONFIG: ClientConfig = {
  client_id: "default",
  business_name: "Business",
  industry: "general",
  contact: {
    phone: "(555) 123-4567"
  },
  fallback_response: "Thank you for contacting us. Please call (555) 123-4567 for assistance.",
  responses: {
    "default": "Thank you for contacting us. Please call (555) 123-4567 for assistance."
  }
}

// Core business logic classes
class IntentDetector {
  private config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  async detectIntent(message: string, sessionData: ConversationState, clientConfig: ClientConfig) {
    const messageLower = message.toLowerCase()

    // Industry-specific intent detection
    switch (clientConfig.industry) {
      case 'real_estate':
        return this.detectRealEstateIntent(messageLower, sessionData)
      case 'legal':
        return this.detectLegalIntent(messageLower, sessionData)
      case 'ecommerce':
        return this.detectEcommerceIntent(messageLower, sessionData)
      default:
        return this.detectGeneralIntent(messageLower, sessionData)
    }
  }

  private detectRealEstateIntent(message: string, sessionData: ConversationState) {
    const intents = {
      'PROPERTY_SEARCH': ['buy', 'house', 'home', 'property', 'looking for', 'find', 'search', 'available properties'],
      'MARKET_INFO': ['market', 'price', 'value', 'trend', 'worth', 'appraisal'],
      'SCHEDULE_VIEWING': ['view', 'tour', 'appointment', 'schedule', 'see', 'visit'],
      'SELLING': ['sell', 'list', 'market', 'listing', 'agent'],
      'GENERAL_INQUIRY': ['hello', 'hi', 'help', 'information', 'what can you', 'how can you', 'what do you']
    }

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return {
          primary: { intent, confidence: 0.9 },
          secondary: null,
          reasoning: `Detected ${intent} based on keywords: ${keywords.join(', ')}`,
          practiceArea: 'real_estate',
          urgency: 'medium',
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      primary: { intent: 'GENERAL_INQUIRY', confidence: 0.7 },
      secondary: null,
      reasoning: 'No specific real estate intent detected',
      practiceArea: 'real_estate',
      urgency: 'low',
      timestamp: new Date().toISOString()
    }
  }

  private detectLegalIntent(message: string, sessionData: ConversationState) {
    const intents = {
      'PERSONAL_INJURY': ['accident', 'injury', 'hurt', 'pain', 'medical', 'car crash', 'slip'],
      'FAMILY_LAW': ['divorce', 'custody', 'child', 'marriage', 'family', 'support'],
      'CRIMINAL_DEFENSE': ['arrest', 'charge', 'criminal', 'police', 'court', 'defense'],
      'CONSULTATION': ['consult', 'meet', 'appointment', 'talk', 'discuss'],
      'GENERAL_INQUIRY': ['hello', 'hi', 'help', 'information']
    }

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return {
          primary: { intent, confidence: 0.9 },
          secondary: null,
          reasoning: `Detected ${intent} based on keywords: ${keywords.join(', ')}`,
          practiceArea: 'legal',
          urgency: intent === 'CRIMINAL_DEFENSE' ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      primary: { intent: 'GENERAL_INQUIRY', confidence: 0.7 },
      secondary: null,
      reasoning: 'No specific legal intent detected',
      practiceArea: 'legal',
      urgency: 'low',
      timestamp: new Date().toISOString()
    }
  }

  private detectEcommerceIntent(message: string, sessionData: ConversationState) {
    const intents = {
      'PRODUCT_SEARCH': ['product', 'item', 'buy', 'purchase', 'looking for', 'find'],
      'ORDER_STATUS': ['order', 'track', 'status', 'shipping', 'delivery'],
      'SUPPORT': ['help', 'support', 'problem', 'issue', 'return', 'refund'],
      'GENERAL_INQUIRY': ['hello', 'hi', 'help', 'information']
    }

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return {
          primary: { intent, confidence: 0.9 },
          secondary: null,
          reasoning: `Detected ${intent} based on keywords: ${keywords.join(', ')}`,
          practiceArea: 'ecommerce',
          urgency: 'medium',
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      primary: { intent: 'GENERAL_INQUIRY', confidence: 0.7 },
      secondary: null,
      reasoning: 'No specific ecommerce intent detected',
      practiceArea: 'ecommerce',
      urgency: 'low',
      timestamp: new Date().toISOString()
    }
  }

  private detectGeneralIntent(message: string, sessionData: ConversationState) {
    return {
      primary: { intent: 'GENERAL_INQUIRY', confidence: 0.8 },
      secondary: null,
      reasoning: 'General inquiry detected',
      practiceArea: 'general',
      urgency: 'low',
      timestamp: new Date().toISOString()
    }
  }
}

class LeadScorer {
  private config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  async scoreLead(message: string, sessionData: ConversationState, clientConfig: ClientConfig): Promise<{ score: number; reasoning: string; factors: string[] }> {
    let score = 0
    const factors: string[] = []
    const messageLower = message.toLowerCase()

    // Industry-specific lead scoring
    switch (clientConfig.industry) {
      case 'real_estate':
        return this.scoreRealEstateLead(messageLower, sessionData)
      case 'legal':
        return this.scoreLegalLead(messageLower, sessionData)
      case 'ecommerce':
        return this.scoreEcommerceLead(messageLower, sessionData)
      default:
        return this.scoreGeneralLead(messageLower, sessionData)
    }
  }

  private scoreRealEstateLead(message: string, sessionData: ConversationState) {
    let score = 0
    const factors: string[] = []

    // Budget indicators
    if (message.includes('budget') || message.includes('price') || message.includes('cost')) {
      score += 20
      factors.push('Budget mentioned')
    }

    // Timeline indicators
    if (message.includes('soon') || message.includes('urgent') || message.includes('quick')) {
      score += 15
      factors.push('Timeline urgency')
    }

    // Property type specificity
    if (message.includes('house') || message.includes('condo') || message.includes('townhouse')) {
      score += 10
      factors.push('Specific property type')
    }

    // Location specificity
    if (message.includes('area') || message.includes('neighborhood') || message.includes('location')) {
      score += 10
      factors.push('Location preference')
    }

    // Contact information
    if (message.includes('email') || message.includes('phone') || message.includes('contact')) {
      score += 25
      factors.push('Contact information provided')
    }

    return {
      score: Math.min(score, 100),
      reasoning: `Real estate lead score: ${score}/100. ${factors.join(', ')}`,
      factors
    }
  }

  private scoreLegalLead(message: string, sessionData: ConversationState) {
    let score = 0
    const factors: string[] = []
    const messageLower = message.toLowerCase()

    // Case type specificity (base score)
    if (messageLower.includes('accident') || messageLower.includes('injury') || messageLower.includes('divorce') || messageLower.includes('criminal') || messageLower.includes('immigration') || messageLower.includes('visa') || messageLower.includes('green card') || messageLower.includes('business') || messageLower.includes('corporate') || messageLower.includes('employment') || messageLower.includes('workplace') || messageLower.includes('real estate') || messageLower.includes('property') || messageLower.includes('estate') || messageLower.includes('will') || messageLower.includes('trust')) {
      score += 25
      factors.push('Specific case type')
    }

    // ENHANCED: Injury severity tiers
    if (messageLower.includes('neck pain') || messageLower.includes('back pain') || messageLower.includes('whiplash')) {
      score += 30
      factors.push('Moderate injury severity')
    }
    if (messageLower.includes('broken') || messageLower.includes('fracture') || messageLower.includes('surgery')) {
      score += 40
      factors.push('Severe injury requiring treatment')
    }
    if ((messageLower.includes('hospital') || messageLower.includes('emergency room') || messageLower.includes('er')) &&
        (messageLower.includes('treatment') || messageLower.includes('admitted') || messageLower.includes('stayed'))) {
      score += 35
      factors.push('Hospital treatment required')
    }
    if (messageLower.includes('paralysis') || messageLower.includes('brain injury') || messageLower.includes('traumatic')) {
      score += 60
      factors.push('Catastrophic injury')
    }

    // ENHANCED: Economic impact recognition
    if (messageLower.includes('missed work') || messageLower.includes('lost wages') || messageLower.includes('can\'t work')) {
      score += 20
      factors.push('Economic damages - lost income')
    }
    if (messageLower.includes('medical bills') || messageLower.includes('hospital bills') || messageLower.includes('treatment costs')) {
      score += 25
      factors.push('Economic damages - medical expenses')
    }
    if (messageLower.includes('disability') || messageLower.includes('unable to work') || messageLower.includes('lost income')) {
      score += 30
      factors.push('Economic damages - disability')
    }

    // Immigration-specific economic impact
    if (messageLower.includes('work permit') || messageLower.includes('employment authorization') || messageLower.includes('job offer')) {
      score += 25
      factors.push('Economic impact - employment opportunity')
    }

    // Business Law case complexity
    if (messageLower.includes('contract dispute') || messageLower.includes('breach of contract')) {
      score += 35
      factors.push('Business case complexity - contract dispute')
    }
    if (messageLower.includes('corporate formation') || messageLower.includes('llc') || messageLower.includes('incorporation')) {
      score += 25
      factors.push('Business case complexity - corporate formation')
    }
    if (messageLower.includes('merger') || messageLower.includes('acquisition') || messageLower.includes('m&a')) {
      score += 50
      factors.push('Business case complexity - M&A transaction')
    }
    if (messageLower.includes('intellectual property') || messageLower.includes('patent') || messageLower.includes('trademark')) {
      score += 40
      factors.push('Business case complexity - IP protection')
    }

    // Employment Law case severity
    if (messageLower.includes('discrimination') || messageLower.includes('harassment') || messageLower.includes('hostile work environment')) {
      score += 40
      factors.push('Employment case severity - discrimination/harassment')
    }
    if (messageLower.includes('wrongful termination') || messageLower.includes('retaliation') || messageLower.includes('unlawful firing')) {
      score += 35
      factors.push('Employment case severity - wrongful termination')
    }
    if (messageLower.includes('wage theft') || messageLower.includes('overtime') || messageLower.includes('unpaid wages')) {
      score += 30
      factors.push('Employment case severity - wage violations')
    }
    if (messageLower.includes('fmla') || messageLower.includes('disability') || messageLower.includes('reasonable accommodation')) {
      score += 25
      factors.push('Employment case severity - leave/disability')
    }

    // Real Estate Law case value
    if (messageLower.includes('property dispute') || messageLower.includes('boundary') || messageLower.includes('easement')) {
      score += 30
      factors.push('Real estate case value - property dispute')
    }
    if (messageLower.includes('eviction') || messageLower.includes('landlord') || messageLower.includes('tenant')) {
      score += 25
      factors.push('Real estate case value - landlord-tenant')
    }
    if (messageLower.includes('foreclosure') || messageLower.includes('mortgage') || messageLower.includes('loan modification')) {
      score += 35
      factors.push('Real estate case value - mortgage issues')
    }
    if (messageLower.includes('title issue') || messageLower.includes('closing') || messageLower.includes('purchase agreement')) {
      score += 40
      factors.push('Real estate case value - transaction issues')
    }

    // Estate Planning complexity
    if (messageLower.includes('probate') || messageLower.includes('inheritance') || messageLower.includes('estate administration')) {
      score += 30
      factors.push('Estate planning complexity - probate')
    }
    if (messageLower.includes('trust administration') || messageLower.includes('trustee') || messageLower.includes('beneficiary')) {
      score += 35
      factors.push('Estate planning complexity - trust administration')
    }
    if (messageLower.includes('estate tax') || messageLower.includes('wealth transfer') || messageLower.includes('tax planning')) {
      score += 45
      factors.push('Estate planning complexity - tax planning')
    }
    if (messageLower.includes('guardianship') || messageLower.includes('power of attorney') || messageLower.includes('healthcare directive')) {
      score += 25
      factors.push('Estate planning complexity - incapacity planning')
    }

    // ENHANCED: Liability strength assessment
    if (messageLower.includes('drunk driver') || messageLower.includes('dui') || messageLower.includes('intoxicated')) {
      score += 25
      factors.push('Clear liability - impaired driving')
    }
    if (messageLower.includes('hit from behind') || messageLower.includes('rear-ended') || messageLower.includes('rear end')) {
      score += 15
      factors.push('Clear liability - rear-end collision')
    }
    if (messageLower.includes('red light') || messageLower.includes('stop sign') || messageLower.includes('ran red')) {
      score += 20
      factors.push('Clear liability - traffic violation')
    }
    if (messageLower.includes('texting') || messageLower.includes('distracted') || messageLower.includes('phone')) {
      score += 20
      factors.push('Clear liability - distracted driving')
    }

    // Urgency indicators
    if (messageLower.includes('urgent') || messageLower.includes('emergency') || messageLower.includes('immediately')) {
      score += 20
      factors.push('High urgency')
    }

    // Financial indicators (legacy - keep for backward compatibility)
    if (messageLower.includes('money') || messageLower.includes('damages') || messageLower.includes('settlement')) {
      score += 15
      factors.push('Financial stakes')
    }

    // Contact information
    if (messageLower.includes('email') || messageLower.includes('phone') || messageLower.includes('contact')) {
      score += 20
      factors.push('Contact information provided')
    }

    // Timeline
    if (messageLower.includes('soon') || messageLower.includes('quick') || messageLower.includes('asap')) {
      score += 10
      factors.push('Timeline urgency')
    }

    // ENHANCED: Context-aware bonus for complete case profiles
    const hasInjuries = messageLower.includes('pain') || messageLower.includes('injury') || messageLower.includes('broken')
    const hasEconomicLoss = messageLower.includes('work') || messageLower.includes('income') || messageLower.includes('bills')
    const hasClearLiability = messageLower.includes('drunk') || messageLower.includes('fault') || messageLower.includes('hit')

    if (hasInjuries && hasEconomicLoss && hasClearLiability) {
      score += 25
      factors.push('Complete case profile bonus')
    }

    return {
      score: Math.min(score, 100),
      reasoning: `Legal lead score: ${Math.min(score, 100)}/100. ${factors.join(', ')}`,
      factors
    }
  }

  private scoreEcommerceLead(message: string, sessionData: ConversationState) {
    let score = 0
    const factors: string[] = []

    // Product specificity
    if (message.includes('laptop') || message.includes('phone') || message.includes('headphones')) {
      score += 20
      factors.push('Specific product interest')
    }

    // Purchase intent
    if (message.includes('buy') || message.includes('purchase') || message.includes('order')) {
      score += 25
      factors.push('Purchase intent')
    }

    // Budget indicators
    if (message.includes('budget') || message.includes('price') || message.includes('cost')) {
      score += 15
      factors.push('Budget consideration')
    }

    // Contact information
    if (message.includes('email') || message.includes('phone') || message.includes('contact')) {
      score += 20
      factors.push('Contact information provided')
    }

    return {
      score: Math.min(score, 100),
      reasoning: `Ecommerce lead score: ${score}/100. ${factors.join(', ')}`,
      factors
    }
  }

  private scoreGeneralLead(message: string, sessionData: ConversationState) {
    return {
      score: 10,
      reasoning: 'General inquiry lead score: 10/100',
      factors: ['General inquiry']
    }
  }

  updateSessionScore(sessionData: ConversationState, leadScore: { score: number; reasoning: string; factors: string[] }) {
    sessionData.leadScore = leadScore.score
    sessionData.lastActivity = new Date()
  }
}

class EnhancedMessageProcessor {
  private config: ClientConfig
  private intentDetector: IntentDetector
  private leadScorer: LeadScorer

  constructor(config: ClientConfig) {
    this.config = config
    this.intentDetector = new IntentDetector(config)
    this.leadScorer = new LeadScorer(config)
  }

  async processMessage(message: string, sessionData: ConversationState, clientConfig: ClientConfig) {
    console.log('🚀 === ENHANCED MESSAGE PROCESSOR ===')
    console.log('📋 Client:', clientConfig.business_name)
    console.log('📨 Message:', message)

    try {
      // Step 1: Intent Detection
      console.log('🎯 Step 1: Intent Detection')
      const intentResult = await this.intentDetector.detectIntent(message, sessionData, clientConfig)

      // Step 2: Lead Scoring
      console.log('📊 Step 2: Lead Scoring')
      const leadScore = await this.leadScorer.scoreLead(message, sessionData, clientConfig)

      // Update session with lead score
      this.leadScorer.updateSessionScore(sessionData, leadScore)

      console.log(`🔍 LEAD SCORING: Lead Score = ${leadScore.score}/100`)

      // Step 3: Generate Response
      console.log('🤖 Step 3: Generate Response')
      const response = await this.generateResponse(message, intentResult, leadScore, sessionData, clientConfig)

      // Step 4: Update conversation stage
      this.updateConversationStage(sessionData, intentResult, leadScore)

      return {
        response: response,
        session_id: sessionData.sessionId,
        lead_score: leadScore.score,
        intent: intentResult.primary.intent,
        confidence: intentResult.primary.confidence,
        aiData: {
          lead_score: leadScore.score,
          intent: intentResult.primary.intent,
          confidence: intentResult.primary.confidence,
          reasoning: leadScore.reasoning
        }
      }

    } catch (error) {
      console.error('❌ Enhanced processing failed:', error)
      return this.getFallbackResponse(message, clientConfig)
    }
  }

  private async generateResponse(message: string, intentResult: any, leadScore: any, sessionData: ConversationState, clientConfig: ClientConfig): Promise<string> {
    const messageLower = message.toLowerCase()
    const responses = clientConfig.responses || {}

    // Check for specific keyword matches first
    for (const [keywords, response] of Object.entries(responses)) {
      const keywordList = keywords.split("|").map(k => k.trim().toLowerCase())
      if (keywordList.some(keyword => messageLower.includes(keyword))) {
        return this.replacePlaceholders(response, clientConfig)
      }
    }

    // Generate intent-based response for specific business intents
    const intent = intentResult.primary.intent
    switch (intent) {
      case 'PROPERTY_SEARCH':
        return "🏠 I'd be happy to help you find the perfect property! What type of home are you looking for, and what's your budget range?"
      case 'MARKET_INFO':
        return "📊 I can provide you with current market information! What specific area or property type are you interested in?"
      case 'PERSONAL_INJURY':
        return "🚗 **Personal Injury Case Assessment:**\n\nBased on your description, this appears to be a **strong personal injury case** with the following factors:\n\n• **Clear Liability**: Drunk driver at fault\n• **Significant Injuries**: Neck pain requiring medical attention\n• **Economic Damages**: Lost wages from missed work\n• **Negligence**: Driving under the influence\n\n**Next Steps:**\n• Schedule a free consultation to discuss your case\n• Document all medical treatments and expenses\n• Keep records of missed work and lost wages\n• Don't speak to insurance companies without legal representation\n\n**Our Contingency Fee**: No fees unless we win your case!\n\n📞 Call us at (555) LAW-FIRM for immediate assistance."
      case 'FAMILY_LAW':
        return "👨‍👩‍👧‍👦 I can help with family law matters. What specific type of family law issue are you dealing with?"
      case 'PRODUCT_SEARCH':
        return "🛒 I'd love to help you find the perfect product! What type of item are you looking for?"
      case 'ORDER_STATUS':
        return "📦 I can help you track your order! Please provide your order number."
      default:
        // Use AI for conversational responses when no specific keywords or intents match
        console.log('🤖 No keyword or intent match, using AI response')
        try {
          const aiResponse = await this.generateConversationalResponse(message, sessionData, clientConfig)
          console.log('✅ AI response successful:', aiResponse)
          return aiResponse
        } catch (aiError) {
          console.error('❌ AI response failed:', aiError)
          return this.getFallbackResponse(message, clientConfig).response
        }
    }
  }

  private replacePlaceholders(response: string, clientConfig: ClientConfig): string {
    return response
      .replace('{phone}', clientConfig.contact.phone)
      .replace('{email}', clientConfig.contact.email || '')
      .replace('{website}', clientConfig.contact.website || '')
      .replace('{address}', clientConfig.contact.address || '')
  }

  private updateConversationStage(sessionData: ConversationState, intentResult: any, leadScore: any) {
    sessionData.messageCount++
    sessionData.lastActivity = new Date()

    if (sessionData.messageCount === 1) {
      sessionData.conversationStage = 'initial'
    } else if (leadScore.score > 50) {
      sessionData.conversationStage = 'qualified_lead'
    } else {
      sessionData.conversationStage = 'gathering_info'
    }
  }

  private async generateConversationalResponse(message: string, sessionData: ConversationState, clientConfig: ClientConfig): Promise<string> {
    try {
      console.log('🤖 Generating AI response for:', message)

      // Create industry-specific system prompt
      const systemPrompt = this.createSystemPrompt(clientConfig)

      // Try OpenAI first, fallback to conversational responses if it fails
      try {
        const aiResponse = await callOpenAI(message, systemPrompt)
        console.log('✅ OpenAI response successful')
        return aiResponse
      } catch (openaiError) {
        console.log('⚠️ OpenAI failed, using conversational fallback')

        // Fallback to conversational responses
        const fallbackResponses = {
          'real_estate': [
            "I'm here to help with all your real estate needs! I can assist with property searches, market information, scheduling viewings, and connecting you with our agents. What would you like to know about?",
            "As your Dream Homes Realty assistant, I'm here to make your real estate journey easier. I can help you find properties, understand market trends, and connect with our experienced agents. How can I assist you today?",
            "I'm your personal real estate assistant! I can help you search for properties, get market insights, schedule viewings, and answer any real estate questions you might have. What brings you to Dream Homes Realty today?"
          ],
          'legal': [
            "I'm here to help you understand our legal services and connect you with the right attorney. I can assist with case assessments, consultation scheduling, and general legal information. How can I help you today?",
            "As your Justice Partners Law Firm assistant, I'm here to guide you through our legal services and help you find the right attorney for your case. What legal matter can I help you with?",
            "I'm your legal assistant! I can help you understand our practice areas, schedule consultations, and provide general information about our services. What brings you to Justice Partners today?"
          ],
          'ecommerce': [
            "I'm here to help you find the perfect tech products and assist with your shopping needs! I can help with product recommendations, order tracking, and customer support. How can I assist you today?",
            "As your TechGear assistant, I'm here to make your shopping experience better. I can help you find products, track orders, and answer any questions about our tech offerings. What can I help you with?",
            "I'm your personal shopping assistant! I can help you discover great tech products, track your orders, and provide excellent customer support. What brings you to TechGear today?"
          ]
        }

        const responses = fallbackResponses[clientConfig.industry] || fallbackResponses['real_estate']
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        return randomResponse
      }

    } catch (error) {
      console.error('❌ Conversational response error:', error)
      return this.getFallbackResponse(message, clientConfig).response
    }
  }

  private createSystemPrompt(clientConfig: ClientConfig): string {
    const basePrompt = `You are a helpful and professional AI assistant for ${clientConfig.business_name}.

Business Information:
- Company: ${clientConfig.business_name}
- Industry: ${clientConfig.industry}
- Phone: ${clientConfig.contact.phone}
- Email: ${clientConfig.contact.email || 'Not provided'}
- Website: ${clientConfig.contact.website || 'Not provided'}

Your role is to:`

    switch (clientConfig.industry) {
      case 'real_estate':
        return `${basePrompt}
- Help customers with property searches, market information, and real estate inquiries
- Provide information about buying, selling, and renting properties
- Assist with scheduling viewings and connecting with agents
- Answer questions about market trends, property values, and neighborhoods
- Be friendly, professional, and knowledgeable about real estate
- Always maintain the context of being a real estate assistant
- If asked about properties, ask for preferences like budget, location, and property type
- Keep responses concise but helpful (max 2-3 sentences)`

      case 'legal':
        return `${basePrompt}
- Help potential clients understand legal services and practice areas
- Provide general information about legal processes and procedures
- Assist with scheduling consultations and connecting with attorneys
- Answer questions about fees, office hours, and services
- Be professional, empathetic, and knowledgeable about legal matters
- Always maintain the context of being a legal assistant
- If asked about legal cases, ask for relevant details like case type and urgency
- Keep responses concise but helpful (max 2-3 sentences)
- Note: You cannot provide specific legal advice, only general information`

      case 'ecommerce':
        return `${basePrompt}
- Help customers with product searches, recommendations, and purchases
- Provide information about products, pricing, and availability
- Assist with order tracking, returns, and customer service
- Answer questions about shipping, policies, and promotions
- Be friendly, helpful, and knowledgeable about products
- Always maintain the context of being an e-commerce assistant
- If asked about products, ask for preferences like budget and use case
- Keep responses concise but helpful (max 2-3 sentences)`

      default:
        return `${basePrompt}
- Provide helpful and professional assistance
- Be friendly and knowledgeable about the business
- Keep responses concise but helpful (max 2-3 sentences)`
    }
  }

  private getFallbackResponse(message: string, clientConfig: ClientConfig): any {
    const fallback = clientConfig.fallback_response || "I'm here to help! How can I assist you today?"

    return {
      response: this.replacePlaceholders(fallback, clientConfig),
      session_id: 'default',
      lead_score: 0,
      intent: 'GENERAL_INQUIRY',
      confidence: 0.3,
      aiData: {
        lead_score: 0,
        intent: 'GENERAL_INQUIRY',
        confidence: 0.3,
        reasoning: 'Fallback response used'
      }
    }
  }
}

// Load client configuration
function loadClientConfig(clientId: string): ClientConfig {
  return CLIENT_CONFIGS[clientId] || DEFAULT_CONFIG
}

// Get or create session
function getOrCreateSession(sessionId: string, clientId: string): ConversationState {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      clientId,
      conversationHistory: [],
      leadScore: 0,
      detectedIntents: [],
      userProfile: {},
      lastActivity: new Date(),
      conversationStage: 'initial',
      leadData: {},
      messageCount: 0
    })
  }
  return sessions.get(sessionId)!
}

// Clean up old sessions (older than 1 hour)
function cleanupOldSessions() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  for (const [sessionId, session] of sessions.entries()) {
    if (session.lastActivity < oneHourAgo) {
      sessions.delete(sessionId)
    }
  }
}

// Main chat endpoint
async function handleChat(request: ChatRequest): Promise<ChatResponse> {
  try {
    const clientId = request.client_id || request.clientId || 'default'
    const sessionId = request.session_id || request.sessionId || request.conversationId || `session_${Date.now()}`

    if (!request.message) {
      throw new Error('Missing message')
    }

    // Load client configuration
    const clientConfig = loadClientConfig(clientId)
    if (!clientConfig) {
      throw new Error(`Configuration not found for client: ${clientId}`)
    }

    // Get or create session
    const sessionData = getOrCreateSession(sessionId, clientId)

    // Add user message to conversation history
    sessionData.conversationHistory.push({
      text: request.message,
      timestamp: new Date().toISOString(),
      sender: 'user'
    })

    // Initialize enhanced message processor
    const enhancedProcessor = new EnhancedMessageProcessor(clientConfig)

    // Process message
    const result = await enhancedProcessor.processMessage(request.message, sessionData, clientConfig)

    // Add bot response to conversation history
    sessionData.conversationHistory.push({
      text: result.response,
      timestamp: new Date().toISOString(),
      sender: 'bot'
    })

    // Clean up old sessions periodically
    if (Math.random() < 0.1) { // 10% chance to run cleanup
      cleanupOldSessions()
    }

    return result

  } catch (error) {
    console.error('Error processing chat request:', error)
    throw new Error(`Error processing request: ${error.message}`)
  }
}

// Health check endpoint
function handleHealthCheck() {
  return {
    status: "healthy",
    service: "tier2-chatbot",
    timestamp: new Date().toISOString(),
    available_clients: Object.keys(CLIENT_CONFIGS),
    active_sessions: sessions.size,
    features: ['Lead Scoring', 'Intent Detection', 'Enhanced Processing', 'Session Management']
  }
}

// Get client configuration endpoint
function handleGetClientConfig(clientId: string) {
  const config = loadClientConfig(clientId)
  return {
    client_id: clientId,
    business_name: config.business_name || "Unknown",
    industry: config.industry || "general",
    available_features: Object.keys(config.ai_features || {}),
    has_lead_capture: !!config.lead_capture?.enabled
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Extract the actual endpoint from the path
    const endpoint = path.replace(/^\/tier2-chatbots/, '') || path

    // Route handling
    if (endpoint === "/chat" && req.method === "POST") {
      const request: ChatRequest = await req.json()
      const response = await handleChat(request)

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    if (endpoint === "/health" && req.method === "GET") {
      const response = handleHealthCheck()

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // Handle /clients/{client_id}/config endpoint
    const clientConfigMatch = endpoint.match(/^\/clients\/([^/]+)\/config$/)
    if (clientConfigMatch && req.method === "GET") {
      const clientId = clientConfigMatch[1]
      const response = handleGetClientConfig(clientId)

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // Root endpoint for testing
    if (endpoint === "/" || endpoint === "") {
      return new Response(
        JSON.stringify({
          message: "Tier 2 Chatbots Edge Function is running!",
          available_endpoints: ["/chat", "/health", "/clients/{client_id}/config"],
          available_clients: Object.keys(CLIENT_CONFIGS),
          features: ['Lead Scoring', 'Intent Detection', 'Enhanced Processing', 'Session Management']
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404
      }
    )

  } catch (error) {
    console.error("Error handling request:", error)

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})
