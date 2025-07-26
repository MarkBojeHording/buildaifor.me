// Demo and Testing Functionality
class EmailWorkflowDemo {
    constructor() {
        this.demoEmails = [
            {
                subject: 'Urgent: Server Down - Production Issue',
                sender: 'John Smith',
                sender_email: 'john.smith@techcompany.com',
                content: 'Our production server has been down for the past 2 hours. Customers are reporting they cannot access our platform. This is causing significant revenue loss. We need immediate assistance to resolve this critical issue.'
            },
            {
                subject: 'Product Inquiry - Enterprise Solution',
                sender: 'Sarah Johnson',
                sender_email: 'sarah.johnson@enterprise.com',
                content: 'I\'m interested in your enterprise AI solution for our company. We have 500+ employees and need a comprehensive email automation system. Can you provide pricing information and schedule a demo? We\'re looking to implement this within the next quarter.'
            },
            {
                subject: 'Meeting Request - Partnership Discussion',
                sender: 'Mike Wilson',
                sender_email: 'mike.wilson@partners.com',
                content: 'Hi there! I\'d like to schedule a meeting to discuss a potential partnership opportunity. We believe there\'s great synergy between our companies. Are you available next week for a 30-minute call? I\'m flexible with timing.'
            },
            {
                subject: 'Invoice #INV-2024-001 - Payment Due',
                sender: 'Accounting Department',
                sender_email: 'accounting@vendorsupplier.com',
                content: 'Please find attached invoice #INV-2024-001 for services rendered in January 2024. Amount due: $2,500.00. Due date: February 15, 2024. Please remit payment to the address listed below. Thank you for your business.'
            },
            {
                subject: 'Customer Complaint - Poor Service Experience',
                sender: 'Lisa Davis',
                sender_email: 'lisa.davis@customer.com',
                content: 'I\'m extremely disappointed with the service I received from your company. I\'ve been a customer for 3 years and this is the worst experience I\'ve ever had. The product didn\'t work as advertised and your support team was unhelpful. I demand a full refund.'
            },
            {
                subject: 'Newsletter - Weekly Tech Updates',
                sender: 'Tech Newsletter',
                sender_email: 'newsletter@techblog.com',
                content: 'This week\'s top tech stories: AI breakthroughs, new startup funding rounds, and industry trends. Plus, exclusive interviews with tech leaders. Read more on our website and don\'t forget to share with your network!'
            },
            {
                subject: 'Spam Alert - You\'ve Won $1,000,000!',
                sender: 'Lottery Winner',
                sender_email: 'winner@lottery.com',
                content: 'CONGRATULATIONS! You have been selected as the winner of $1,000,000 in our international lottery! Click here to claim your prize immediately. Limited time offer - act now!'
            },
            {
                subject: 'Support Ticket #ST-12345 - Login Issues',
                sender: 'Robert Brown',
                sender_email: 'robert.brown@user.com',
                content: 'I\'m having trouble logging into my account. I keep getting an error message saying "Invalid credentials" even though I\'m sure my password is correct. I\'ve tried resetting it twice but still can\'t access my account. Please help!'
            }
        ];

        this.demoResults = [];
        this.init();
    }

    init() {
        this.setupDemoControls();
        this.createDemoInterface();
    }

    setupDemoControls() {
        // Add demo controls to the processing section
        const processingControls = document.querySelector('.processing-controls');
        if (processingControls) {
            const demoControls = document.createElement('div');
            demoControls.className = 'demo-controls';
            demoControls.innerHTML = `
                <h4>Demo Controls</h4>
                <div class="demo-buttons">
                    <button id="runFullDemo" class="btn btn-primary">
                        <i class="fas fa-rocket"></i> Run Full Demo
                    </button>
                    <button id="runSingleDemo" class="btn btn-secondary">
                        <i class="fas fa-play"></i> Single Email Demo
                    </button>
                    <button id="showDemoResults" class="btn btn-secondary">
                        <i class="fas fa-chart-bar"></i> Show Results
                    </button>
                </div>
            `;
            processingControls.appendChild(demoControls);

            // Add event listeners
            document.getElementById('runFullDemo').addEventListener('click', () => {
                this.runFullDemo();
            });

            document.getElementById('runSingleDemo').addEventListener('click', () => {
                this.runSingleDemo();
            });

            document.getElementById('showDemoResults').addEventListener('click', () => {
                this.showDemoResults();
            });
        }
    }

