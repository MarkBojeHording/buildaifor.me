export const BRAND_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
};

export const REAL_ESTATE_CATEGORIES = [
  'Property Listing',
  'Market Report',
  'Contract',
  'Inspection',
  'Appraisal',
  'HOA Documents',
  'Title Documents',
  'Insurance',
  'Other',
];

export const PROPERTY_TYPES = [
  'Single Family Home',
  'Condominium',
  'Townhouse',
  'Multi-Family',
  'Vacant Land',
  'Commercial',
  'Investment Property',
];

export const URGENCY_LEVELS = {
  low: {
    label: 'Low Priority',
    color: 'green',
    responseTime: '2-4 hours',
  },
  medium: {
    label: 'Medium Priority',
    color: 'yellow',
    responseTime: '1-2 hours',
  },
  high: {
    label: 'High Priority',
    color: 'red',
    responseTime: '15-30 minutes',
  },
};

export const API_ENDPOINTS = {
  CHAT: '/ask',
  UPLOAD: '/api/upload',
  HEALTH: '/api/health',
  ANALYTICS: '/api/analytics',
  ESCALATE: '/api/escalate',
};

export const FILE_TYPES = {
  SUPPORTED: ['.pdf', '.doc', '.docx', '.txt', '.md'],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
};

export const MOCK_MARKET_INSIGHTS = [
  {
    id: '1',
    title: 'Average Home Price',
    description: 'Median home price in your preferred areas',
    value: '$485,000',
    trend: 'up' as const,
    percentage: 3.2,
    location: 'Downtown & Suburbs',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    title: 'Days on Market',
    description: 'Average time properties spend on the market',
    value: '22 days',
    trend: 'down' as const,
    percentage: 1.8,
    location: 'Metro Area',
    lastUpdated: new Date(),
  },
  {
    id: '3',
    title: 'Inventory Level',
    description: 'Available properties in your price range',
    value: '2.3 months',
    trend: 'stable' as const,
    percentage: 0.2,
    location: 'All Areas',
    lastUpdated: new Date(),
  },
];

export const MOCK_SAVED_PROPERTIES = [
  {
    id: '1',
    address: '123 Maple Street, Downtown',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    mlsId: 'MLS123456',
    status: 'Active' as const,
  },
  {
    id: '2',
    address: '456 Oak Avenue, Suburbs',
    price: 520000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    mlsId: 'MLS789012',
    status: 'Pending' as const,
  },
];
