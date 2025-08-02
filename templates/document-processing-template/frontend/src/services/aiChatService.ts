export interface Citation {
  documentId: string;
  section: string;
  page: number;
  paragraph: number;
  text: string;
  // Enhanced citation format
  display?: string;
  reference?: string;
  fullText?: string;
}

export interface ChatResponse {
  response: string;
  citations: Citation[];
  confidence: number;
  // Enhanced response format
  message?: string;
  keyPoints?: string[];
  followUp?: string;
  showMoreCitations?: boolean;
}

export interface ChatRequest {
  message: string;
  documentId: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

class AIChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3002';
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to AI service:', error);

      // Fallback response for demo purposes
      return this.generateFallbackResponse(request.message, request.documentId);
    }
  }

  private generateFallbackResponse(message: string, documentId: string): ChatResponse {
    // This is a fallback response for when the backend is not available
    // In a real implementation, this would be handled by the backend

    const responses: Record<string, Record<string, { response: string; citations: Citation[]; message?: string; keyPoints?: string[]; followUp?: string }>> = {
      'lease-agreement': {
        'What\'s the monthly rent?': {
          response: 'According to Section 2.1 on page 2, the monthly rent is Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of the lease.',
          message: '💰 Your monthly rent is $8,500, due on the 1st of each month.',
          keyPoints: ['Amount: $8,500'],
          followUp: 'Would you like to know about payment methods or late fees?',
          citations: [{
            documentId: 'lease-agreement',
            section: '2.1',
            page: 2,
            paragraph: 1,
            text: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month',
            display: '💰 $8,500',
            reference: 'Section 2.1 (Page 2)'
          }]
        },
        'What happens if I break the lease early?': {
          response: 'According to Section 5.1 on page 5, if you desire to terminate the lease early, you must provide written notice at least ninety (90) days in advance. You will remain liable for rent payments until the termination date and must pay a termination fee equal to two (2) months\' rent.',
          message: '🚪 To end your lease early, you need to give 90 days written notice and pay a termination fee of 2 months rent ($17,000).',
          keyPoints: ['Duration: 90 days', 'Fee: $17,000'],
          followUp: 'Do you need help understanding the termination process?',
          citations: [{
            documentId: 'lease-agreement',
            section: '5.1',
            page: 5,
            paragraph: 1,
            text: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance',
            display: '⏰ 90 days',
            reference: 'Section 5.1 (Page 5)'
          }]
        }
      },
      'employment-contract': {
        'What\'s the salary and benefits?': {
          response: 'According to Section 3.1 on page 3, the annual base salary is One Hundred Twenty-Five Thousand Dollars ($125,000.00). Section 4.1 on page 4 states that you are eligible for health insurance, 401(k) retirement plan, and twenty (20) days of paid vacation per year.',
          message: '💰 Your base salary is $125,000/year with 20 days vacation, health insurance, and 401(k) with company match.',
          keyPoints: ['Salary: $125,000', 'Vacation: 20 days'],
          followUp: 'Would you like to know about benefits or bonuses?',
          citations: [
            {
              documentId: 'employment-contract',
              section: '3.1',
              page: 3,
              paragraph: 1,
              text: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00)',
              display: '💰 $125,000',
              reference: 'Section 3.1 (Page 3)'
            },
            {
              documentId: 'employment-contract',
              section: '4.1',
              page: 4,
              paragraph: 1,
              text: 'Employee shall be entitled to twenty (20) days of paid vacation per year',
              display: '⏰ 20 days',
              reference: 'Section 4.1 (Page 4)'
            }
          ]
        }
      }
    };

    const docResponses = responses[documentId];
    if (docResponses) {
      const matchingResponse = docResponses[message];
      if (matchingResponse) {
        return {
          response: matchingResponse.response,
          citations: matchingResponse.citations,
          confidence: 0.95,
          message: matchingResponse.message,
          keyPoints: matchingResponse.keyPoints,
          followUp: matchingResponse.followUp,
          showMoreCitations: false
        };
      }
    }

    // Generic response for unknown questions
    return {
      response: `I understand you're asking about "${message}" regarding the ${documentId} document. However, I don't have specific information about this question in the current document context. Please try asking about specific terms, clauses, or sections that are mentioned in the document.`,
      message: `I don't see that specific detail in your ${documentId}. Could you rephrase your question, or would you like me to show you what I do have about related topics?`,
      citations: [],
      confidence: 0.3,
      followUp: "What other aspects of the document would you like to know about?",
      showMoreCitations: false
    };
  }
}

export const aiChatService = new AIChatService();
