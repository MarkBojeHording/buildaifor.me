/**
 * E-commerce Response Templates
 * Comprehensive response templates for e-commerce chatbot interactions
 */

const ecommerceResponses = {
  // Basic Information
  greeting: {
    pattern: "hello|hi|hey|good morning|good afternoon|good evening",
    response: "🛍️ Hello! Welcome to {business_name}. I'm here to help you with product information, order status, and customer support. How can I assist you today?"
  },

  // Customer Support Hours
  hours: {
    pattern: "hours|open|time|support|when are you open",
    response: "🕒 Customer Support Hours:\n\n• Monday-Friday: 8:00 AM - 8:00 PM EST\n• Saturday: 9:00 AM - 6:00 PM EST\n• Sunday: 10:00 AM - 4:00 PM EST\n\nLive chat available during business hours!"
  },

  // Product Categories
  products: {
    pattern: "products|items|catalog|what do you sell|categories",
    response: "🛍️ Popular Categories:\n\n• Laptops & Computers\n• Smartphones & Tablets\n• Audio & Headphones\n• Gaming & Accessories\n• Smart Home Devices\n• Wearables & Fitness\n\nWhat type of product are you looking for?"
  },

  // Laptops and Computers
  laptops: {
    pattern: "laptop|computer|pc|macbook|desktop|notebook",
    response: "💻 Laptops & Computers:\n\n• Gaming Laptops: $800 - $2,500\n• Business Laptops: $600 - $1,500\n• Student Laptops: $400 - $800\n• Desktop PCs: $500 - $3,000\n• MacBooks: $999 - $3,499\n\nAll come with 1-year warranty and free shipping!"
  },

  // Smartphones and Tablets
  phones: {
    pattern: "phone|smartphone|mobile|iphone|android|tablet|ipad",
    response: "📱 Smartphones & Tablets:\n\n• Latest iPhones: $699 - $1,199\n• Samsung Galaxy: $599 - $1,199\n• Google Pixel: $449 - $899\n• Tablets: $199 - $1,099\n• Accessories included\n\nTrade-in programs available for old devices!"
  },

  // Audio and Headphones
  audio: {
    pattern: "audio|headphones|speakers|earbuds|bluetooth|sound",
    response: "🎧 Audio & Headphones:\n\n• Wireless Headphones: $50 - $350\n• Gaming Headsets: $30 - $200\n• Bluetooth Speakers: $25 - $300\n• Earbuds: $20 - $250\n• Home Audio Systems: $100 - $1,000\n\nPremium sound quality guaranteed!"
  },

  // Gaming and Accessories
  gaming: {
    pattern: "gaming|console|accessories|controller|mouse|keyboard",
    response: "🎮 Gaming & Accessories:\n\n• Gaming Consoles: $299 - $499\n• Controllers: $30 - $180\n• Gaming Mice: $25 - $150\n• Mechanical Keyboards: $50 - $200\n• Gaming Chairs: $100 - $500\n\nLevel up your gaming setup!"
  },

  // Smart Home Devices
  smart_home: {
    pattern: "smart home|smart|automation|alexa|google home|nest",
    response: "🏠 Smart Home Devices:\n\n• Smart Speakers: $50 - $300\n• Security Cameras: $30 - $200\n• Smart Thermostats: $100 - $250\n• Smart Lights: $15 - $100\n• Smart Locks: $100 - $300\n\nMake your home smarter and more secure!"
  },

  // Wearables and Fitness
  wearables: {
    pattern: "wearable|fitness|watch|tracker|apple watch|fitbit",
    response: "⌚ Wearables & Fitness:\n\n• Smartwatches: $100 - $500\n• Fitness Trackers: $30 - $200\n• Health Monitors: $50 - $300\n• Sports Watches: $150 - $600\n• Activity Bands: $20 - $150\n\nTrack your health and stay active!"
  },

  // Order and Shipping
  order: {
    pattern: "order|tracking|shipping|delivery|when will it arrive",
    response: "📦 Order & Shipping:\n\n• Free shipping on orders over $50\n• 2-3 business days delivery\n• Order tracking available\n• 30-day return policy\n• Express shipping options\n\nTrack your order at {website}/track"
  },

  // Returns and Warranty
  returns: {
    pattern: "return|refund|warranty|broken|defective|not working",
    response: "🔄 Returns & Warranty:\n\n• 30-day money-back guarantee\n• 1-year manufacturer warranty\n• Free return shipping\n• Easy online return process\n• Extended warranty options\n\nCustomer satisfaction guaranteed!"
  },

  // Payment and Security
  payment: {
    pattern: "payment|checkout|secure|credit card|paypal|apple pay",
    response: "💳 Payment & Security:\n\n• All major credit cards accepted\n• PayPal and Apple Pay\n• 256-bit SSL encryption\n• PCI DSS compliant\n• Buy now, pay later options\n\nYour payment information is secure!"
  },

  // Discounts and Promotions
  discounts: {
    pattern: "discount|sale|coupon|promo|deal|offer|save",
    response: "💰 Current Offers:\n\n• 10% off first order: WELCOME10\n• Free shipping: FREESHIP\n• Student discount: 15% off\n• Military discount: 10% off\n• Bundle deals available\n\nCheck our website for more deals!"
  },

  // Product Recommendations
  recommendations: {
    pattern: "recommend|suggestion|best|popular|trending|what should i get",
    response: "⭐ Popular Recommendations:\n\n• Best Budget Laptop: Dell Inspiron ($599)\n• Top Gaming Headset: HyperX Cloud II ($99)\n• Best Smartphone: iPhone 15 ($799)\n• Popular Smart Speaker: Echo Dot ($49)\n\nWhat's your budget and use case?"
  },

  // Product Comparison
  comparison: {
    pattern: "compare|vs|difference|which is better|pros and cons",
    response: "⚖️ Product Comparison:\n\nI can help you compare:\n• Different laptop models\n• Smartphone features\n• Audio equipment specs\n• Gaming accessories\n\nWhat specific products would you like to compare?"
  },

  // Technical Support
  tech_support: {
    pattern: "technical|support|help|problem|issue|troubleshoot",
    response: "🔧 Technical Support:\n\n• Online troubleshooting guides\n• Video tutorials available\n• Live chat support\n• Phone support during business hours\n• Email support: support@techgear.com\n\nWhat technical issue are you experiencing?"
  },

  // Product Availability
  availability: {
    pattern: "available|in stock|out of stock|when available|backorder",
    response: "📋 Product Availability:\n\n• Real-time inventory updates\n• Backorder notifications\n• Restock alerts\n• Alternative product suggestions\n• Pre-order options for new releases\n\nWhat specific product are you looking for?"
  },

  // Price Matching
  price_match: {
    pattern: "price match|competitor|cheaper|lower price|match price",
    response: "💰 Price Matching:\n\n• We match competitor prices\n• 30-day price guarantee\n• Automatic refund if price drops\n• Best price guarantee\n• Loyalty program discounts\n\nFound a better price? Let us know!"
  },

  // Gift Cards
  gift_cards: {
    pattern: "gift card|gift certificate|voucher|present|gift",
    response: "🎁 Gift Cards:\n\n• Digital gift cards available\n• Physical gift cards shipped\n• Custom amounts: $10 - $500\n• No expiration date\n• Perfect for any occasion\n\nGive the gift of technology!"
  },

  // Loyalty Program
  loyalty: {
    pattern: "loyalty|rewards|points|member|program|benefits",
    response: "🎯 Loyalty Program:\n\n• Earn points on every purchase\n• Exclusive member discounts\n• Early access to sales\n• Free shipping for members\n• Birthday rewards\n\nJoin our loyalty program for exclusive benefits!"
  },

  // Bulk Orders
  bulk: {
    pattern: "bulk|wholesale|business|corporate|multiple|quantity",
    response: "🏢 Bulk & Business Orders:\n\n• Corporate pricing available\n• Volume discounts\n• Business account setup\n• Tax-exempt purchases\n• Dedicated account manager\n\nContact our business team for bulk pricing!"
  },

  // International Shipping
  international: {
    pattern: "international|shipping|overseas|global|worldwide|country",
    response: "🌍 International Shipping:\n\n• Shipping to 50+ countries\n• Customs documentation included\n• International warranty coverage\n• Multi-language support\n• Currency conversion available\n\nWhere would you like us to ship?"
  },

  // Product Reviews
  reviews: {
    pattern: "review|rating|feedback|opinion|experience|testimonial",
    response: "⭐ Product Reviews:\n\n• Customer reviews on all products\n• Verified purchase badges\n• Photo and video reviews\n• Rating system: 1-5 stars\n• Detailed feedback\n\nRead authentic customer experiences!"
  },

  // New Products
  new_products: {
    pattern: "new|latest|recent|just released|new arrival|latest model",
    response: "🆕 New Arrivals:\n\n• Latest iPhone 15 series\n• New gaming laptops\n• Updated smart home devices\n• Latest wireless headphones\n• New fitness trackers\n\nBe the first to get the newest tech!"
  },

  // Contact Information
  contact: {
    pattern: "contact|call|email|reach|speak|talk|customer service",
    response: "📞 Contact Information:\n\n• Phone: {phone}\n• Email: {email}\n• Website: {website}\n• Live chat available\n• Social media support\n\nOur customer service team is here to help!"
  },

  // Urgent Support
  urgent: {
    pattern: "urgent|emergency|immediately|asap|critical|broken",
    response: "🚨 Urgent Support:\n\n• Priority support for urgent issues\n• Emergency replacement options\n• 24/7 technical support\n• Same-day shipping for critical orders\n• Immediate troubleshooting\n\nCall {phone} for urgent assistance!"
  },

  // Mobile App
  mobile_app: {
    pattern: "app|mobile|ios|android|download|application",
    response: "📱 Mobile App:\n\n• iOS and Android apps available\n• Easy ordering and tracking\n• Push notifications for deals\n• Barcode scanning\n• Mobile-exclusive offers\n\nDownload our app for the best experience!"
  }
};

module.exports = ecommerceResponses;
