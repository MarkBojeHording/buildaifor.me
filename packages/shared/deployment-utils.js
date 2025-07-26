/**
 * Deployment Utilities - Shared Across All Tiers
 * Common functions for deploying and managing chatbot configurations
 */

class DeploymentUtils {
  constructor() {
    this.apiBaseUrl = 'http://localhost:8001';
  }

  /**
   * Validate configuration object
   */
  validateConfig(config) {
    const required = ['clientId', 'title'];
    const missing = required.filter(field => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  }

  /**
   * Generate unique client ID
   */
  generateClientId(businessName) {
    const timestamp = Date.now();
    const sanitized = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${sanitized}-${timestamp}`;
  }

  /**
   * Deploy configuration to backend
   */
  async deployConfig(config, tier) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          tier,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }

  /**
   * Test chatbot connection
   */
  async testConnection(clientId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);
      if (!response.ok) {
        throw new Error('Backend not responding');
      }

      // Test with a simple message
      const testResponse = await fetch(`${this.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'test',
          config: { client_id: clientId }
        }),
      });

      return testResponse.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate embed code
   */
  generateEmbedCode(config, tier) {
    const baseUrl = window.location.origin;
    const widgetUrl = `${baseUrl}/packages/${tier}/template/chatbot-widget.js`;
    const stylesUrl = `${baseUrl}/packages/${tier}/template/styles.css`;

    return `
<!-- ${config.title} Chatbot Widget -->
<link rel="stylesheet" href="${stylesUrl}">
<script src="${widgetUrl}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new ChatbotWidget({
      clientId: '${config.clientId}',
      title: '${config.title}',
      theme: '${config.theme || 'default'}',
      position: '${config.position || 'bottom-right'}',
      apiUrl: '${this.apiBaseUrl}'
    });
  });
</script>
    `.trim();
  }

  /**
   * Create configuration file
   */
  createConfigFile(config, tier) {
    const configData = {
      ...config,
      tier,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      features: this.getTierFeatures(tier)
    };

    return JSON.stringify(configData, null, 2);
  }

  /**
   * Get tier-specific features
   */
  getTierFeatures(tier) {
    const features = {
      'tier1': [
        'Basic FAQ responses',
        'Simple embed code',
        '5-minute setup',
        'Non-technical onboarding'
      ],
      'tier2': [
        'FAQ + Lead capture',
        'Advanced styling',
        'Contact form integration',
        'Email notifications'
      ],
      'tier3': [
        'Multi-step workflows',
        'API integrations',
        'Custom business logic',
        'Advanced analytics'
      ]
    };

    return features[tier] || [];
  }

  /**
   * Generate package manifest
   */
  generateManifest(config, tier) {
    return {
      name: `${config.title} Chatbot`,
      tier: tier,
      version: '1.0.0',
      clientId: config.clientId,
      createdAt: new Date().toISOString(),
      files: [
        'chatbot-widget.js',
        'styles.css',
        'config.json',
        'embed-code.html',
        'README.md'
      ],
      dependencies: [],
      setupTime: this.getSetupTime(tier)
    };
  }

  /**
   * Get estimated setup time for tier
   */
  getSetupTime(tier) {
    const times = {
      'tier1': '5 minutes',
      'tier2': '15 minutes',
      'tier3': '30 minutes'
    };

    return times[tier] || 'Unknown';
  }

  /**
   * Backup configuration
   */
  backupConfig(config, tier) {
    const backup = {
      ...config,
      backupDate: new Date().toISOString(),
      tier
    };

    const filename = `backup-${config.clientId}-${Date.now()}.json`;
    this.downloadFile(JSON.stringify(backup, null, 2), filename);
  }

  /**
   * Download file helper
   */
  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate business information
   */
  validateBusinessInfo(info) {
    const required = ['businessName', 'industry', 'contactEmail'];
    const missing = required.filter(field => !info[field]);

    if (missing.length > 0) {
      throw new Error(`Missing business information: ${missing.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(info.contactEmail)) {
      throw new Error('Invalid email format');
    }

    return true;
  }

  /**
   * Generate setup instructions
   */
  generateSetupInstructions(tier) {
    const instructions = {
      'tier1': [
        '1. Copy the embed code to your website',
        '2. Update the clientId in the configuration',
        '3. Test the chatbot with a simple question',
        '4. Customize the welcome message if needed'
      ],
      'tier2': [
        '1. Copy the embed code to your website',
        '2. Configure lead capture forms',
        '3. Set up email notifications',
        '4. Customize styling and branding',
        '5. Test lead capture functionality'
      ],
      'tier3': [
        '1. Copy the embed code to your website',
        '2. Configure API integrations',
        '3. Set up custom workflows',
        '4. Configure analytics tracking',
        '5. Test all integrations and workflows',
        '6. Set up monitoring and alerts'
      ]
    };

    return instructions[tier] || [];
  }
}

// Export for use in tier-specific implementations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeploymentUtils;
} else {
  window.DeploymentUtils = DeploymentUtils;
}
