// Mock API client for frontend-only deployment
export const apiClient = {
  sendMessage: async (message: string) => {
    // Mock response for demo purposes
    return {
      message: "This is a demo response. The full API functionality would be available in a complete deployment.",
      confidence: 0.9,
      sources: [],
      propertyReferences: [],
      needsEscalation: false
    };
  }
};
