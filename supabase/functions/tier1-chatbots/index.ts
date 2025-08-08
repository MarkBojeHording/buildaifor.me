import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Types
interface ChatRequest {
  message: string
  config: { client_id: string }
  conversation_id?: string
}

interface ChatResponse {
  response: string
  confidence: number
  booking_created: boolean
}

interface ClientConfig {
  client_id?: string
  business_name: string
  contact: {
    phone: string
    email?: string
    website?: string
    address?: string
  }
  industry: string
  fallback_response?: string
  fallback?: string
  services?: string
  hours?: string
  responses: Record<string, string>
  widget_settings?: {
    primary_color?: string
    title?: string
  }
}

// Embedded client configurations (migrated from JSON files)
const CLIENT_CONFIGS: Record<string, ClientConfig> = {
  "demo-dental": {
    client_id: "demo-dental",
    business_name: "ABC Dental Office",
    contact: {
      phone: "(555) 123-4567",
      email: "info@abcdental.com",
      website: "www.abcdental.com"
    },
    industry: "dental",
    fallback_response: "I don't have that information, but our staff can help!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor medical questions, please speak with our professionals directly.\n\nI can help with appointments, hours, services, or insurance questions though!",
    services: "cleanings, exams, fillings, emergency care",
    hours: "Mon-Fri 8AM-5PM, Sat 9AM-2PM",
    responses: {
      "juicebox|cake|snack|food|drink|glass of water|eat|after appointment|after visit": "🦷 Post-Appointment Snacks & Drinks:\n\n• It's best to avoid sugary snacks like juice boxes and cake right after your dental visit.\n• Choose water or milk instead of sugary drinks.\n• If you're hungry, soft foods like yogurt, applesauce, or a banana are gentle on your teeth.\n\nRemember: Drinking water is always a great choice for your smile! 😊",
      "hours|open|time|days": "🕒 Our hours are Mon-Fri 8AM-5PM, Sat 9AM-2PM.",
      "services|offer|best": "🌟 Our best services include cleanings, exams, fillings, and emergency care!",
      "appointment|book|booking|schedule": "📅 You can book an appointment during our open hours: Mon-Fri 8AM-5PM, Sat 9AM-2PM. Call us at (555) 123-4567 or use our website!",
      "address|location|where": "📍 Our Address:\n\n123 Main Street\nCity, State 12345\n\nCall us at (555) 123-4567 if you need directions!",
      "insurance": "📝 We accept most major insurance plans. Please call us to confirm your coverage!"
    }
  },

  "demo-restaurant": {
    business_name: "Bella Vista Restaurant",
    contact: {
      phone: "(555) 123-4567",
      email: "info@bellavista.com",
      address: "456 Main Street, Downtown",
      website: "www.bellavista.com"
    },
    industry: "restaurant",
    fallback_response: "I don't have details on that, but our team does!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor special requests or detailed questions, our staff is here to help!\n\nI can help with our menu, hours, delivery, or reservations though!",
    responses: {
      "hours|open|time|when are you open": "🕒 Bella Vista Hours:\n\n• Monday-Thursday: 11AM-10PM\n• Friday-Saturday: 11AM-11PM\n• Sunday: 12PM-9PM\n\nWe're open for lunch and dinner daily!",
      "menu|food|dishes|what do you serve": "🍽️ Our Menu Highlights:\n\n• Appetizers: Bruschetta, Calamari, Caprese Salad\n• Pasta: Fettuccine Alfredo, Spaghetti Carbonara, Lasagna\n• Entrees: Chicken Marsala, Salmon Piccata, Beef Tenderloin\n• Desserts: Tiramisu, Cannoli, Gelato\n\nFull menu available on our website!",
      "reservation|book|table|reserve": "📅 Reservations:\n\n• Call us at (555) 123-4567\n• Online booking available\n• Groups of 6+ require 24-hour notice\n• Walk-ins welcome for smaller parties\n\nWhat time and how many people?",
      "delivery|takeout|to go|pickup": "🚚 Takeout & Delivery:\n\n• Takeout: Available during all hours\n• Delivery: Through DoorDash & Uber Eats\n• Curbside Pickup: Call ahead for quick pickup\n• Catering: Available for events\n\nCall (555) 123-4567 to order!",
      "price|cost|expensive|cheap|budget": "💰 Price Range:\n\n• Appetizers: $8-15\n• Pasta Dishes: $16-24\n• Entrees: $22-38\n• Desserts: $8-12\n\nWe offer daily specials and happy hour deals!",
      "location|address|where are you": "📍 Bella Vista Location:\n\n456 Main Street, Downtown\nBetween 5th and 6th Avenue\nFree parking in rear lot\n10-minute walk from City Center\n\nEasy to find with plenty of parking!",
      "parking|car|drive": "🚗 Parking Options:\n\n• Free Parking: Available in rear lot\n• Street Parking: Available on Main Street\n• Valet: Available Friday-Saturday evenings\n• Public Transit: Bus routes 15, 22, 45\n\nNo parking worries here!",
      "vegetarian|vegan|dietary|allergies": "🥬 Dietary Options:\n\n• Vegetarian: 8+ options including pasta and salads\n• Vegan: 4 dedicated vegan dishes\n• Gluten-Free: Available pasta and bread options\n• Allergies: We accommodate all dietary restrictions\n\nJust let us know your needs!",
      "wine|drinks|bar|alcohol": "🍷 Beverage Selection:\n\n• Wine: Extensive Italian and local wine list\n• Cocktails: House specialties and classics\n• Beer: Local craft beers and imports\n• Non-Alcoholic: Fresh juices, sodas, coffee\n\nHappy Hour: 4-6PM daily!",
      "hi|hello|hey|good morning|good afternoon": "👋 Welcome to Bella Vista Restaurant! We serve authentic Italian cuisine in a warm, family atmosphere. How can I help you today?",
      "contact|phone|call": "📞 Contact Bella Vista:\n\nPhone: (555) 123-4567\nEmail: info@bellavista.com\nWebsite: www.bellavista.com\nSocial: @bellavistarestaurant\n\nWe'd love to hear from you!"
    }
  },

  "demo-salon": {
    business_name: "Elegance Hair Salon",
    contact: {
      phone: "(555) 987-6543",
      email: "info@elegancesalon.com",
      address: "789 Beauty Lane, Shopping District",
      website: "www.elegancesalon.com"
    },
    industry: "salon",
    fallback_response: "I don't have that answer, but our stylists do!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor special requests, please contact our team directly.\n\nI can help with services, pricing, or appointments though!",
    responses: {
      "hours|open|time|when are you open": "🕒 Elegance Salon Hours:\n\n• Tuesday-Saturday: 9AM-8PM\n• Sunday: 10AM-6PM\n• Monday: Closed\n\nWe're here to make you beautiful!",
      "services|haircut|styling|what do you offer": "💇‍♀️ Our Services:\n\n• Haircuts: $35-75 (includes wash & style)\n• Color: $85-150 (highlights, balayage, full color)\n• Styling: $45-85 (blowout, updo, special occasion)\n• Treatments: $25-60 (deep conditioning, keratin)\n• Extensions: $200-500\n\nWhat service interests you?",
      "price|cost|how much|pricing": "💰 Service Pricing:\n\n• Women's Cut: $45-75\n• Men's Cut: $25-35\n• Color: $85-150\n• Highlights: $95-180\n• Styling: $45-85\n• Treatments: $25-60\n\nStudent and senior discounts available!",
      "appointment|book|schedule|reserve": "📅 Appointments:\n\n• Call us at (555) 987-6543\n• Online booking available\n• Walk-ins welcome (subject to availability)\n• 24-hour cancellation policy\n\nWhat service and when would you like to come in?",
      "stylists|hairdresser|who cuts hair": "👩‍🎨 Our Stylists:\n\n• Sarah: Master Colorist (15 years)\n• Mike: Cutting Specialist (12 years)\n• Emma: Styling Expert (8 years)\n• David: Men's Specialist (10 years)\n\nAll stylists are licensed and experienced!",
      "color|dye|highlights|balayage": "🎨 Color Services:\n\n• Full Color: $85-120\n• Highlights: $95-150\n• Balayage: $120-180\n• Root Touch-up: $65-85\n• Color Correction: $150-250\n\nFree consultation for all color services!",
      "location|address|where are you": "📍 Elegance Salon Location:\n\n789 Beauty Lane, Shopping District\nNext to the mall entrance\nFree parking in front\n5-minute walk from downtown\n\nEasy to find and plenty of parking!",
      "parking|car|drive": "🚗 Parking:\n\n• Free Parking: Available in front of salon\n• Mall Parking: Large lot available\n• Street Parking: Available on Beauty Lane\n• Accessibility: Wheelchair accessible entrance\n\nNo parking worries!",
      "products|shampoo|conditioner|buy": "🛍️ Retail Products:\n\n• Professional Shampoos: $15-35\n• Styling Products: $12-45\n• Hair Care: $18-60\n• Tools: $25-150\n\nWe carry top professional brands!",
      "bridal|wedding|special occasion": "👰 Special Occasion:\n\n• Bridal Styling: $85-150\n• Bridal Party: $65-95 per person\n• Updos: $45-85\n• Makeup: $45-75\n\nPerfect for your special day!",
      "hi|hello|hey|good morning|good afternoon": "👋 Welcome to Elegance Hair Salon! We're here to help you look and feel your best. How can I assist you today?",
      "contact|phone|call": "📞 Contact Elegance Salon:\n\nPhone: (555) 987-6543\nEmail: info@elegancesalon.com\nWebsite: www.elegancesalon.com\nSocial: @elegancesalon\n\nWe'd love to hear from you!"
    }
  },

  "demo-fitness": {
    business_name: "FitZone Studio",
    contact: {
      phone: "(555) FIT-ZONE",
      email: "info@fitzonestudio.com",
      address: "123 Fitness Ave, Your City",
      website: "www.fitzonestudio.com"
    },
    industry: "fitness",
    fallback_response: "I don't have that info, but our trainers do!\n\n📞 Contact us: {phone}\n🏋️ Stop by during our hours\n📝 Visit: {website}\n\nI can help with membership info, class schedules, or general questions though!",
    responses: {
      "hours|open|time": "🕒 We're open Monday-Sunday 6AM-10PM (EST)\n\nWe're here 7 days a week to fit your busy schedule!",
      "class schedule|class times|classes|schedule": "🗓️ Class Schedule:\nMon-Fri:\n- 6AM HIIT • 7AM Yoga • 6PM Spin\n\nSat:\n- 8AM Bootcamp, 10AM Pilates\n\nSun:\n- 9AM Zumba, 11AM Stretch & Recover\n\nWould you like to book a specific class?",
      "price|cost|membership|pricing|fees|rates": "💰 Membership Options:\n- Basic: $39/month (Gym access, group classes)\n- Premium: $79/month (Everything + 2 PT sessions)\n- Elite: $129/month (Unlimited everything)\n\nPersonal Training: $75/session\nFirst week is FREE! Ready to start?",
      "services|training|what do you offer|programs": "🏋️ Our Services:\n- Personal Training (1-on-1 coaching)\n- Group Fitness Classes (HIIT, Yoga, Spin)\n- Nutrition Consultations\n- Strength & Conditioning\n- Flexibility & Recovery Programs\n\nWhat interests you most?",
      "book|appointment|session|reserve": "📅 I'd love to help you book! We offer:\n- Personal Training: $75/session\n- Yoga Classes: Included with membership\n- Nutrition Consultation: $50/session\n\nWhat would you like to book? Or call us at (555) FIT-ZONE",
      "nutrition|diet|meal|eating": "🥗 Our certified nutritionists help with:\n- Personalized meal plans\n- Weight management strategies\n- Sports nutrition guidance\n- Supplement recommendations\n\nNutrition consultations are $50. Want to schedule one?",
      "personal training|trainer|pt": "🏋️ Personal Training at FitZone:\n- Certified trainers with 5+ years experience\n- Customized workout plans\n- Form correction and injury prevention\n- $75 per session, packages available\n\nReady to book your first session?",
      "yoga|stretching|flexibility": "🧘 Yoga at FitZone:\n- Beginner to Advanced levels\n- Morning & Evening classes\n- Hot Yoga, Vinyasa, Restorative\n- Included with all memberships\n\nCheck our class schedule or book a spot!",
      "hi|hello|hey|good morning|good afternoon": "👋 Welcome to FitZone Studio! I'm here to help you achieve your fitness goals. How can I assist you today?",
      "contact|phone|address|location": "📍 Contact FitZone Studio:\nPhone: (555) FIT-ZONE\nAddress: 123 Fitness Ave, Your City\nEmail: info@fitzonestudio.com\nText us for quick questions!"
    }
  }
}

