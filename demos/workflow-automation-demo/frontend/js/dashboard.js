// Dashboard Analytics and Chart Management
class DashboardManager {
    constructor() {
        this.analyticsCharts = {};
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupAnalyticsCharts();
        this.startAutoRefresh();
    }

    setupAnalyticsCharts() {
        // Classification Analytics Chart
        const classificationCtx = document.getElementById('classificationAnalyticsChart');
        if (classificationCtx) {
            this.analyticsCharts.classification = new Chart(classificationCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Email Count',
                        data: [],
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Sentiment Chart
        const sentimentCtx = document.getElementById('sentimentChart');
        if (sentimentCtx) {
            this.analyticsCharts.sentiment = new Chart(sentimentCtx, {
                type: 'pie',
                data: {
                    labels: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
                    datasets: [{
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: [
                            '#f5576c',
                            '#f093fb',
                            '#667eea',
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

        // Priority Chart
        const priorityCtx = document.getElementById('priorityChart');
        if (priorityCtx) {
            this.analyticsCharts.priority = new Chart(priorityCtx, {
                type: 'doughnut',
                data: {
                    labels: ['High', 'Medium', 'Low'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#f5576c',
                            '#667eea',
                            '#43e97b'
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

        // Responses Chart
        const responsesCtx = document.getElementById('responsesChart');
        if (responsesCtx) {
            this.analyticsCharts.responses = new Chart(responsesCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Responses Generated',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Responses Sent',
                        data: [],
                        borderColor: '#43e97b',
                        backgroundColor: 'rgba(67, 233, 123, 0.1)',
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

        // Performance Analytics Chart
        const performanceCtx = document.getElementById('performanceAnalyticsChart');
        if (performanceCtx) {
            this.analyticsCharts.performance = new Chart(performanceCtx, {
                type: 'bar',
                data: {
                    labels: ['Processing Speed', 'Accuracy Rate', 'Response Time', 'Success Rate'],
                    datasets: [{
                        label: 'Performance Metrics',
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(67, 233, 123, 0.8)',
                            'rgba(245, 87, 108, 0.8)',
                            'rgba(240, 147, 251, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    updateClassificationAnalytics(data) {
        if (!this.analyticsCharts.classification) return;

        const labels = data.breakdown.map(item => item.classification);
        const values = data.breakdown.map(item => item.count);

        this.analyticsCharts.classification.data.labels = labels;
        this.analyticsCharts.classification.data.datasets[0].data = values;
        this.analyticsCharts.classification.update();
    }

    updateSentimentAnalytics(data) {
        if (!this.analyticsCharts.sentiment) return;

        const sentimentMap = {
            'very_negative': 0,
            'negative': 1,
            'neutral': 2,
            'positive': 3,
            'very_positive': 4
        };

        const values = [0, 0, 0, 0, 0];
        data.sentimentData.forEach(item => {
            const index = sentimentMap[item.sentiment_level];
            if (index !== undefined) {
                values[index] = item.count;
            }
        });

        this.analyticsCharts.sentiment.data.datasets[0].data = values;
        this.analyticsCharts.sentiment.update();
    }

    updatePriorityAnalytics(data) {
        if (!this.analyticsCharts.priority) return;

        const priorityMap = {
            'high': 0,
            'medium': 1,
            'low': 2
        };

        const values = [0, 0, 0];
        data.priorityData.forEach(item => {
            const index = priorityMap[item.priority_level];
            if (index !== undefined) {
                values[index] = item.count;
            }
        });

        this.analyticsCharts.priority.data.datasets[0].data = values;
        this.analyticsCharts.priority.update();
    }

    updateResponsesAnalytics(data) {
        if (!this.analyticsCharts.responses) return;

        // Generate sample time series data
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const generated = labels.map(() => Math.floor(Math.random() * 20) + 5);
        const sent = generated.map(val => Math.floor(val * 0.8));

        this.analyticsCharts.responses.data.labels = labels;
        this.analyticsCharts.responses.data.datasets[0].data = generated;
        this.analyticsCharts.responses.data.datasets[1].data = sent;
        this.analyticsCharts.responses.update();
    }

    updatePerformanceAnalytics(data) {
        if (!this.analyticsCharts.performance) return;

        // Sample performance metrics
        const values = [
            Math.floor(Math.random() * 30) + 70, // Processing Speed
            Math.floor(Math.random() * 20) + 80, // Accuracy Rate
            Math.floor(Math.random() * 40) + 60, // Response Time
            Math.floor(Math.random() * 15) + 85  // Success Rate
        ];

        this.analyticsCharts.performance.data.datasets[0].data = values;
        this.analyticsCharts.performance.update();
    }

    async loadTimeSavingsData() {
        try {
            const response = await fetch('/api/dashboard/analytics/time-savings');
            const data = await response.json();

            if (data.success) {
                this.displayTimeSavings(data.data);
            }
        } catch (error) {
            console.error('Failed to load time savings data:', error);
        }
    }

    displayTimeSavings(data) {
        const timeSavingsContainer = document.createElement('div');
        timeSavingsContainer.className = 'time-savings-widget';
        timeSavingsContainer.innerHTML = `
            <h3>Time Savings Analysis</h3>
            <div class="time-savings-grid">
                <div class="time-savings-item">
                    <h4>${data.timeSavedHours}h</h4>
                    <p>Hours Saved</p>
                </div>
                <div class="time-savings-item">
                    <h4>${data.timeSavedDays}d</h4>
                    <p>Days Saved</p>
                </div>
                <div class="time-savings-item">
                    <h4>${data.efficiencyGain}%</h4>
                    <p>Efficiency Gain</p>
                </div>
            </div>
        `;

        // Add to dashboard if not already present
        const existingWidget = document.querySelector('.time-savings-widget');
        if (!existingWidget) {
            const dashboard = document.getElementById('dashboard');
            dashboard.appendChild(timeSavingsContainer);
        }
    }

    async loadErrorAnalytics() {
        try {
            const response = await fetch('/api/dashboard/analytics/errors');
            const data = await response.json();

            if (data.success) {
                this.displayErrorAnalytics(data.data);
            }
        } catch (error) {
            console.error('Failed to load error analytics:', error);
        }
    }

    displayErrorAnalytics(data) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-analytics-widget';
        errorContainer.innerHTML = `
            <h3>Error Analysis</h3>
            <div class="error-stats">
                ${data.errorStats.map(stat => `
                    <div class="error-stat">
                        <h4>${stat.action}</h4>
                        <p>Success Rate: ${stat.success_rate.toFixed(1)}%</p>
                        <p>Failed: ${stat.failed}</p>
                    </div>
                `).join('')}
            </div>
        `;

        // Add to dashboard if not already present
        const existingWidget = document.querySelector('.error-analytics-widget');
        if (!existingWidget) {
            const dashboard = document.getElementById('dashboard');
            dashboard.appendChild(errorContainer);
        }
    }

    startAutoRefresh() {
        // Refresh dashboard data every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (window.emailWorkflowApp?.currentSection === 'dashboard') {
                window.emailWorkflowApp.loadDashboard();
            }
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Export chart data
    exportChartData(chartType) {
        const chart = this.analyticsCharts[chartType];
        if (!chart) return null;

        return {
            labels: chart.data.labels,
            datasets: chart.data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data
            }))
        };
    }

    // Print chart
    printChart(chartType) {
        const chart = this.analyticsCharts[chartType];
        if (!chart) return;

        const canvas = chart.canvas;
        const dataURL = canvas.toDataURL('image/png');

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${chartType} Chart</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <h1>${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Analytics</h1>
                    <img src="${dataURL}" alt="${chartType} chart">
                    <p>Generated on ${new Date().toLocaleString()}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Add time savings widget styles
const timeSavingsStyles = `
    .time-savings-widget {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
    }

    .time-savings-widget h3 {
        margin-bottom: 1rem;
        color: #333;
        font-weight: 600;
    }

    .time-savings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .time-savings-item {
        text-align: center;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 10px;
    }

    .time-savings-item h4 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .time-savings-item p {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .error-analytics-widget {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
    }

    .error-analytics-widget h3 {
        margin-bottom: 1rem;
        color: #333;
        font-weight: 600;
    }

    .error-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .error-stat {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        border-left: 4px solid #f5576c;
    }

    .error-stat h4 {
        color: #333;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .error-stat p {
        color: #666;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }
`;

const dashboardStyleSheet = document.createElement('style');
dashboardStyleSheet.textContent = timeSavingsStyles;
document.head.appendChild(dashboardStyleSheet);
