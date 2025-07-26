export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
  sources?: PropertySource[];
  propertyReferences?: PropertyReference[];
}

export interface PropertySource {
  id: string;
  title: string;
  type: 'MLS' | 'Document' | 'Market Report';
  url?: string;
  relevance: number;
}

export interface PropertyReference {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  mlsId: string;
  status: 'Active' | 'Pending' | 'Sold';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: PropertyPreferences;
  savedProperties: string[];
  agent?: AgentInfo;
}

export interface PropertyPreferences {
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number;
  bathrooms: number;
  propertyTypes: string[];
  locations: string[];
  features: string[];
}

export interface AgentInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  license: string;
  specialties: string[];
  rating: number;
  reviews: number;
}

export interface DocumentUpload {
  id: string;
  filename: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  uploadedAt: Date;
  category: 'Property Listing' | 'Market Report' | 'Contract' | 'Inspection' | 'Other';
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  location: string;
  lastUpdated: Date;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  sources: PropertySource[];
  propertyReferences: PropertyReference[];
  needsEscalation: boolean;
}

export interface EscalationRequest {
  chatId: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  clientMessage: string;
  context: string;
}