// Default config for unknown clients
const DEFAULT_CONFIG: ClientConfig = {
  business_name: "Business",
  contact: {
    phone: "(555) 123-4567"
  },
  industry: "general",
  fallback_response: "Thank you for contacting us. Please call (555) 123-4567 for assistance.",
  responses: {
    "default": "Thank you for contacting us. Please call (555) 123-4567 for assistance."
  }
}

// Load client configuration
function loadClientConfig(clientId: string): ClientConfig {
  return CLIENT_CONFIGS[clientId] || DEFAULT_CONFIG
}

// Get fallback response with industry-specific templates
function getFallbackResponse(config: ClientConfig): string {
  const contact = config.contact
  const phone = contact.phone || "(555) 123-4567"
  const email = contact.email || "info@business.com"
  const website = contact.website || "www.business.com"
  const industry = config.industry?.toLowerCase() || "general"

  // Industry-specific fallback templates
  const industryFallbacks: Record<string, string> = {
    "dental": "I don't have that information, but our staff can help!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor medical questions, please speak with our professionals directly.\n\nI can help with appointments, hours, services, or insurance questions though!",
    "healthcare": "I don't have that information, but our staff can help!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor medical questions, please speak with our professionals directly.\n\nI can help with appointments, hours, services, or insurance questions though!",
    "restaurant": "I don't have details on that, but our team does!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor special requests or detailed questions, our staff is here to help!\n\nI can help with our menu, hours, delivery, or reservations though!",
    "fitness": "I don't have that info, but our trainers do!\n\n📞 Contact us: {phone}\n🏋️ Stop by during our hours\n📝 Visit: {website}\n\nI can help with membership info, class schedules, or general questions though!",
    "salon": "I don't have that answer, but our stylists do!\n\n📞 Call us: {phone}\n📝 Visit: {website}\n\nFor special requests, please contact our team directly.\n\nI can help with services, pricing, or appointments though!",
    "general": "I'm sorry, I don't have information about that specific question. Please contact us for help."
  }

  // Use config fallback if present, else industry, else default
  let fallback = config.fallback_response || config.fallback
  if (!fallback) {
    fallback = industryFallbacks[industry] || industryFallbacks.general
  }

  // Replace placeholders
  fallback = fallback
    .replace("{phone}", phone)
    .replace("{email}", email)
    .replace("{website}", website)

  return fallback
}

