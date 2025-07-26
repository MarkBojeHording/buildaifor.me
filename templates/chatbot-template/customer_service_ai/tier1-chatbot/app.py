# app.py - Simple Tier 1 Chatbot Backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import re
from typing import Dict, Any

app = FastAPI(title="Tier 1 Chatbot Backend")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    config: Dict[str, Any]
    conversation_id: str = None

class ChatResponse(BaseModel):
    response: str
    confidence: float
    booking_created: bool

# Simple client config loader
def load_client_config(client_id: str) -> Dict[str, Any]:
    """Load client configuration from JSON file"""
    config_path = f"configs/clients/{client_id}.json"

    if not os.path.exists(config_path):
        # Return default config if client not found
        return {
            "business_name": "Business",
            "responses": {
                "default": "Thank you for contacting us. Please call (555) 123-4567 for assistance."
            },
            "contact": {"phone": "(555) 123-4567"},
            "fallback": "Please call us at (555) 123-4567 for assistance."
        }

    with open(config_path, 'r') as f:
        return json.load(f)

def get_fallback_response(config: Dict[str, Any]) -> str:
    # Default fallback if not specified
    default_fallback = "I'm sorry, I don't have information about that specific question. Please contact us for help."
    contact = config.get("contact", {})
    phone = contact.get("phone", "(555) 123-4567")
    email = contact.get("email", "info@business.com")
    website = contact.get("website", "www.business.com")
    industry = config.get("industry", "general").lower()

    # Industry-specific fallback templates
    industry_fallbacks = {
        "dental": "I don't have that information, but our staff can help!\n\n\ud83d\udcde Call us: {phone}\n\ud83d\udccd Visit: {website}\n\nFor medical questions, please speak with our professionals directly.\n\nI can help with appointments, hours, services, or insurance questions though!",
        "healthcare": "I don't have that information, but our staff can help!\n\n\ud83d\udcde Call us: {phone}\n\ud83d\udccd Visit: {website}\n\nFor medical questions, please speak with our professionals directly.\n\nI can help with appointments, hours, services, or insurance questions though!",
        "restaurant": "I don't have details on that, but our team does!\n\n\ud83d\udcde Call us: {phone}\n\ud83d\udccd Visit: {website}\n\nFor special requests or detailed questions, our staff is here to help!\n\nI can help with our menu, hours, delivery, or reservations though!",
        "fitness": "I don't have that info, but our trainers do!\n\n\ud83d\udcde Contact us: {phone}\n\ud83c\udfcb\ufe0f Stop by during our hours\n\ud83d\udcdd Visit: {website}\n\nI can help with membership info, class schedules, or general questions though!",
        "salon": "I don't have that answer, but our stylists do!\n\n\ud83d\udcde Call us: {phone}\n\ud83d\udcdd Visit: {website}\n\nFor special requests, please contact our team directly.\n\nI can help with services, pricing, or appointments though!",
        "general": default_fallback
    }
    # Use config fallback if present, else industry, else default
    fallback = config.get("fallback_response") or config.get("fallback")
    if not fallback:
        fallback = industry_fallbacks.get(industry, default_fallback)
    # Replace placeholders
    fallback = fallback.replace("{phone}", phone).replace("{email}", email).replace("{website}", website)
    return fallback

# Simple keyword matching
def match_response(message: str, config: Dict[str, Any]) -> str:
    """Match user message to appropriate response using simple keyword matching"""
    message_lower = message.lower()

    # Handle your existing config structure
    responses = {}

    # Check if it's the old complex structure with services, hours, etc.
    if "services" in config and isinstance(config["services"], str):
        # Convert old structure to simple keyword responses
        if "services" in config:
            responses["services|training|classes|workout"] = config["services"]
        if "hours" in config:
            responses["hours|open|time|schedule"] = config["hours"]
        if "contact" in config:
            contact = config["contact"]
            responses["contact|phone|call"] = f"Call us at {contact} for more information"
    else:
        # Use direct responses if they exist
        responses = config.get("responses", {})

    # Check each response pattern
    for keywords, response in responses.items():
        # Split keywords by | for OR matching
        keyword_list = [k.strip() for k in keywords.split("|")]

        # Check if any keyword matches
        for keyword in keyword_list:
            if keyword.lower() in message_lower:
                return response

    # No match found, return fallback
    return get_fallback_response(config)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint - simple and fast"""
    try:
        # Get client ID from config
        client_id = request.config.get("client_id", "default")

        # Load client configuration
        config = load_client_config(client_id)

        # Match response
        response_text = match_response(request.message, config)

        # Simple confidence scoring
        confidence = 0.9 if "fallback" not in response_text.lower() else 0.3

        return ChatResponse(
            response=response_text,
            confidence=confidence,
            booking_created=False  # Keep simple for Tier 1
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "service": "tier1-chatbot"}

@app.get("/clients/{client_id}/config")
async def get_client_config(client_id: str):
    """Get client configuration (for testing/debugging)"""
    config = load_client_config(client_id)
    # Don't expose sensitive info, just basic structure
    return {
        "client_id": client_id,
        "business_name": config.get("business_name", "Unknown"),
        "available_topics": list(config.get("responses", {}).keys()),
        "has_contact": "contact" in config
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
