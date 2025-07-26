const { DiscountEngine } = require('./discount-engine');
const { ProductMatcher } = require('./product-matcher');

class EcommerceProcessor {
  constructor(config) {
    this.config = config;
    this.responses = config.responses || {};
    this.products = config.products || [];
    this.categories = config.categories || [];
    this.discountEngine = new DiscountEngine(config.promotions || {});
    this.productMatcher = new ProductMatcher(this.products, this.categories);
    // this.orderManager = new OrderManager(config.orderSettings || {}); // Stub for now
  }

  async processMessage(message, sessionData = {}) {
    console.log('🛍️ EcommerceProcessor.processMessage INVOKED');
    const userMessage = message.toLowerCase().trim();
    const intent = this.detectIntent(userMessage);

    console.log(`🛍️ Ecommerce Intent: ${intent.type} (confidence: ${intent.confidence})`);

    // Update session with conversation context
    const updatedSession = {
      ...sessionData,
      lastIntent: intent.type,
      conversationStage: this.determineStage ? this.determineStage(intent, sessionData) : undefined,
      searchHistory: sessionData.searchHistory || [],
      userPreferences: sessionData.userPreferences || {}
    };

    let result;

    switch (intent.type) {
      case 'PRODUCT_SEARCH':
        result = await this.handleProductSearch(userMessage, intent.entities, updatedSession);
        break;
      case 'CATEGORY_BROWSE':
        result = await this.handleCategoryBrowse(userMessage, intent.entities, updatedSession);
        break;
      case 'DISCOUNT_INQUIRY':
        result = await this.discountEngine.handleDiscountInquiry(userMessage, updatedSession);
        break;
      case 'GREETING':
        result = this.handleGreeting(updatedSession);
        break;
      default:
        result = this.handleFallback(userMessage, updatedSession);
    }

    return {
      ...result,
      sessionData: {
        ...updatedSession,
        lastResponse: result.response,
        timestamp: Date.now()
      }
    };
  }