    createDemoInterface() {
        // Create demo results container
        const demoContainer = document.createElement('div');
        demoContainer.id = 'demoContainer';
        demoContainer.className = 'demo-container';
        demoContainer.style.display = 'none';
        demoContainer.innerHTML = `
            <div class="demo-header">
                <h3>Demo Results</h3>
                <button class="close-demo" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="demo-content">
                <div class="demo-stats">
                    <div class="demo-stat">
                        <h4 id="demoTotal">0</h4>
                        <p>Total Processed</p>
                    </div>
                    <div class="demo-stat">
                        <h4 id="demoAccuracy">0%</h4>
                        <p>Average Accuracy</p>
                    </div>
                    <div class="demo-stat">
                        <h4 id="demoTime">0s</h4>
                        <p>Processing Time</p>
                    </div>
                </div>
                <div class="demo-results" id="demoResultsList">
                    <!-- Demo results will be populated here -->
                </div>
            </div>
        `;

        document.body.appendChild(demoContainer);
    }

    async runFullDemo() {
        const startTime = Date.now();
        this.demoResults = [];

        // Show loading
        this.showDemoLoading('Processing demo emails...');

        try {
            // Process all demo emails
            for (let i = 0; i < this.demoEmails.length; i++) {
                const email = this.demoEmails[i];

                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Process email
                const result = await this.processDemoEmail(email);
                this.demoResults.push(result);

                // Update progress
                this.updateDemoProgress(i + 1, this.demoEmails.length);
            }

            const totalTime = (Date.now() - startTime) / 1000;
            this.showDemoResults(totalTime);

        } catch (error) {
            console.error('Demo error:', error);
            this.hideDemoLoading();
            this.showDemoError('Demo failed: ' + error.message);
        }
    }

    async runSingleDemo() {
        // Pick a random demo email
        const randomEmail = this.demoEmails[Math.floor(Math.random() * this.demoEmails.length)];

        this.showDemoLoading('Processing single email...');

        try {
            const result = await this.processDemoEmail(randomEmail);
            this.demoResults = [result];

            const totalTime = 1.5; // Simulated time
            this.showDemoResults(totalTime);

        } catch (error) {
            console.error('Single demo error:', error);
            this.hideDemoLoading();
            this.showDemoError('Single demo failed: ' + error.message);
        }
    }

