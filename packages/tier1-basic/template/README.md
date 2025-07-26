# Tier 1 Basic FAQ Chatbot

## Overview
A simple, lightweight chatbot widget that provides basic FAQ responses for small businesses. Perfect for businesses that need 24/7 basic information without complex features.

## Features
- ✅ Basic FAQ responses
- ✅ Simple embed code
- ✅ 5-minute setup process
- ✅ Non-technical client onboarding
- ✅ Mobile responsive
- ✅ Lightweight (under 50KB)

## Quick Start

### 1. Copy the Embed Code
Add this code to your website's `<head>` section:

```html
<!-- Your Business Chatbot Widget -->
<link rel="stylesheet" href="styles.css">
<script src="chatbot-widget.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new ChatbotWidget({
      clientId: 'your-business-name',
      title: 'Your Business Name',
      theme: 'default',
      position: 'bottom-right',
      apiUrl: 'http://localhost:8001'
    });
  });
</script>
```

### 2. Update Configuration
Edit the `config-template.json` file with your business information:

```json
{
  "clientId": "your-business-name",
  "title": "Your Business Name",
  "business_name": "Your Business Name",
  "industry": "your-industry",
  "responses": {
    "hours|open|time": "🕒 We're open Monday-Friday 9AM-5PM",
    "contact|phone": "📞 Call us at (555) 123-4567",
    "location|address": "📍 Visit us at 123 Main Street"
  }
}
```

### 3. Test Your Chatbot
- Open your website
- Click the chat button
- Ask a test question like "What are your hours?"

## Configuration Options

### Basic Settings
- `clientId`: Unique identifier for your business
- `title`: Display name in the chat header
- `theme`: Visual theme (default, dark, light)
- `position`: Widget position (bottom-right, bottom-left, top-right, top-left)

### Customizing Responses
Add your own FAQ responses in the `responses` object:

```json
{
  "responses": {
    "keyword1|keyword2": "Your response here",
    "pricing|cost": "Our pricing starts at $X...",
    "services|what do you offer": "We offer the following services..."
  }
}
```

## File Structure
```
tier1-basic/
├── chatbot-widget.js    # Main widget code
├── styles.css          # Widget styling
├── config-template.json # Configuration template
├── embed-code.html     # Ready-to-use embed code
└── README.md          # This file
```

## Support
- **Setup Time**: 5 minutes
- **Technical Level**: Non-technical
- **Support**: Email support included
- **Updates**: Free updates for 30 days

## Troubleshooting

### Widget Not Appearing
1. Check that the embed code is in the `<head>` section
2. Verify the file paths are correct
3. Check browser console for errors

### Chatbot Not Responding
1. Ensure the backend server is running
2. Verify the `clientId` matches your configuration
3. Check the API URL is correct

### Styling Issues
1. Make sure `styles.css` is loaded
2. Check for CSS conflicts with your website
3. Try a different theme

## Next Steps
Ready for more features? Consider upgrading to:
- **Tier 2**: Add lead capture and advanced styling
- **Tier 3**: Multi-step workflows and API integrations

## Contact
For support or questions:
- Email: support@buildaifor.me
- Documentation: https://docs.buildaifor.me
- Live Chat: Available on our website
