// Charts Configuration
let charts = {};

function initializeCharts(analysis) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    // Risk Distribution Chart
    createRiskChart(analysis);
    
    // Clause Type Distribution
    createClauseTypeChart(analysis);
}

function createRiskChart(analysis) {
    const canvas = document.getElementById('riskChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (charts.riskChart) {
        charts.riskChart.destroy();
    }
    
    const data = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [{
            label: 'Number of Clauses',
            data: [
                analysis.summary.high_risk || 0,
                analysis.summary.medium_risk || 0,
                analysis.summary.low_risk || 0
            ],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',  // Red
                'rgba(245, 158, 11, 0.8)',  // Orange
                'rgba(16, 185, 129, 0.8)'   // Green
            ],
            borderColor: [
                'rgb(239, 68, 68)',
                'rgb(245, 158, 11)',
                'rgb(16, 185, 129)'
            ],
            borderWidth: 2
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    charts.riskChart = new Chart(ctx, config);
}

function createClauseTypeChart(analysis) {
    const canvas = document.getElementById('clauseTypeChart');
    if (!canvas || !analysis.clauses) return;
    
    const ctx = canvas.getContext('2d');
    
    // Count clause types
    const typeCounts = {};
    analysis.clauses.forEach(clause => {
        typeCounts[clause.type] = (typeCounts[clause.type] || 0) + 1;
    });
    
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    
    // Destroy existing chart
    if (charts.clauseTypeChart) {
        charts.clauseTypeChart.destroy();
    }
    
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Clauses',
                data: data,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Clause Types Distribution',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };
    
    charts.clauseTypeChart = new Chart(ctx, config);
}

function createComparisonChart(comparisonData) {
    const canvas = document.getElementById('comparisonChart');
    if (!canvas || !comparisonData) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (charts.comparisonChart) {
        charts.comparisonChart.destroy();
    }
    
    const labels = comparisonData.comparisons.map(c => c.clause_type);
    const yourData = comparisonData.comparisons.map(c => c.percentile);
    
    const config = {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Your Contract',
                    data: yourData,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgb(79, 70, 229)',
                    pointBackgroundColor: 'rgb(79, 70, 229)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(79, 70, 229)'
                },
                {
                    label: 'Industry Average',
                    data: Array(labels.length).fill(50),
                    fill: true,
                    backgroundColor: 'rgba(156, 163, 175, 0.2)',
                    borderColor: 'rgb(156, 163, 175)',
                    pointBackgroundColor: 'rgb(156, 163, 175)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(156, 163, 175)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Contract Comparison (Percentile)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    };
    
    charts.comparisonChart = new Chart(ctx, config);
}

function createRiskTrendChart(historicalData) {
    const canvas = document.getElementById('riskTrendChart');
    if (!canvas || !historicalData) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (charts.riskTrendChart) {
        charts.riskTrendChart.destroy();
    }
    
    const config = {
        type: 'line',
        data: {
            labels: historicalData.dates,
            datasets: [{
                label: 'Risk Score',
                data: historicalData.scores,
                fill: false,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Risk Score Over Time',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Risk Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    };
    
    charts.riskTrendChart = new Chart(ctx, config);
}

// Utility function to generate chart colors
function generateColors(count) {
    const colors = [];
    const baseColors = [
        'rgba(79, 70, 229, 0.8)',   // Primary
        'rgba(16, 185, 129, 0.8)',  // Success
        'rgba(245, 158, 11, 0.8)',  // Warning
        'rgba(239, 68, 68, 0.8)',   // Danger
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(20, 184, 166, 0.8)'   // Teal
    ];
    
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
}

// Export charts for updates
function updateCharts(analysis) {
    initializeCharts(analysis);
}

function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
}

// Export for use in other modules
window.ChartFunctions = {
    initializeCharts,
    createRiskChart,
    createClauseTypeChart,
    createComparisonChart,
    createRiskTrendChart,
    updateCharts,
    destroyAllCharts
};

// Handle responsive chart resizing
window.addEventListener('resize', LegalLensUtils.debounce(() => {
    Object.values(charts).forEach(chart => {
        if (chart) chart.resize();
    });
}, 250));