    async processDemoEmail(email) {
        try {
            const response = await fetch('/api/email/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email)
            });

            const data = await response.json();

            if (data.success) {
                return {
                    email: email,
                    results: data.results,
                    success: true
                };
            } else {
                return {
                    email: email,
                    error: data.error,
                    success: false
                };
            }

        } catch (error) {
            return {
                email: email,
                error: error.message,
                success: false
            };
        }
    }

    showDemoResults(totalTime) {
        this.hideDemoLoading();

        const container = document.getElementById('demoContainer');
        const resultsList = document.getElementById('demoResultsList');

        // Update stats
        document.getElementById('demoTotal').textContent = this.demoResults.length;

        const successfulResults = this.demoResults.filter(r => r.success);
        const avgAccuracy = successfulResults.length > 0
            ? successfulResults.reduce((sum, r) => sum + (r.results.classification.confidence * 100), 0) / successfulResults.length
            : 0;

        document.getElementById('demoAccuracy').textContent = Math.round(avgAccuracy) + '%';
        document.getElementById('demoTime').textContent = totalTime.toFixed(1) + 's';

        // Populate results
        resultsList.innerHTML = this.demoResults.map((result, index) => {
            if (result.success) {
                const classification = result.results.classification;
                const sentiment = result.results.sentiment;
                const priority = result.results.priority;

                return `
                    <div class="demo-result-item">
                        <div class="demo-result-header">
                            <h4>${result.email.subject}</h4>
                            <span class="demo-result-status success">
                                <i class="fas fa-check"></i> Success
                            </span>
                        </div>
                        <div class="demo-result-details">
                            <div class="demo-result-metric">
                                <strong>Classification:</strong> ${classification.type} (${(classification.confidence * 100).toFixed(1)}%)
                            </div>
                            <div class="demo-result-metric">
                                <strong>Sentiment:</strong> ${sentiment.level} (${sentiment.score.toFixed(2)})
                            </div>
                            <div class="demo-result-metric">
                                <strong>Priority:</strong> ${priority.score}/10 (${priority.recommendation})
                            </div>
                            <div class="demo-result-metric">
                                <strong>Entities:</strong> ${result.results.entities.contacts.length} contacts, ${result.results.entities.dates.length} dates
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="demo-result-item">
                        <div class="demo-result-header">
                            <h4>${result.email.subject}</h4>
                            <span class="demo-result-status error">
                                <i class="fas fa-times"></i> Failed
                            </span>
                        </div>
                        <div class="demo-result-details">
                            <div class="demo-result-error">
                                Error: ${result.error}
                            </div>
                        </div>
                    </div>
                `;
            }
        }).join('');

        container.style.display = 'block';
    }

    showDemoLoading(message) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = loadingOverlay.querySelector('p');
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }

    hideDemoLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    updateDemoProgress(current, total) {
        const loadingText = document.querySelector('#loadingOverlay p');
        const percentage = Math.round((current / total) * 100);
        loadingText.textContent = `Processing demo emails... ${current}/${total} (${percentage}%)`;
    }

    showDemoError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'demo-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Pre-populate email form with demo data
    populateEmailForm(emailIndex = 0) {
        const email = this.demoEmails[emailIndex];
        if (email) {
            document.getElementById('emailSubject').value = email.subject;
            document.getElementById('emailSender').value = email.sender;
            document.getElementById('emailContent').value = email.content;
        }
    }

    // Generate demo report
    generateDemoReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalEmails: this.demoResults.length,
            successful: this.demoResults.filter(r => r.success).length,
            failed: this.demoResults.filter(r => !r.success).length,
            averageAccuracy: 0,
            classifications: {},
            processingTime: 0,
            results: this.demoResults
        };

        // Calculate statistics
        const successfulResults = this.demoResults.filter(r => r.success);
        if (successfulResults.length > 0) {
            report.averageAccuracy = successfulResults.reduce((sum, r) =>
                sum + (r.results.classification.confidence * 100), 0) / successfulResults.length;

            // Count classifications
            successfulResults.forEach(r => {
                const type = r.results.classification.type;
                report.classifications[type] = (report.classifications[type] || 0) + 1;
            });
        }

        return report;
    }

    // Export demo results
    exportDemoResults() {
        const report = this.generateDemoReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `email-workflow-demo-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emailWorkflowDemo = new EmailWorkflowDemo();
});

// Add demo styles
const demoStyles = `
    .demo-controls {
        background: rgba(102, 126, 234, 0.1);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
    }

    .demo-controls h4 {
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 600;
    }

    .demo-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .demo-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        z-index: 1001;
    }

    .demo-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .demo-header h3 {
        margin: 0;
        font-weight: 600;
    }

    .close-demo {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 5px;
        transition: background 0.3s ease;
    }

    .close-demo:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .demo-content {
        padding: 1.5rem;
        max-height: 60vh;
        overflow-y: auto;
    }

    .demo-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .demo-stat {
        text-align: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
    }

    .demo-stat h4 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.25rem;
    }

    .demo-stat p {
        font-size: 0.9rem;
        color: #666;
        margin: 0;
    }

    .demo-results {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .demo-result-item {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1rem;
        border-left: 4px solid #667eea;
    }

    .demo-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .demo-result-header h4 {
        margin: 0;
        font-weight: 600;
        color: #333;
        font-size: 1rem;
    }

    .demo-result-status {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .demo-result-status.success {
        background: rgba(67, 233, 123, 0.2);
        color: #43e97b;
    }

    .demo-result-status.error {
        background: rgba(245, 87, 108, 0.2);
        color: #f5576c;
    }

    .demo-result-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
    }

    .demo-result-metric {
        font-size: 0.9rem;
        color: #666;
    }

    .demo-result-error {
        color: #f5576c;
        font-weight: 600;
    }

    .demo-error {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f5576c, #f093fb);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    }

    .demo-error button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 3px;
        transition: background 0.3s ease;
    }

    .demo-error button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
        .demo-container {
            width: 95%;
            max-height: 90vh;
        }

        .demo-stats {
            grid-template-columns: 1fr;
        }

        .demo-result-details {
            grid-template-columns: 1fr;
        }

        .demo-buttons {
            flex-direction: column;
        }
    }
`;

const demoStyleSheet = document.createElement('style');
demoStyleSheet.textContent = demoStyles;
document.head.appendChild(demoStyleSheet);
