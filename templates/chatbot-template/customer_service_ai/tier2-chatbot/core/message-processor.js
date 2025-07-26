console.log('📦 Loading message-processor.js...');

const realEstateProcessor = {
  processRealEstateMessage(message, sessionData, config) {
    console.log('\n🏠 ==> REAL ESTATE PROCESSOR CALLED <==');
    console.log('📨 Message:', message);
    console.log('📊 Current stage:', sessionData.conversation_stage);
    console.log('📋 Lead data:', JSON.stringify(sessionData.lead_data || {}, null, 2));
    const lowerMessage = message.toLowerCase();
    if (!sessionData.conversation_stage) {
      console.log('🆕 Initializing new session state');
      sessionData.conversation_stage = 'initial';
      sessionData.lead_data = {};
      sessionData.lead_score = 0;
    }
    const currentStage = sessionData.conversation_stage;
    console.log('📍 Processing stage:', currentStage);
    switch (currentStage) {
      case 'initial':
        console.log('🎯 Initial stage - checking intent');
        return this.handleInitialMessage(lowerMessage, sessionData, config);
      case 'buyer_budget':
        console.log('💰 Budget stage - processing budget input');
        return this.handleBuyerBudget(message, sessionData, config);
      case 'buyer_timeline':
        console.log('⏰ Timeline stage - processing timeline input');
        return this.handleBuyerTimeline(message, sessionData, config);
      case 'buyer_preferences':
        console.log('🏘️ Preferences stage - processing property type');
        return this.handleBuyerPreferences(message, sessionData, config);
      case 'buyer_location':
        console.log('📍 Location stage - processing area preference');
        return this.handleBuyerLocation(message, sessionData, config);
      case 'buyer_contact':
        console.log('📞 Contact stage - processing contact info');
        return this.handleBuyerContact(message, sessionData, config);
      default:
        console.log('⚠️ Unknown stage, resetting to initial');
        sessionData.conversation_stage = 'initial';
        return this.handleInitialMessage(lowerMessage, sessionData, config);
    }
  },
  handleInitialMessage(lowerMessage, sessionData, config) {
    console.log('🔍 Analyzing intent for message:', lowerMessage);
    const buyerKeywords = [
      'buy', 'buying', 'purchase', 'home', 'house', 'property',
      'show', 'available', 'properties', 'listings', 'viewing',
      'schedule', 'see', 'tour', 'visit', 'looking'
    ];
    const isBuyer = buyerKeywords.some(keyword => lowerMessage.includes(keyword));
    if (isBuyer) {
      console.log('🏠 BUYER INTENT DETECTED - Starting buyer flow');
      return this.startBuyerFlow(sessionData, config);
    }
    const sellerKeywords = ['sell', 'selling', 'list', 'listing', 'market value', 'appraisal'];
    const isSeller = sellerKeywords.some(keyword => lowerMessage.includes(keyword));
    if (isSeller) {
      console.log('🏡 SELLER INTENT DETECTED - Starting seller flow');
      return this.startSellerFlow(sessionData, config);
    }
    const marketKeywords = ['market', 'prices', 'trends', 'conditions', 'values'];
    const isMarketInfo = marketKeywords.some(keyword => lowerMessage.includes(keyword));
    if (isMarketInfo) {
      console.log('📊 MARKET INFO REQUEST');
      return this.handleMarketInfo(sessionData, config);
    }
    console.log('❓ No specific intent detected - showing general options');
    return {
      response: "Hi! I'm here to help with all your real estate needs. Are you looking to buy or sell a property?",
      options: ["I want to buy", "I want to sell", "Market information", "Speak to an agent"]
    };
  },
  startBuyerFlow(sessionData, config) {
    console.log('🚀 STARTING BUYER QUALIFICATION FLOW');
    sessionData.conversation_stage = 'buyer_budget';
    sessionData.lead_data = { intent: 'buying' };
    sessionData.lead_score = 0;
    return {
      response: "Great! I'd love to help you find the perfect home. To get started, what's your budget range?",
      options: ["Under $200k", "$200k-$400k", "$400k-$600k", "$600k-$800k", "$800k-$1M", "Over $1M"]
    };
  },
  handleBuyerBudget(message, sessionData, config) {
    console.log('💰 Processing budget input:', message);
    const budget = this.extractBudget(message);
    const budgetScore = this.calculateBudgetScore(budget);
    sessionData.lead_data.budget = budget;
    sessionData.lead_score += budgetScore;
    sessionData.conversation_stage = 'buyer_timeline';
    console.log('💰 Budget set:', budget, 'Score added:', budgetScore, 'Total score:', sessionData.lead_score);
    return {
      response: `Perfect! With a budget of ${budget}, you have excellent options. When are you looking to purchase?`,
      options: ["Immediately", "1-3 months", "3-6 months", "6-12 months", "Just browsing"]
    };
  },
  handleBuyerTimeline(message, sessionData, config) {
    console.log('⏰ Processing timeline input:', message);
    const timeline = this.extractTimeline(message);
    const timelineScore = this.calculateTimelineScore(timeline);
    sessionData.lead_data.timeline = timeline;
    sessionData.lead_score += timelineScore;
    sessionData.conversation_stage = 'buyer_preferences';
    console.log('⏰ Timeline set:', timeline, 'Score added:', timelineScore, 'Total score:', sessionData.lead_score);
    return {
      response: "Excellent timing! What type of property interests you most?",
      options: ["Single family home", "Condo/Townhouse", "Luxury property", "Investment property", "Commercial"]
    };
  },
  handleBuyerPreferences(message, sessionData, config) {
    console.log('🏘️ Processing property preferences:', message);
    sessionData.lead_data.property_type = message;
    sessionData.conversation_stage = 'buyer_location';
    return {
      response: "Great choice! Which areas are you most interested in?",
      options: ["Downtown", "Westside", "Suburbs", "Eastside", "Business District", "Show me all areas"]
    };
  },
  handleBuyerLocation(message, sessionData, config) {
    console.log('📍 Processing location preferences:', message);
    sessionData.lead_data.preferred_area = message;
    sessionData.conversation_stage = 'buyer_contact';
    return {
      response: "Perfect! I have several properties that match your criteria. To send you personalized listings, may I get your contact information?",
      collect_contact: true
    };
  },
  handleBuyerContact(message, sessionData, config) {
    console.log('📞 Processing contact information:', message);
    if (this.isValidContact(message)) {
      const contactInfo = this.extractContact(message);
      const leadQuality = this.classifyLead(sessionData.lead_score);
      sessionData.lead_data.contact = contactInfo;
      console.log('✅ LEAD CAPTURED!');
      console.log('📊 Final score:', sessionData.lead_score);
      console.log('🏆 Lead quality:', leadQuality);
      console.log('📋 Complete lead data:', JSON.stringify(sessionData.lead_data, null, 2));
      const agent = this.getDefaultAgent();
      return {
        response: `Thank you! I've matched you with ${agent.name}, our specialist in ${sessionData.lead_data.preferred_area} ${sessionData.lead_data.property_type.toLowerCase()}s. ${agent.name} will contact you within 2 hours with personalized listings. You can also reach them directly at ${agent.phone}.`,
        lead_captured: true,
        agent_info: agent
      };
    } else {
      console.log('❌ Invalid contact format, asking again');
      return {
        response: "I'd be happy to help! Could you please provide your email or phone number so our agent can send you matching properties?"
      };
    }
  },
  startSellerFlow(sessionData, config) {
    console.log('🚀 STARTING SELLER FLOW');
    sessionData.conversation_stage = 'seller_property';
    sessionData.lead_data = { intent: 'selling' };
    sessionData.lead_score = 0;
    return {
      response: "I'd be happy to help you sell your property! What type of property are you looking to sell?",
      options: ["Single family home", "Condo/Townhouse", "Commercial property", "Investment property", "Land"]
    };
  },
  handleMarketInfo(sessionData, config) {
    const marketData = config.market_data || {};
    return {
      response: `Current market conditions: The average home price is ${marketData.average_home_price || '$485,000'} with ${marketData.market_trend || 'steady growth'} trends. Market inventory is ${marketData.inventory_level || 'balanced'} with homes selling in an average of ${marketData.days_on_market || '28'} days. Would you like specific information about buying or selling in this market?`,
      options: ["I'm looking to buy", "I'm looking to sell", "Tell me about specific neighborhoods"]
    };
  },
  extractBudget(message) {
    const lowerMessage = message.toLowerCase().replace(/[,$\s]/g, '');
    if (lowerMessage.includes('under') || lowerMessage.includes('200k')) return 'Under $200k';
    if (lowerMessage.includes('200') && lowerMessage.includes('400')) return '$200k-$400k';
    if (lowerMessage.includes('400') && lowerMessage.includes('600')) return '$400k-$600k';
    if (lowerMessage.includes('600') && lowerMessage.includes('800')) return '$600k-$800k';
    if (lowerMessage.includes('800') || lowerMessage.includes('1m')) return '$800k-$1M';
    if (lowerMessage.includes('over')) return 'Over $1M';
    return 'Under $200k';
  },
  extractTimeline(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('immediately') || lowerMessage.includes('asap')) return 'Immediately';
    if (lowerMessage.includes('1-3') || lowerMessage.includes('1') || lowerMessage.includes('soon')) return '1-3 months';
    if (lowerMessage.includes('3-6') || lowerMessage.includes('3')) return '3-6 months';
    if (lowerMessage.includes('6') || lowerMessage.includes('12')) return '6-12 months';
    return 'Just browsing';
  },
  calculateBudgetScore(budget) {
    const scores = {
      'Under $200k': 5,
      '$200k-$400k': 15,
      '$400k-$600k': 25,
      '$600k-$800k': 30,
      '$800k-$1M': 35,
      'Over $1M': 40
    };
    return scores[budget] || 5;
  },
  calculateTimelineScore(timeline) {
    const scores = {
      'Immediately': 40,
      '1-3 months': 30,
      '3-6 months': 20,
      '6-12 months': 10,
      'Just browsing': 5
    };
    return scores[timeline] || 5;
  },
  classifyLead(score) {
    if (score >= 60) return 'hot';
    if (score >= 35) return 'warm';
    return 'cold';
  },
  isValidContact(message) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /[\d\s\-\(\)]{10,}/;
    return emailRegex.test(message) || phoneRegex.test(message);
  },
  extractContact(message) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /[\d\s\-\(\)]{10,}/;
    const email = message.match(emailRegex);
    const phone = message.match(phoneRegex);
    return {
      email: email ? email[0] : null,
      phone: phone ? phone[0].replace(/\D/g, '') : null
    };
  },
  getDefaultAgent() {
    return {
      id: 'sarah_johnson',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@dreamhomesrealty.com'
    };
  }
};

