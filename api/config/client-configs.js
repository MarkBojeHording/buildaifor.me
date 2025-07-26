// Client configs for law firm chatbot
const clientConfigs = {
  default: {
    chatbotName: 'Law Firm AI Assistant',
    supportedCaseTypes: ['personal_injury', 'car_accident', 'slip_and_fall'],
    greeting: 'Welcome to our law firm. How can I assist you with your legal matter today?',
    contactInfo: {
      phone: '555-123-4567',
      email: 'info@lawfirm.com'
    },
    feeStructure: 'Contingency fee (no upfront cost).'
  },
  'smith-injury-law': {
    chatbotName: 'Smith Injury Law AI Assistant',
    supportedCaseTypes: ['personal_injury', 'car_accident', 'slip_and_fall'],
    greeting: 'Welcome to Smith Injury Law. How can I assist you with your legal matter today?',
    contactInfo: {
      phone: '555-123-4567',
      email: 'info@smithinjurylaw.com'
    },
    feeStructure: 'Contingency fee (no upfront cost).'
  }
};

module.exports = clientConfigs;