  detectIntent(message) {
    const intents = [
      {
        type: 'PRODUCT_SEARCH',
        patterns: [
          /(?:looking for|find|search|show me|do you have|need|want)\s+(.+)/i,
          /(.+)\s+(?:available|in stock)/i,
          /where (?:can i find|is) (.+)/i
        ],
        keywords: ['looking for', 'find', 'search', 'show me', 'do you have', 'product', 'item', 'buy'],
        confidence: 0.8
      },
      {
        type: 'CATEGORY_BROWSE',
        patterns: [
          /(?:browse|shop|view|see)\s+(.+)\s+(?:category|section|department)/i,
          /show me (?:all |your )?(.+)\s+(?:products|items)/i
        ],
        keywords: ['category', 'section', 'department', 'browse', 'shop', 'view all', 'collection'],
        confidence: 0.7
      },
      {
        type: 'DISCOUNT_INQUIRY',
        patterns: [
          /(?:any |have )?(?:discounts?|coupons?|promos?|deals?|sales?)/i,
          /(?:coupon|promo) code/i,
          /cheaper|best price/i
        ],
        keywords: ['discount', 'coupon', 'promo', 'sale', 'deal', 'offer', 'cheap', 'code'],
        confidence: 0.7
      },
      {
        type: 'GREETING',
        patterns: [
          /^(?:hi|hello|hey|good (?:morning|afternoon|evening))/i,
          /^(?:help|assist)/i
        ],
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'help'],
        confidence: 0.6
      }
    ];
    // Try pattern matching first (higher confidence)
    for (const intent of intents) {
      if (intent.patterns) {
        for (const pattern of intent.patterns) {
          const match = message.match(pattern);
          if (match) {
            return {
              type: intent.type,
              confidence: intent.confidence + 0.1,
              matchedPattern: pattern.source,
              entities: this.extractEntities(message, intent.type, match),
              rawMatch: match
            };
          }
        }
      }
    }
    // Fallback to keyword matching
    for (const intent of intents) {
      const matches = intent.keywords.filter(keyword => message.includes(keyword));
      if (matches.length > 0) {
        return {
          type: intent.type,
          confidence: intent.confidence * (matches.length / intent.keywords.length),
          matchedKeywords: matches,
          entities: this.extractEntities(message, intent.type)
        };
      }
    }
    return { type: 'UNKNOWN', confidence: 0.1, entities: [] };
  }

  extractEntities(message, intentType, regexMatch = null) {
    const entities = [];
    // Use regex capture groups first
    if (regexMatch && regexMatch.length > 1) {
      for (let i = 1; i < regexMatch.length; i++) {
        if (regexMatch[i]) {
          entities.push({
            type: this.getEntityType(intentType, i),
            value: regexMatch[i].trim(),
            confidence: 0.9
          });
        }
      }
    }
    // Extract product names
    if (['PRODUCT_SEARCH'].includes(intentType)) {
      this.products.forEach(product => {
        const productName = product.name.toLowerCase();
        if (message.includes(productName)) {
          entities.push({
            type: 'PRODUCT',
            value: product.name,
            id: product.id,
            confidence: 0.8
          });
        }
      });
    }
    // Extract categories
    if (['CATEGORY_BROWSE', 'PRODUCT_SEARCH'].includes(intentType)) {
      this.categories.forEach(category => {
        if (message.includes(category.toLowerCase())) {
          entities.push({
            type: 'CATEGORY',
            value: category,
            confidence: 0.7
          });
        }
      });
    }
    return entities;
  }

  getEntityType(intentType, position) {
    const entityMappings = {
      'PRODUCT_SEARCH': ['PRODUCT'],
      'CATEGORY_BROWSE': ['CATEGORY']
    };
    const types = entityMappings[intentType] || ['GENERIC'];
    return types[position - 1] || 'GENERIC';
  }

  async handleProductSearch(message, entities, sessionData) {
    const foundProducts = await this.productMatcher.findProducts(entities, message);
    if (foundProducts.length > 0) {
      const product = foundProducts[0];
      return {
        response: `Great! I found "${product.name}" for you. ${product.description || ''} Would you like to see more details?`,
        suggestedActions: ['View Details', 'Check Price', 'Similar Products', 'Add to Cart'],
        productData: foundProducts.slice(0, 3),
        confidence: 0.9
      };
    }
    return {
      response: this.getResponse('product_search') || "I'd be happy to help you find products! Could you be more specific about what you're looking for?",
      suggestedActions: ['Browse Categories', 'View Bestsellers', 'Popular Items'],
      confidence: 0.6
    };
  }

  async handleCategoryBrowse(message, entities, sessionData) {
    const category = entities.find(e => e.type === 'CATEGORY');
    if (category) {
      const categoryProducts = await this.productMatcher.getProductsByCategory(category.value);
      return {
        response: `Here are our ${category.value} products! We have ${categoryProducts.length} items in this category.`,
        suggestedActions: ['View All', 'Filter by Price', 'Sort by Rating', 'Best Sellers'],
        categoryData: {
          name: category.value,
          count: categoryProducts.length,
          featured: categoryProducts.slice(0, 4)
        },
        confidence: 0.8
      };
    }
    return {
      response: this.getResponse('categories') || "Here are our main categories. Which one interests you?",
      suggestedActions: this.categories.slice(0, 4) || ['Electronics', 'Clothing', 'Books', 'Home'],
      confidence: 0.7
    };
  }

  getResponse(key) {
    const responseData = this.responses[key];
    if (!responseData) {
      console.log(`⚠️ No response found for key: ${key}`);
      return null;
    }
    if (typeof responseData === 'string') {
      return responseData;
    }
    return responseData.response || responseData.text || responseData;
  }

  handleGreeting(sessionData) {
    return {
      response: this.getResponse('greeting') || "Welcome! How can I help you today?",
      confidence: 0.7
    };
  }

  handleFallback(message, sessionData) {
    // Enhanced fallback with keyword matching from config
    for (const [key, responseData] of Object.entries(this.responses)) {
      const response = typeof responseData === 'string' ? responseData : responseData.response;
      const keywords = responseData.keywords || [key];
      const hasMatch = keywords.some(keyword =>
        message.includes(keyword.toLowerCase())
      );
      if (hasMatch) {
        return {
          response: response,
          confidence: 0.5,
          matchedPattern: key,
          suggestedActions: responseData.suggestions || []
        };
      }
    }
    return {
      response: this.getResponse('fallback') || "I'm here to help with your shopping needs! You can ask me about products, orders, shipping, returns, or anything else.",
      suggestedActions: ['Browse Products', 'Check Orders', 'Contact Support', 'View Deals'],
      confidence: 0.1
    };
  }
}

module.exports = { EcommerceProcessor };
