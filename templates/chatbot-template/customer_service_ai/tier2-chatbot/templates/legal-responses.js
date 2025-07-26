/**
 * Legal Industry Response Templates
 * Comprehensive response templates for legal chatbot interactions
 */

const legalResponses = {
  // Basic Information
  greeting: {
    pattern: "hello|hi|hey|good morning|good afternoon|good evening",
    response: "👨‍💼 Hello! Welcome to {business_name}. I'm here to help you with information about our legal services, consultation appointments, and general questions. How can I assist you today?"
  },

  // Office Hours & Availability
  hours: {
    pattern: "hours|open|time|schedule|when are you open",
    response: "🕒 Our office hours are:\n\n• Monday-Friday: 8:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 2:00 PM\n• Sunday: Closed\n\nWe offer emergency consultations outside business hours for urgent legal matters."
  },

  // Consultation Information
  consultation: {
    pattern: "consultation|meet|appointment|free consultation|initial consultation",
    response: "📋 Free Initial Consultation:\n\n• 30-minute free consultation to discuss your case\n• No obligation to hire our firm\n• Available in-person or via video call\n• We'll assess your case and explain your options\n\nTo schedule: Call {phone} or email {email}"
  },

  // Fee Structure
  fees: {
    pattern: "fees|cost|price|payment|how much|rates|hourly|contingency",
    response: "💰 Our Fee Structure:\n\n• Free initial consultation\n• Contingency fees for personal injury cases\n• Hourly rates: $250-400/hour\n• Flat fees for certain services\n• Payment plans available\n• No fees unless we win (contingency cases)\n\nContact us for a detailed quote based on your specific case."
  },

  // Practice Areas
  services: {
    pattern: "services|practice|areas|what do you do|types of law",
    response: "⚖️ Our Practice Areas:\n\n• Personal Injury Law\n• Family Law & Divorce\n• Criminal Defense\n• Real Estate Law\n• Business Law\n• Estate Planning\n• Employment Law\n• Immigration Law\n\nWe have over 20 years of combined experience in these areas."
  },

  // Personal Injury
  personal_injury: {
    pattern: "personal injury|accident|car crash|slip and fall|medical malpractice",
    response: "🚗 Personal Injury Cases:\n\n• Car accidents and motorcycle crashes\n• Slip and fall accidents\n• Medical malpractice\n• Product liability\n• Wrongful death\n• Workplace injuries\n\nWe work on contingency - no fees unless we win your case!"
  },

  // Family Law
  family_law: {
    pattern: "family law|divorce|custody|child support|alimony",
    response: "👨‍👩‍👧‍👦 Family Law Services:\n\n• Divorce and separation\n• Child custody and support\n• Property division\n• Prenuptial agreements\n• Adoption\n• Domestic violence protection\n\nWe handle cases with compassion and expertise."
  },

  // Criminal Defense
  criminal: {
    pattern: "criminal|arrest|charges|dui|drug|assault|theft",
    response: "🛡️ Criminal Defense:\n\n• DUI/DWI charges\n• Drug offenses\n• Assault and battery\n• Theft and fraud\n• White-collar crimes\n• Traffic violations\n\nWe provide aggressive defense and protect your rights."
  },

  // Real Estate Law
  real_estate_law: {
    pattern: "real estate law|property|contract|closing|title",
    response: "🏠 Real Estate Law:\n\n• Property transactions\n• Contract review and negotiation\n• Title issues and disputes\n• Landlord-tenant law\n• Zoning and land use\n• Real estate litigation\n\nWe ensure smooth real estate transactions."
  },

  // Business Law
  business_law: {
    pattern: "business law|corporate|contracts|formation|litigation",
    response: "💼 Business Law Services:\n\n• Business formation and structure\n• Contract drafting and review\n• Employment law compliance\n• Intellectual property\n• Business litigation\n• Mergers and acquisitions\n\nWe help businesses grow and protect their interests."
  },

  // Estate Planning
  estate_planning: {
    pattern: "estate planning|will|trust|probate|inheritance",
    response: "📜 Estate Planning:\n\n• Wills and trusts\n• Power of attorney\n• Healthcare directives\n• Probate administration\n• Estate tax planning\n• Charitable giving\n\nWe help you protect your legacy and family."
  },

  // Employment Law
  employment: {
    pattern: "employment|workplace|discrimination|harassment|wrongful termination",
    response: "👔 Employment Law:\n\n• Workplace discrimination\n• Sexual harassment\n• Wrongful termination\n• Wage and hour disputes\n• Employment contracts\n• Workplace safety\n\nWe fight for employee rights and fair treatment."
  },

  // Immigration Law
  immigration: {
    pattern: "immigration|visa|citizenship|green card|deportation",
    response: "🌍 Immigration Law:\n\n• Family-based immigration\n• Employment visas\n• Citizenship applications\n• Green card processing\n• Deportation defense\n• Asylum applications\n\nWe help families stay together and achieve their dreams."
  },

  // Urgent Legal Matters
  urgent: {
    pattern: "urgent|emergency|immediately|asap|critical",
    response: "🚨 For urgent legal matters:\n\n• Call us immediately at {phone}\n• We offer 24/7 emergency consultations\n• Criminal charges require immediate attention\n• Personal injury cases have time limits\n\nDon't delay - your rights may be at stake!"
  },

  // Case Evaluation
  case_evaluation: {
    pattern: "evaluate|assess|review|worth|chances",
    response: "🔍 Case Evaluation:\n\n• Free initial case review\n• We assess the strength of your case\n• Explain potential outcomes\n• Discuss legal strategies\n• Provide honest assessment\n\nSchedule a consultation to discuss your specific situation."
  },

  // Client Rights
  client_rights: {
    pattern: "rights|what are my rights|legal rights|protect",
    response: "⚖️ Your Legal Rights:\n\n• Right to legal representation\n• Right to remain silent\n• Right to a fair trial\n• Right to privacy\n• Right to due process\n\nWe ensure your rights are protected throughout the legal process."
  },

  // Success Rate
  success_rate: {
    pattern: "success rate|win rate|track record|experience",
    response: "🏆 Our Track Record:\n\n• 95% success rate in personal injury cases\n• 90% favorable outcomes in family law\n• 85% acquittal rate in criminal defense\n• 20+ years of combined experience\n• Thousands of satisfied clients\n\nWe have a proven record of achieving results."
  },

  // Contact Information
  contact: {
    pattern: "contact|call|email|reach|speak",
    response: "📞 Contact Information:\n\n• Phone: {phone}\n• Email: {email}\n• Website: {website}\n• Address: {address}\n\nWe're available during business hours and offer emergency consultations for urgent matters."
  },

  // Payment Options
  payment: {
    pattern: "payment|pay|afford|expensive|cost too much",
    response: "💳 Payment Options:\n\n• Free initial consultation\n• Contingency fees (no win, no fee)\n• Payment plans available\n• Credit card accepted\n• Sliding scale for qualifying clients\n\nWe work to make legal services accessible to everyone."
  },

  // Confidentiality
  confidentiality: {
    pattern: "confidential|private|secret|attorney client privilege",
    response: "🔒 Attorney-Client Privilege:\n\n• All communications are confidential\n• Protected by attorney-client privilege\n• We cannot disclose your information\n• Safe to share sensitive details\n• Your privacy is our priority\n\nYou can speak freely with us about your case."
  },

  // Timeline Expectations
  timeline: {
    pattern: "how long|timeline|duration|time frame|when",
    response: "⏰ Case Timeline:\n\n• Initial consultation: 30 minutes\n• Case preparation: 1-4 weeks\n• Settlement negotiations: 2-6 months\n• Trial preparation: 3-12 months\n• Actual timeline varies by case complexity\n\nWe'll provide specific timelines during consultation."
  },

  // Documentation Needed
  documentation: {
    pattern: "documents|papers|evidence|bring|need",
    response: "📋 Documents to Bring:\n\n• Police reports (if applicable)\n• Medical records\n• Insurance information\n• Contracts or agreements\n• Photos or videos\n• Witness statements\n\nDon't worry if you don't have everything - we'll help you gather what's needed."
  },

  // Emergency Response
  emergency: {
    pattern: "emergency|arrested|detained|police|jail",
    response: "🚨 EMERGENCY - If you've been arrested:\n\n• Call us immediately at {phone}\n• Don't speak to police without an attorney\n• Exercise your right to remain silent\n• We provide 24/7 emergency response\n• We'll help you get released\n\nYour freedom is our priority!"
  }
};

module.exports = legalResponses;
