/**
 * Tier 1 Basic FAQ Chatbot Widget
 * Extends BaseChatbotWidget with simple FAQ functionality
 */

// Import base widget (in production, this would be a proper import)
// For this template, we assume BaseChatbotWidget is available globally

function formatResponse(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/• /g, '• ')
        .trim();
}

class Tier1ChatbotWidget extends BaseChatbotWidget {
  constructor(config) {
    // Extend config with tier-specific defaults
    const tier1Config = {
      tier: 'tier1',
      maxResponses: 10,
      enableQuickReplies: true,
      ...config
    };

    super(tier1Config);
    this.quickReplies = this.generateQuickReplies();
    this.setupQuickReplies();
  }

  createWidget() {
    super.createWidget();

    // Add tier-specific elements
    this.addQuickRepliesSection();
    this.addWelcomeMessage();
  }

  addQuickRepliesSection() {
    const quickRepliesContainer = document.createElement('div');
    quickRepliesContainer.className = 'chatbot-quick-replies';
    quickRepliesContainer.innerHTML = `
      <div class="quick-replies-title">Quick questions:</div>
      <div class="quick-replies-buttons"></div>
    `;

    // Insert before input area
    const inputArea = this.chatWindow.querySelector('.chatbot-input-area');
    this.chatWindow.insertBefore(quickRepliesContainer, inputArea);

    this.quickRepliesContainer = quickRepliesContainer.querySelector('.quick-replies-buttons');
  }

  addWelcomeMessage() {
    const welcomeMessage = `👋 Hi! I'm here to help with basic questions about ${this.config.title}. What would you like to know?`;
    this.addMessage(welcomeMessage, 'bot');
  }

  generateQuickReplies() {
    // Default quick replies for Tier 1
    const defaultReplies = [
      { text: 'What are your hours?', icon: '🕒' },
      { text: 'Where are you located?', icon: '📍' },
      { text: 'How can I contact you?', icon: '📞' },
      { text: 'What services do you offer?', icon: '💼' }
    ];

    // Allow custom quick replies from config
    return this.config.quickReplies || defaultReplies;
  }

  setupQuickReplies() {
    this.quickReplies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply-button';
      button.innerHTML = `${reply.icon} ${reply.text}`;
      button.addEventListener('click', () => {
        this.handleQuickReply(reply.text);
      });

      this.quickRepliesContainer.appendChild(button);
    });
  }

  handleQuickReply(text) {
    // Simulate user typing the quick reply
    this.input.value = text;
    this.sendMessage();
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    this.input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      // For Tier 1, we use simple keyword matching
      const response = this.getSimpleResponse(message);

      // Simulate typing delay
      setTimeout(() => {
        this.hideTyping();
        this.addMessage(response, 'bot');
      }, 1000 + Math.random() * 1000); // 1-2 second delay

    } catch (error) {
      console.error('Error processing message:', error);
      this.hideTyping();
      this.addMessage('I\'m sorry, I don\'t understand that question. Could you try asking something else?', 'bot');
    }
  }

  getSimpleResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Simple keyword matching for Tier 1
    const responses = this.config.responses || {
      'hours|open|time|when': '🕒 We\'re open Monday-Friday 9AM-5PM. Closed on weekends and holidays.',
      'location|where|address': '📍 We\'re located at 123 Main Street, City, State 12345.',
      'contact|phone|call': '📞 You can reach us at (555) 123-4567 or email us at info@yourbusiness.com',
      'services|offer|what do you do': '💼 We offer a range of services including [list your main services]. What specifically are you looking for?',
      'pricing|cost|price|how much': '💰 Our pricing varies depending on your needs. Could you tell me more about what you\'re looking for?',
      'appointment|book|schedule': '📅 To schedule an appointment, please call us at (555) 123-4567 or visit our website.',
      'hello|hi|hey': '👋 Hello! How can I help you today?',
      'thanks|thank you': 'You\'re welcome! Is there anything else I can help you with?'
    };

    // Find matching response
    for (const [keywords, response] of Object.entries(responses)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
        return response;
      }
    }

    // Default response if no keywords match
    return 'I\'m sorry, I don\'t have information about that. Could you try asking about our hours, location, services, or contact information?';
  }

  loadStyles() {
    // Load Tier 1 specific styles
    if (!document.querySelector('#tier1-chatbot-styles')) {
      const link = document.createElement('link');
      link.id = 'tier1-chatbot-styles';
      link.rel = 'stylesheet';
      link.href = 'styles.css';
      document.head.appendChild(link);
    }
  }

  // Tier 1 specific utility methods
  updateResponses(newResponses) {
    this.config.responses = { ...this.config.responses, ...newResponses };
  }

  addCustomResponse(keywords, response) {
    this.config.responses = this.config.responses || {};
    this.config.responses[keywords] = response;
  }

  getConversationStats() {
    return {
      totalMessages: this.messages.length,
      userMessages: this.messages.filter(m => m.sender === 'user').length,
      botMessages: this.messages.filter(m => m.sender === 'bot').length,
      tier: 'tier1'
    };
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${sender}`;
    messageDiv.innerHTML = formatResponse(text);
    this.messagesContainer.appendChild(messageDiv);
    this.messages.push({ text, sender, timestamp: new Date() });
    this.scrollToBottom();
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Tier1ChatbotWidget;
} else {
  // For browser usage, create a global ChatbotWidget class
  window.ChatbotWidget = Tier1ChatbotWidget;
}
