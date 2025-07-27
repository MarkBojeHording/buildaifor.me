const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8005';

export class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async sendMessage(message: string, chatId?: string) {
    return this.request('/ask', {
      method: 'POST',
      body: JSON.stringify({ question: message, conversation_id: chatId }),
    });
  }

  async uploadDocument(file: File, category: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  async getHealth() {
    return this.request('/api/health');
  }

  async getAnalytics() {
    return this.request('/api/analytics');
  }

  async escalateToAgent(escalationData: any) {
    return this.request('/api/escalate', {
      method: 'POST',
      body: JSON.stringify(escalationData),
    });
  }
}

export const apiClient = new APIClient();
