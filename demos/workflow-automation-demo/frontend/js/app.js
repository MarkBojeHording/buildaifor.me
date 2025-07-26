// Main Application JavaScript
class EmailWorkflowApp {
    constructor() {
        this.apiBase = '/api';
        this.charts = {};
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.setupCharts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Header buttons
        document.getElementById('connectBtn').addEventListener('click', () => {
            this.connectEmail();
        });

        document.getElementById('autoProcessingBtn').addEventListener('click', () => {
            this.toggleAutoProcessing();
        });

        // Email form
        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processEmail();
        });

        // File upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('emailFile').click();
        });

        document.getElementById('emailFile').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Demo button
        document.getElementById('demoBtn').addEventListener('click', () => {
            this.runDemo();
        });

        // Settings
        document.getElementById('confidenceThreshold').addEventListener('input', (e) => {
            document.getElementById('confidenceValue').textContent = e.target.value;
        });
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'responses':
                this.loadResponses();
                break;
            case 'workflows':
                this.loadWorkflows();
                break;
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load tab-specific data
        if (this.currentSection === 'analytics') {
            this.loadAnalyticsData(tabName);
        }
    }

    async loadDashboard() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/dashboard/overview`);
            const data = await response.json();

            if (data.success) {
                this.updateDashboardStats(data.data);
                this.updateRecentActivity(data.data.recentActivity);
            }
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.hideLoading();
        }
    }

    updateDashboardStats(data) {
        const { emailStats, aiStats } = data;

        // Update stat cards
        document.getElementById('totalEmails').textContent = emailStats?.total_emails || 0;
        document.getElementById('processedEmails').textContent = emailStats?.processed || 0;
        document.getElementById('timeSaved').textContent = this.calculateTimeSaved(emailStats) + 'h';
        document.getElementById('accuracyRate').textContent =
            aiStats?.averageConfidence ? Math.round(aiStats.averageConfidence * 100) + '%' : '0%';

        // Update charts
        this.updateClassificationChart(aiStats?.classificationBreakdown || []);
        this.updatePerformanceChart(emailStats);
    }

    calculateTimeSaved(stats) {
        if (!stats) return 0;
        const timePerEmail = 5; // minutes
        const timePerResponse = 3; // minutes
        const totalTime = (stats.processed * timePerEmail) + (stats.responses_sent * timePerResponse);
        return Math.round(totalTime / 60); // hours
    }

    updateRecentActivity(activity) {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';

        if (!activity?.recentEmails?.length) {
            activityList.innerHTML = '<p class="no-data">No recent activity</p>';
            return;
        }

        activity.recentEmails.forEach(email => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="activity-content">
                    <h4>${email.subject}</h4>
                    <p>From: ${email.sender} • ${this.formatDate(email.received_date)}</p>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    setupCharts() {
        // Classification Chart
        const classificationCtx = document.getElementById('classificationChart');
        if (classificationCtx) {
            this.charts.classification = new Chart(classificationCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#667eea',
                            '#764ba2',
                            '#f093fb',
                            '#f5576c',
                            '#4facfe',
                            '#00f2fe',
                            '#43e97b',
                            '#38f9d7'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart');
        if (performanceCtx) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Emails Processed',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    updateClassificationChart(data) {
        if (!this.charts.classification) return;

        const labels = data.map(item => item.classification);
        const values = data.map(item => item.count);

        this.charts.classification.data.labels = labels;
        this.charts.classification.data.datasets[0].data = values;
        this.charts.classification.update();
    }

    updatePerformanceChart(stats) {
        if (!this.charts.performance) return;

        // Generate sample performance data
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = labels.map(() => Math.floor(Math.random() * 50) + 10);

        this.charts.performance.data.labels = labels;
        this.charts.performance.data.datasets[0].data = data;
        this.charts.performance.update();
    }

    async processEmail() {
        const formData = {
            subject: document.getElementById('emailSubject').value,
            sender: document.getElementById('emailSender').value,
            content: document.getElementById('emailContent').value
        };

        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/email/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.displayProcessingResults(data.results);
                this.loadDashboard(); // Refresh dashboard
            } else {
                this.showError(data.error || 'Failed to process email');
            }
        } catch (error) {
            console.error('Email processing error:', error);
            this.showError('Failed to process email');
        } finally {
            this.hideLoading();
        }
    }

    displayProcessingResults(results) {
        const resultsContainer = document.getElementById('processingResults');
        const resultsContent = document.getElementById('resultsContent');

        resultsContent.innerHTML = `
            <div class="result-item">
                <h4>Classification</h4>
                <p><strong>Type:</strong> ${results.classification.type}</p>
                <p><strong>Confidence:</strong> ${(results.classification.confidence * 100).toFixed(1)}%</p>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${results.classification.confidence * 100}%"></div>
                </div>
            </div>
            <div class="result-item">
                <h4>Sentiment Analysis</h4>
                <p><strong>Level:</strong> ${results.sentiment.level}</p>
                <p><strong>Score:</strong> ${results.sentiment.score.toFixed(2)}</p>
            </div>
            <div class="result-item">
                <h4>Priority Assessment</h4>
                <p><strong>Score:</strong> ${results.priority.score}/10</p>
                <p><strong>Recommendation:</strong> ${results.priority.recommendation}</p>
            </div>
            <div class="result-item">
                <h4>Extracted Entities</h4>
                <p><strong>Contacts:</strong> ${results.entities.contacts.length}</p>
                <p><strong>Dates:</strong> ${results.entities.dates.length}</p>
                <p><strong>Amounts:</strong> ${results.entities.amounts.length}</p>
            </div>
        `;

        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    async runDemo() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/email/demo`, {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess(`Demo completed! Processed ${data.processed} emails`);
                this.loadDashboard(); // Refresh dashboard
            } else {
                this.showError(data.error || 'Demo failed');
            }
        } catch (error) {
            console.error('Demo error:', error);
            this.showError('Failed to run demo');
        } finally {
            this.hideLoading();
        }
    }

    async connectEmail() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/email/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ provider: 'gmail' })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Email service connected successfully');
                document.getElementById('connectBtn').textContent = 'Connected';
                document.getElementById('connectBtn').disabled = true;
            } else {
                this.showError(data.error || 'Failed to connect email service');
            }
        } catch (error) {
            console.error('Email connection error:', error);
            this.showError('Failed to connect email service');
        } finally {
            this.hideLoading();
        }
    }

    async toggleAutoProcessing() {
        const btn = document.getElementById('autoProcessingBtn');
        const isRunning = btn.textContent.includes('Stop');

        try {
            this.showLoading();
            const endpoint = isRunning ? 'stop' : 'start';
            const response = await fetch(`${this.apiBase}/email/auto-processing/${endpoint}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                if (isRunning) {
                    btn.innerHTML = '<i class="fas fa-play"></i> Start Auto Processing';
                    this.showSuccess('Auto processing stopped');
                } else {
                    btn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto Processing';
                    this.showSuccess('Auto processing started');
                }
            } else {
                this.showError(data.error || 'Failed to toggle auto processing');
            }
        } catch (error) {
            console.error('Auto processing error:', error);
            this.showError('Failed to toggle auto processing');
        } finally {
            this.hideLoading();
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('email', file);

        fetch(`${this.apiBase}/email/upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.displayProcessingResults(data.results);
                this.loadDashboard();
            } else {
                this.showError(data.error || 'Failed to upload file');
            }
        })
        .catch(error => {
            console.error('File upload error:', error);
            this.showError('Failed to upload file');
        });
    }

    async loadAnalytics() {
        // Load default analytics tab
        this.loadAnalyticsData('classification');
    }

    async loadAnalyticsData(tabName) {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/dashboard/analytics/${tabName}`);
            const data = await response.json();

            if (data.success) {
                this.updateAnalyticsChart(tabName, data.data);
            }
        } catch (error) {
            console.error('Analytics error:', error);
            this.showError('Failed to load analytics');
        } finally {
            this.hideLoading();
        }
    }

    updateAnalyticsChart(tabName, data) {
        // Implementation for different analytics charts
        console.log(`Updating ${tabName} chart with data:`, data);
    }

    loadResponses() {
        // Load response templates and history
        console.log('Loading responses section');
    }

    loadWorkflows() {
        // Load workflow configurations
        console.log('Loading workflows section');
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emailWorkflowApp = new EmailWorkflowApp();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    }

    .notification-success {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
    }

    .notification-error {
        background: linear-gradient(135deg, #f5576c, #f093fb);
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