// Simple keyword matching (same logic as Python version)
function matchResponse(message: string, config: ClientConfig): string {
  const messageLower = message.toLowerCase()
  let responses: Record<string, string> = {}

  // Handle old complex structure with services, hours, etc.
  if (config.services && typeof config.services === "string") {
    // Convert old structure to simple keyword responses
    if (config.services) {
      responses["services|training|classes|workout"] = config.services
    }
    if (config.hours) {
      responses["hours|open|time|schedule"] = config.hours
    }
    if (config.contact) {
      const contact = config.contact
      responses["contact|phone|call"] = `Call us at ${contact.phone} for more information`
    }
  } else {
    // Use direct responses if they exist
    responses = config.responses || {}
  }

  // Check each response pattern
  for (const [keywords, response] of Object.entries(responses)) {
    // Split keywords by | for OR matching
    const keywordList = keywords.split("|").map(k => k.trim())

    // Check if any keyword matches
    for (const keyword of keywordList) {
      if (messageLower.includes(keyword.toLowerCase())) {
        return response
      }
    }
  }

  // No match found, return fallback
  return getFallbackResponse(config)
}

// Main chat endpoint
async function handleChat(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Get client ID from config
    const clientId = request.config?.client_id || "default"

    // Load client configuration
    const config = loadClientConfig(clientId)

    // Match response
    const responseText = matchResponse(request.message, config)

    // Simple confidence scoring
    const confidence = responseText.toLowerCase().includes("fallback") ? 0.3 : 0.9

    return {
      response: responseText,
      confidence,
      booking_created: false // Keep simple for Tier 1
    }
  } catch (error) {
    console.error("Error processing chat request:", error)
    throw new Error(`Error processing request: ${error.message}`)
  }
}

