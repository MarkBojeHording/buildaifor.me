# Tier 1 Basic FAQ Chatbot - Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Download Your Package
1. Download the Tier 1 package files
2. Extract to your website directory
3. Ensure all files are in the same folder

### Step 2: Customize Configuration
1. Open `config-template.json`
2. Replace placeholder values with your business information:
   - `clientId`: Your unique business identifier
   - `title`: Your business name
   - `business_name`: Your business name
   - `industry`: Your industry type
   - Update contact information in `responses`

### Step 3: Add to Your Website
Copy this code to your website's `<head>` section:

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

### Step 4: Test Your Chatbot
1. Open your website
2. Look for the chat button in the bottom-right corner
3. Click to open the chat
4. Try asking: "What are your hours?"

## Customization Options

### Change Widget Position
```javascript
position: 'bottom-left'    // or 'top-right', 'top-left'
```

### Change Theme
```javascript
theme: 'dark'    // or 'light', 'default'
```

### Add Custom Responses
```javascript
responses: {
  'your-keyword': 'Your custom response here',
  'pricing|cost': 'Our pricing starts at $X...'
}
```

### Customize Quick Replies
```javascript
quickReplies: [
  { text: 'Your custom question?', icon: '🔧' },
  { text: 'Another question?', icon: '📋' }
]
```

## File Structure
```
your-website/
├── styles.css              # Widget styling
├── chatbot-widget.js       # Widget functionality
├── config-template.json    # Your configuration
└── embed-code.html         # Example implementation
```

## Troubleshooting

### Widget Not Appearing
- ✅ Check file paths are correct
- ✅ Ensure code is in `<head>` section
- ✅ Check browser console for errors
- ✅ Verify all files are uploaded

### Chatbot Not Responding
- ✅ Ensure backend server is running
- ✅ Check `clientId` matches configuration
- ✅ Verify API URL is correct
- ✅ Test with simple questions first

### Styling Issues
- ✅ Make sure `styles.css` is loaded
- ✅ Check for CSS conflicts
- ✅ Try different theme
- ✅ Test on mobile device

## Support

### Need Help?
- **Email**: support@buildaifor.me
- **Phone**: (555) 987-6543
- **Hours**: Monday-Friday 9AM-5PM EST
- **Response Time**: 24 hours

### Common Questions

**Q: Can I change the chat button color?**
A: Yes, edit the CSS in `styles.css` under `.chatbot-button`

**Q: How do I add more responses?**
A: Add new entries to the `responses` object in your configuration

**Q: Can I move the widget to a different position?**
A: Yes, change the `position` value in the configuration

**Q: Is the chatbot mobile-friendly?**
A: Yes, it's fully responsive and works on all devices

## Next Steps

### Ready to Upgrade?
Consider upgrading to:
- **Tier 2**: Add lead capture and advanced features
- **Tier 3**: Multi-step workflows and integrations

### Training Resources
- Watch our setup video: [Link]
- Read the full documentation: [Link]
- Join our community forum: [Link]

## Maintenance

### Regular Tasks
- ✅ Test chatbot weekly
- ✅ Update responses as needed
- ✅ Check for new features
- ✅ Backup your configuration

### Updates
- Free updates for 30 days
- Security patches included
- New features available
- Backward compatible

---

**Setup Complete!** Your Tier 1 Basic FAQ chatbot is now live and ready to help your customers 24/7.
