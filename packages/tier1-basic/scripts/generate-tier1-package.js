/**
 * Tier 1 Basic FAQ Chatbot Package Generator
 * Automates the creation of custom Tier 1 chatbot packages
 */

const fs = require('fs');
const path = require('path');

class Tier1PackageGenerator {
  constructor() {
    this.templateDir = path.join(__dirname, '../template');
    this.outputDir = path.join(__dirname, '../examples');
  }

  /**
   * Generate a complete Tier 1 package for a client
   */
  async generatePackage(clientConfig) {
    try {
      // Validate client configuration
      this.validateConfig(clientConfig);

      // Create client directory
      const clientDir = path.join(this.outputDir, `${clientConfig.clientId}-package`);
      if (!fs.existsSync(clientDir)) {
        fs.mkdirSync(clientDir, { recursive: true });
      }

      // Generate all package files
      await this.generateWidgetFile(clientConfig, clientDir);
      await this.generateStylesFile(clientConfig, clientDir);
      await this.generateConfigFile(clientConfig, clientDir);
      await this.generateEmbedCode(clientConfig, clientDir);
      await this.generateReadme(clientConfig, clientDir);
      await this.generateManifest(clientConfig, clientDir);

      console.log(`✅ Tier 1 package generated successfully for ${clientConfig.business_name}`);
      console.log(`📁 Package location: ${clientDir}`);

      return {
        success: true,
        packagePath: clientDir,
        files: this.getGeneratedFiles(clientDir)
      };

    } catch (error) {
      console.error('❌ Package generation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate client configuration
   */
  validateConfig(config) {
    const required = ['clientId', 'business_name', 'title'];
    const missing = required.filter(field => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!config.responses || Object.keys(config.responses).length === 0) {
      throw new Error('At least one response must be provided');
    }
  }

  /**
   * Generate custom widget file
   */
  async generateWidgetFile(config, clientDir) {
    const templatePath = path.join(this.templateDir, 'chatbot-widget.js');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Customize template with client config
    const customized = template
      .replace(/Your Business Name/g, config.business_name)
      .replace(/your-business-name/g, config.clientId)
      .replace(/default/g, config.theme || 'default')
      .replace(/bottom-right/g, config.position || 'bottom-right');

    const outputPath = path.join(clientDir, 'chatbot-widget.js');
    fs.writeFileSync(outputPath, customized);
  }

  /**
   * Generate custom styles file
   */
  async generateStylesFile(config, clientDir) {
    const templatePath = path.join(this.templateDir, 'styles.css');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Customize colors if provided
    let customized = template;
    if (config.brandColors) {
      customized = this.customizeColors(template, config.brandColors);
    }

    const outputPath = path.join(clientDir, 'styles.css');
    fs.writeFileSync(outputPath, customized);
  }

  /**
   * Generate configuration file
   */
  async generateConfigFile(config, clientDir) {
    const configData = {
      ...config,
      tier: 'tier1',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      features: [
        'Basic FAQ responses',
        'Simple embed code',
        '5-minute setup',
        'Non-technical onboarding'
      ]
    };

    const outputPath = path.join(clientDir, 'config.json');
    fs.writeFileSync(outputPath, JSON.stringify(configData, null, 2));
  }

  /**
   * Generate embed code
   */
  async generateEmbedCode(config, clientDir) {
    const embedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.business_name} - Chatbot Widget</title>

    <!-- ${config.business_name} Chatbot Widget -->
    <link rel="stylesheet" href="styles.css">
    <script src="chatbot-widget.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            new ChatbotWidget({
                clientId: '${config.clientId}',
                title: '${config.title}',
                theme: '${config.theme || 'default'}',
                position: '${config.position || 'bottom-right'}',
                apiUrl: '${config.apiUrl || 'http://localhost:8001'}',
                responses: ${JSON.stringify(config.responses, null, 8)},
                quickReplies: ${JSON.stringify(config.quickReplies || this.getDefaultQuickReplies(), null, 8)}
            });
        });
    </script>
</head>
<body>
    <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>${config.business_name}</h1>
        <p>This is your website content. The chatbot widget will appear in the ${config.position || 'bottom-right'} corner.</p>
        <p>Click the chat button to test your ${config.business_name} chatbot!</p>
    </div>