const { EcommerceProcessor } = require('./processors/ecommerce-processor');

async function processMessage(message, sessionData, clientConfig) {
  console.log('\n🔧 ==> MAIN PROCESSOR ENTRY POINT <==');
  console.log('📋 Client:', clientConfig.client_id || 'unknown');
  console.log('🏷️ Industry:', clientConfig.industry || clientConfig.business_type || 'unknown');
  console.log('📨 Message:', message);
  console.log('📊 Current stage:', sessionData.conversation_stage || 'none');
  if (clientConfig.industry === 'real_estate' || clientConfig.business_type === 'real_estate') {
    console.log('🏠 Routing to REAL ESTATE processor');
    const result = realEstateProcessor.processRealEstateMessage(message, sessionData, clientConfig);
    console.log('✅ Real estate processor result:', JSON.stringify(result, null, 2));
    return result;
  }
  if (clientConfig.industry === 'ecommerce' || clientConfig.business_type === 'ecommerce') {
    console.log('🛒 Routing to ECOMMERCE processor');
    const ecommerceProcessor = new EcommerceProcessor(clientConfig);
    return await ecommerceProcessor.processMessage(message, sessionData);
  }
  console.log('⚠️ Using FALLBACK processor (no real estate or ecommerce match)');
  return {
    response: "I'm here to help! How can I assist you today?",
    options: ["Get started", "Learn more", "Contact us"]
  };
}

console.log('✅ Message processor loaded successfully');
console.log('📦 Exported functions:', Object.keys({ processMessage, realEstateProcessor }));

module.exports = {
  processMessage,
  realEstateProcessor
};
