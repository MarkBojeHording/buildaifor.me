/**
 * Base Chatbot Widget - Shared Core Functionality
 * This file contains the foundational widget code that all tiers extend
 */

class BaseChatbotWidget {
  constructor(config) {
    this.config = {
      clientId: 'default',
      apiUrl: 'http://localhost:8001',
      theme: 'default',
      position: 'bottom-right',
      ...config
    };

    this.isOpen = false;
    this.messages = [];
    this.conversationId = null;
    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.loadStyles();
  }

  createWidget() {
    // Create main container
    this.container = document.createElement('div');
    this.container.id = 'chatbot-widget';
    this.container.className = `chatbot-widget chatbot-${this.config.position}`;

    // Create chat button
    this.chatButton = document.createElement('div');
    this.chatButton.className = 'chatbot-button';
    this.chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    // Create chat window
    this.chatWindow = document.createElement('div');
    this.chatWindow.className = 'chatbot-window';
    this.chatWindow.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-title">${this.config.title || 'Chat Assistant'}</div>
        <button class="chatbot-close">&times;</button>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" placeholder="Type your message...">
        <button class="chatbot-send">Send</button>
      </div>
    `;

    this.container.appendChild(this.chatButton);
    this.container.appendChild(this.chatWindow);
    document.body.appendChild(this.container);

    // Store references
    this.messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
    this.input = this.chatWindow.querySelector('.chatbot-input');
    this.sendButton = this.chatWindow.querySelector('.chatbot-send');
    this.closeButton = this.chatWindow.querySelector('.chatbot-close');
  }

  bindEvents() {
    // Toggle chat window
    this.chatButton.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.closeChat());

    // Send message
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatWindow.style.display = this.isOpen ? 'block' : 'none';
    if (this.isOpen) {
      this.input.focus();
      this.scrollToBottom();
    }
  }

  closeChat() {
    this.isOpen = false;
    this.chatWindow.style.display = 'none';
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
      const response = await fetch(`${this.config.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          config: { client_id: this.config.clientId },
          ...(this.conversationId && { conversation_id: this.conversationId })
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.conversation_id && !this.conversationId) {
        this.conversationId = data.conversation_id;
      }

      this.hideTyping();
      this.addMessage(data.response, 'bot');

    } catch (error) {
      console.error('Error sending message:', error);
      this.hideTyping();
      this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again.', 'bot');
    }
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${sender}`;
    messageDiv.textContent = text;

    this.messagesContainer.appendChild(messageDiv);
    this.messages.push({ text, sender, timestamp: new Date() });
    this.scrollToBottom();
  }

  showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message chatbot-message-bot chatbot-typing';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTyping() {
    const typingElement = this.messagesContainer.querySelector('.chatbot-typing');
    if (typingElement) {
      typingElement.remove();
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  loadStyles() {
    // Styles will be loaded from the tier-specific CSS files
    // This method can be overridden by tiers to load custom styles
  }

  // Utility methods
  setTheme(theme) {
    this.config.theme = theme;
    this.container.className = `chatbot-widget chatbot-${this.config.position} chatbot-theme-${theme}`;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Export for use in tier-specific implementations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseChatbotWidget;
} else {
  window.BaseChatbotWidget = BaseChatbotWidget;
}