</body>
</html>`;

    const outputPath = path.join(clientDir, 'embed-code.html');
    fs.writeFileSync(outputPath, embedCode);
  }

  /**
   * Generate README file
   */
  async generateReadme(config, clientDir) {
    const readme = `# ${config.business_name} - Tier 1 Basic FAQ Chatbot

## Overview
Custom Tier 1 Basic FAQ chatbot for ${config.business_name}.

## Quick Start

### 1. Add to Your Website
Copy this code to your website's \`<head>\` section:

\`\`\`html
<!-- ${config.business_name} Chatbot Widget -->
<link rel="stylesheet" href="styles.css">
<script src="chatbot-widget.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new ChatbotWidget({
      clientId: '${config.clientId}',
      title: '${config.title}',
      theme: '${config.theme || 'default'}',
      position: '${config.position || 'bottom-right'}',
      apiUrl: '${config.apiUrl || 'http://localhost:8001'}'
    });
  });
</script>
\`\`\`

### 2. Test Your Chatbot
- Open your website
- Click the chat button
- Try asking: "What are your hours?"

## Configuration
- **Client ID**: ${config.clientId}
- **Business**: ${config.business_name}
- **Theme**: ${config.theme || 'default'}
- **Position**: ${config.position || 'bottom-right'}

## Support
Contact: support@buildaifor.me
Phone: (555) 987-6543

Generated on: ${new Date().toLocaleDateString()}
`;

    const outputPath = path.join(clientDir, 'README.md');
    fs.writeFileSync(outputPath, readme);
  }

  /**
   * Generate package manifest
   */
  async generateManifest(config, clientDir) {
    const manifest = {
      name: `${config.business_name} Chatbot`,
      tier: 'tier1',
      version: '1.0.0',
      clientId: config.clientId,
      businessName: config.business_name,
      createdAt: new Date().toISOString(),
      files: [
        'chatbot-widget.js',
        'styles.css',
        'config.json',
        'embed-code.html',
        'README.md'
      ],
      features: [
        'Basic FAQ responses',
        'Simple embed code',
        '5-minute setup',
        'Non-technical onboarding'
      ],
      setupTime: '5 minutes',
      support: {
        email: 'support@buildaifor.me',
        phone: '(555) 987-6543',
        hours: 'Monday-Friday 9AM-5PM EST'
      }
    };

    const outputPath = path.join(clientDir, 'manifest.json');
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  }

  /**
   * Customize colors in CSS
   */
  customizeColors(css, colors) {
    let customized = css;

    if (colors.primary) {
      customized = customized.replace(/#007bff/g, colors.primary);
    }
    if (colors.secondary) {
      customized = customized.replace(/#0056b3/g, colors.secondary);
    }
    if (colors.accent) {
      customized = customized.replace(/#17a2b8/g, colors.accent);
    }

    return customized;
  }

  /**
   * Get default quick replies
   */
  getDefaultQuickReplies() {
    return [
      { text: 'What are your hours?', icon: '🕒' },
      { text: 'Where are you located?', icon: '📍' },
      { text: 'How can I contact you?', icon: '📞' },
      { text: 'What services do you offer?', icon: '💼' }
    ];
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(clientDir) {
    return fs.readdirSync(clientDir).map(file => ({
      name: file,
      path: path.join(clientDir, file),
      size: fs.statSync(path.join(clientDir, file)).size
    }));
  }

  /**
   * Create backup of package
   */
  async createBackup(clientConfig) {
    const backupDir = path.join(this.outputDir, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, `${clientConfig.clientId}-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(clientConfig, null, 2));

    return backupPath;
  }
}

// Export for use
module.exports = Tier1PackageGenerator;

// CLI usage
if (require.main === module) {
  const generator = new Tier1PackageGenerator();

  // Example usage
  const exampleConfig = {
    clientId: 'example-business',
    business_name: 'Example Business',
    title: 'Example Business',
    theme: 'default',
    position: 'bottom-right',
    responses: {
      'hours|open|time': '🕒 We\'re open Monday-Friday 9AM-5PM',
      'location|where': '📍 We\'re located at 123 Main Street',
      'contact|phone': '📞 Call us at (555) 123-4567'
    }
  };

  generator.generatePackage(exampleConfig)
    .then(result => {
      if (result.success) {
        console.log('Package generation completed successfully!');
      } else {
        console.error('Package generation failed:', result.error);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
    });
}