// Health check endpoint
function handleHealthCheck() {
  return {
    status: "healthy",
    service: "tier1-chatbot",
    timestamp: new Date().toISOString(),
    available_clients: Object.keys(CLIENT_CONFIGS)
  }
}

// Get client configuration endpoint
function handleGetClientConfig(clientId: string) {
  const config = loadClientConfig(clientId)
  // Don't expose sensitive info, just basic structure
  return {
    client_id: clientId,
    business_name: config.business_name || "Unknown",
    available_topics: Object.keys(config.responses || {}),
    has_contact: !!config.contact
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Extract the actual endpoint from the path
    // Remove /tier1-chatbots prefix if present
    const endpoint = path.replace(/^\/tier1-chatbots/, '') || path

    // Root endpoint for testing
    if (endpoint === "/" || endpoint === "") {
      return new Response(
        JSON.stringify({
          message: "Tier 1 Chatbots Edge Function is running!",
          available_endpoints: ["/chat", "/health", "/clients/{client_id}/config"],
          available_clients: Object.keys(CLIENT_CONFIGS)
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // Route handling
    if (endpoint === "/chat" && req.method === "POST") {
      const request: ChatRequest = await req.json()
      const response = await handleChat(request)

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    if (endpoint === "/health" && req.method === "GET") {
      const response = handleHealthCheck()

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // Handle /clients/{client_id}/config endpoint
    const clientConfigMatch = endpoint.match(/^\/clients\/([^/]+)\/config$/)
    if (clientConfigMatch && req.method === "GET") {
      const clientId = clientConfigMatch[1]
      const response = handleGetClientConfig(clientId)

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404
      }
    )

  } catch (error) {
    console.error("Error handling request:", error)

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})
