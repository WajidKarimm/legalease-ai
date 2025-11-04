// Dashboard specific functionality
import { API, endpoints } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    try {
        await loadStats();
        initActivityChart();
        loadRecentActivity();
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
    }
}

async function loadStats() {
    try {
        const stats = await API.get('/stats');
        updateDashboardStats(stats);
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function updateDashboardStats(stats) {
    document.getElementById('docs-analyzed').textContent = stats.documentsAnalyzed || 0;
    document.getElementById('active-projects').textContent = stats.activeProjects || 0;
}

function initActivityChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Document Analysis Activity',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadRecentActivity() {
    try {
        const activity = await API.get('/activity');
        displayRecentActivity(activity);
    } catch (error) {
        console.error('Failed to load recent activity:', error);
    }
}

function displayRecentActivity(activity) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = activity.map(item => `
        <div class="activity-item">
            <span class="activity-time">${new Date(item.timestamp).toLocaleString()}</span>
            <span class="activity-description">${item.description}</span>
        </div>
    `).join('');
}