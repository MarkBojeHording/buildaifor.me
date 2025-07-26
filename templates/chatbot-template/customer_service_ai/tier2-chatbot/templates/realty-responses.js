/**
 * Real Estate Response Templates
 * Comprehensive response templates for real estate chatbot interactions
 */

const realtyResponses = {
  welcome: {
    message: "Hi! Welcome to Dream Homes Realty! 🏠 I'm here to help you with your real estate needs.",
    quick_replies: [
      { text: "Buy a Home", payload: "buyer_flow" },
      { text: "Sell My Home", payload: "seller_flow" },
      { text: "Market Info", payload: "market_info" },
      { text: "Speak to Agent", payload: "agent_contact" }
    ]
  },

  buyer_qualification: {
    budget: {
      message: "Great! I'd love to help you find your perfect home. What's your budget range?",
      quick_replies: [
        { text: "Under $200k", payload: "budget_under_200k" },
        { text: "$200k-400k", payload: "budget_200k_400k" },
        { text: "$400k-600k", payload: "budget_400k_600k" },
        { text: "$600k+", payload: "budget_600k_plus" },
        { text: "Cash Buyer", payload: "budget_cash" }
      ]
    },
    location: {
      message: "Perfect! Which area interests you most?",
      quick_replies: [
        { text: "Downtown", payload: "location_downtown" },
        { text: "Suburbs", payload: "location_suburbs" },
        { text: "Waterfront", payload: "location_waterfront" },
        { text: "Near Schools", payload: "location_schools" },
        { text: "No Preference", payload: "location_flexible" }
      ]
    },
    property_type: {
      message: "What type of property are you looking for?",
      quick_replies: [
        { text: "Single Family", payload: "type_single_family" },
        { text: "Condo", payload: "type_condo" },
        { text: "Townhouse", payload: "type_townhouse" },
        { text: "Multi-Family", payload: "type_multi_family" }
      ]
    },
    bedrooms: {
      message: "How many bedrooms do you need?",
      quick_replies: [
        { text: "1-2 Bedrooms", payload: "bedrooms_1_2" },
        { text: "3 Bedrooms", payload: "bedrooms_3" },
        { text: "4+ Bedrooms", payload: "bedrooms_4_plus" },
        { text: "Flexible", payload: "bedrooms_flexible" }
      ]
    },
    timeline: {
      message: "What's your timeline for purchasing?",
      quick_replies: [
        { text: "Ready Now", payload: "timeline_ready_now" },
        { text: "Next 3 Months", payload: "timeline_3_months" },
        { text: "3-6 Months", payload: "timeline_6_months" },
        { text: "Just Exploring", payload: "timeline_exploring" }
      ]
    }
  },

  seller_qualification: {
    property_details: {
      message: "I'd be happy to help you sell your home! Tell me about your property.",
      quick_replies: [
        { text: "Single Family", payload: "sell_single_family" },
        { text: "Condo", payload: "sell_condo" },
        { text: "Townhouse", payload: "sell_townhouse" },
        { text: "Investment Property", payload: "sell_investment" }
      ]
    }
  },

  market_info: {
    downtown: "Downtown properties are averaging $450-650k. Great walkability, restaurants, and public transit access. Market is competitive with homes selling in 15-20 days.",
    suburbs: "Suburban family homes range from $350-550k. Excellent schools, larger lots, family-friendly neighborhoods. Average time on market is 25-30 days.",
    waterfront: "Waterfront properties start around $700k. Premium locations with water access and views. These are specialty properties that may take 45-60 days to sell."
  },

  agent_matching: {
    downtown: "I'd recommend Sarah Johnson, our downtown specialist. She knows the urban market inside and out!",
    suburbs: "Mike Chen would be perfect for you! He specializes in suburban family homes and school districts.",
    luxury: "Lisa Rodriguez handles our luxury and waterfront properties. She's the expert for high-end transactions."
  },

  business_hours: {
    during_hours: "Our agents are available right now! Let me connect you immediately.",
    after_hours: "We're currently closed, but I can have an agent call you first thing tomorrow morning!",
    weekend: "Our weekend team is available! Someone will contact you within 2 hours."
  },

  lead_capture: {
    contact_form: {
      message: "I'd love to connect you with the right agent. Could you share your contact information?",
      fields: [
        { name: "name", label: "Full Name", required: true },
        { name: "phone", label: "Phone Number", required: true },
        { name: "email", label: "Email Address", required: true },
        { name: "preferred_contact", label: "Preferred Contact Method", options: ["Phone", "Email", "Text"] }
      ]
    }
  }
};

module.exports = realtyResponses;
