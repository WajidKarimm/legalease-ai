// Dashboard State
let dashboardState = {
    currentContract: null,
    analysis: null,
    clauses: [],
    filteredClauses: [],
    currentTab: 'overview',
    industry: 'tech'
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await initializeDashboard();
});

async function initializeDashboard() {
    try {
        // Load contract data from localStorage or API
        const contractId = getContractIdFromUrl() || localStorage.getItem('current_contract_id');
        
        if (!contractId) {
            // No contract found, redirect to upload
            window.location.href = '../index.html';
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Fetch contract analysis
        const analysis = await LegalLensAPI.getContractAnalysis(contractId);
        
        dashboardState.analysis = analysis;
        dashboardState.clauses = analysis.clauses || [];
        dashboardState.filteredClauses = dashboardState.clauses;
        
        // Populate dashboard
        populateDashboard(analysis);
        
        // Initialize charts
        initializeCharts(analysis);
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('Failed to load contract analysis');
    }
}

function populateDashboard(analysis) {
    // Contract Header
    document.getElementById('contractTitle').textContent = analysis.title || 'Contract Analysis';
    document.getElementById('uploadDate').textContent = LegalLensUtils.formatDate(analysis.upload_date);
    document.getElementById('pageCount').textContent = analysis.page_count || '—';
    document.getElementById('clauseCount').textContent = analysis.summary.total_clauses || 0;
    
    // Risk Score
    const riskScore = analysis.summary.overall_risk_score || 0;
    document.getElementById('riskScore').textContent = riskScore.toFixed(1);
    updateRiskIndicator(riskScore);
    
    // Summary Cards
    document.getElementById('highRiskCount').textContent = analysis.summary.high_risk || 0;
    document.getElementById('mediumRiskCount').textContent = analysis.summary.medium_risk || 0;
    document.getElementById('lowRiskCount').textContent = analysis.summary.low_risk || 0;
    
    // Key Findings
    populateKeyFindings(analysis);
    
    // Clauses List
    populateClausesList(dashboardState.clauses);
    
    // Risk Assessment
    populateRiskAssessment(analysis);
    
    // Plain Summary
    if (analysis.plain_summary) {
        document.getElementById('plainSummary').innerHTML = `<p>${analysis.plain_summary}</p>`;
    }
}

function populateKeyFindings(analysis) {
    const findingsContainer = document.getElementById('keyFindings');
    
    if (!analysis.key_findings || analysis.key_findings.length === 0) {
        findingsContainer.innerHTML = '<p class="text-muted">No key findings identified.</p>';
        return;
    }
    
    const findingsHTML = analysis.key_findings.map(finding => `
        <div class="alert alert-${finding.severity || 'info'}">
            <strong>${finding.title}</strong>
            <p>${finding.description}</p>
        </div>
    `).join('');
    
    findingsContainer.innerHTML = findingsHTML;
}

function populateClausesList(clauses) {
    const clausesList = document.getElementById('clausesList');
    
    if (clauses.length === 0) {
        clausesList.innerHTML = '<div class="empty-state"><p>No clauses found</p></div>';
        return;
    }
    
    const clausesHTML = clauses.map(clause => `
        <div class="clause-card ${clause.risk_level}" data-clause-id="${clause.id}">
            <div class="clause-header">
                <div class="clause-title">
                    <h4>${clause.type}</h4>
                    <span class="badge badge-${getRiskBadgeClass(clause.risk_level)}">
                        ${clause.risk_level.toUpperCase()}
                    </span>
                </div>
                <div class="clause-score">
                    Risk: ${clause.risk_score}/10
                </div>
            </div>
            <div class="clause-content">
                <p>${LegalLensUtils.truncateText(clause.content, 200)}</p>
            </div>
            <div class="clause-concerns">
                <strong>Concerns:</strong>
                <ul>
                    ${clause.concerns.map(concern => `<li>${concern}</li>`).join('')}
                </ul>
            </div>
            <div class="clause-actions">
                <button class="btn btn-sm btn-outline" onclick="viewClauseDetails('${clause.id}')">
                    View Details
                </button>
                <button class="btn btn-sm btn-primary" onclick="chatAboutClause('${clause.id}')">
                    Ask AI
                </button>
            </div>
        </div>
    `).join('');
    
    clausesList.innerHTML = clausesHTML;
}

function populateRiskAssessment(analysis) {
    const riskContainer = document.getElementById('riskAssessment');
    
    const highRiskClauses = dashboardState.clauses.filter(c => c.risk_level === 'high');
    
    if (highRiskClauses.length === 0) {
        riskContainer.innerHTML = '<div class="alert alert-success">No high-risk clauses identified.</div>';
        return;
    }
    
    const riskHTML = `
        <div class="risk-summary">
            <h3>High Priority Items</h3>
            <p>These clauses require immediate attention and may need negotiation.</p>
        </div>
        ${highRiskClauses.map((clause, index) => `
            <div class="risk-item">
                <div class="risk-item-header">
                    <h4>${index + 1}. ${clause.type}</h4>
                    <span class="risk-score-badge">Risk: ${clause.risk_score}/10</span>
                </div>
                <div class="risk-item-body">
                    <div class="risk-content">
                        <strong>Issue:</strong>
                        <p>${clause.content}</p>
                    </div>
                    <div class="risk-concerns">
                        <strong>Why this is concerning:</strong>
                        <ul>
                            ${clause.concerns.map(concern => `<li>${concern}</li>`).join('')}
                        </ul>
                    </div>
                    ${clause.industry_comparison ? `
                        <div class="risk-comparison">
                            <strong>Industry Standard:</strong>
                            <p>Your contract is in the ${clause.industry_comparison.percentile}th percentile (more restrictive than ${clause.industry_comparison.percentile}% of contracts)</p>
                        </div>
                    ` : ''}
                    <div class="risk-actions">
                        <button class="btn btn-primary" onclick="getNegotiationAdvice('${clause.id}')">
                            Get Negotiation Advice
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    `;
    
    riskContainer.innerHTML = riskHTML;
}

function updateRiskIndicator(score) {
    const indicator = document.querySelector('.indicator-fill');
    const percentage = (score / 10) * 100;
    indicator.style.width = `${percentage}%`;
    
    // Color based on risk
    if (score >= 7) {
        indicator.style.background = '#EF4444'; // Red
    } else if (score >= 4) {
        indicator.style.background = '#F59E0B'; // Orange
    } else {
        indicator.style.background = '#10B981'; // Green
    }
}

function getRiskBadgeClass(riskLevel) {
    const map = {
        'high': 'danger',
        'medium': 'warning',
        'low': 'success'
    };
    return map[riskLevel] || 'gray';
}

// Tab Navigation
function switchTab(tabName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    dashboardState.currentTab = tabName;
    
    // Load tab-specific data
    if (tabName === 'comparison') {
        loadComparisonData();
    } else if (tabName === 'negotiation') {
        loadNegotiationGuide();
    }
}

// Clause Filtering
function filterClauses() {
    const filter = document.getElementById('clauseFilter').value;
    
    if (filter === 'all') {
        dashboardState.filteredClauses = dashboardState.clauses;
    } else {
        dashboardState.filteredClauses = dashboardState.clauses.filter(
            clause => clause.risk_level === filter
        );
    }
    
    populateClausesList(dashboardState.filteredClauses);
}

// Comparison Data
async function loadComparisonData() {
    const comparisonContainer = document.getElementById('comparisonData');
    comparisonContainer.innerHTML = '<div class="skeleton skeleton-box"></div>';
    
    try {
        const contractId = localStorage.getItem('current_contract_id');
        const industry = dashboardState.industry;
        
        const comparison = await LegalLensAPI.getIndustryComparison(contractId, industry);
        
        const comparisonHTML = `
            <div class="comparison-summary">
                <h3>Your Contract vs. ${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry</h3>
            </div>
            <div class="comparison-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Clause Type</th>
                            <th>Your Contract</th>
                            <th>Industry Standard</th>
                            <th>Percentile</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparison.comparisons.map(comp => `
                            <tr>
                                <td><strong>${comp.clause_type}</strong></td>
                                <td>${comp.your_terms}</td>
                                <td>${comp.industry_standard}</td>
                                <td>
                                    <span class="badge ${comp.percentile < 30 ? 'badge-success' : comp.percentile > 70 ? 'badge-danger' : 'badge-warning'}">
                                        ${comp.percentile}th percentile
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        comparisonContainer.innerHTML = comparisonHTML;
    } catch (error) {
        comparisonContainer.innerHTML = '<div class="alert alert-danger">Failed to load comparison data</div>';
    }
}

function updateComparison() {
    dashboardState.industry = document.getElementById('industrySelect').value;
    loadComparisonData();
}

// Negotiation Guide
async function loadNegotiationGuide() {
    const guideContainer = document.getElementById('negotiationGuide');
    
    const guide = `
        <div class="negotiation-intro">
            <h3>📋 Your Negotiation Strategy</h3>
            <p>Based on our analysis, here are the key points to negotiate:</p>
        </div>
        
        <div class="negotiation-sections">
            <div class="negotiation-section">
                <h4>1. Non-Compete Clause</h4>
                <div class="negotiation-current">
                    <strong>Current Terms:</strong>
                    <p>2 years, 50-mile radius</p>
                </div>
                <div class="negotiation-propose">
                    <strong>Propose:</strong>
                    <p>12 months, 25-mile radius</p>
                </div>
                <div class="negotiation-script">
                    <strong>How to say it:</strong>
                    <p>"I'm concerned about the 2-year non-compete period. Industry standard for similar roles is typically 12 months with a 25-mile radius. Would you be open to adjusting these terms to align with market norms?"</p>
                </div>
                <div class="negotiation-fallback">
                    <strong>Fallback position:</strong>
                    <p>18 months, 35-mile radius with exceptions for certain industries</p>
                </div>
            </div>
            
            <div class="negotiation-section">
                <h4>2. Termination & Severance</h4>
                <div class="negotiation-current">
                    <strong>Current Terms:</strong>
                    <p>At-will employment, no severance</p>
                </div>
                <div class="negotiation-propose">
                    <strong>Propose:</strong>
                    <p>2 weeks notice, 2 weeks severance per year of service</p>
                </div>
                <div class="negotiation-script">
                    <strong>How to say it:</strong>
                    <p>"I'd like to discuss adding a mutual notice period of 2 weeks and a severance package of 2 weeks per year of service. This is standard in the industry and provides stability for both parties."</p>
                </div>
            </div>
        </div>
        
        <div class="negotiation-tips">
            <h4>💡 Negotiation Tips</h4>
            <ul>
                <li>Start with your ideal terms, but be prepared to compromise</li>
                <li>Reference industry standards to back up your requests</li>
                <li>Be professional and collaborative, not confrontational</li>
                <li>Get all changes in writing before signing</li>
                <li>Consider consulting an employment lawyer for high-value contracts</li>
            </ul>
        </div>
    `;
    
    guideContainer.innerHTML = guide;
}

async function generateGuide() {
    const guideContainer = document.getElementById('negotiationGuide');
    guideContainer.innerHTML = '<div class="skeleton skeleton-box"></div>';
    
    try {
        const contractId = localStorage.getItem('current_contract_id');
        const highRiskClauses = dashboardState.clauses
            .filter(c => c.risk_level === 'high')
            .map(c => c.id);
        
        const guide = await LegalLensAPI.generateNegotiationGuide(contractId, highRiskClauses);
        
        // Render custom guide
        guideContainer.innerHTML = guide.html || '<p>Guide generated successfully</p>';
    } catch (error) {
        console.error('Error generating guide:', error);
        loadNegotiationGuide(); // Fallback to default guide
    }
}

// Actions
function viewClauseDetails(clauseId) {
    const clause = dashboardState.clauses.find(c => c.id === clauseId);
    if (clause) {
        localStorage.setItem('selected_clause', JSON.stringify(clause));
        window.location.href = 'clause-details.html';
    }
}

function chatAboutClause(clauseId) {
    const clause = dashboardState.clauses.find(c => c.id === clauseId);
    if (clause) {
        localStorage.setItem('chat_context', JSON.stringify({
            clause_id: clauseId,
            clause_type: clause.type
        }));
        window.location.href = 'chat.html';
    }
}

function getNegotiationAdvice(clauseId) {
    chatAboutClause(clauseId);
}

async function exportReport() {
    try {
        const contractId = localStorage.getItem('current_contract_id');
        const result = await LegalLensAPI.exportReport(contractId, 'pdf');
        
        if (result.success) {
            alert('Report downloaded successfully!');
        }
    } catch (error) {
        alert('Failed to export report. Please try again.');
    }
}

function newAnalysis() {
    if (confirm('Start a new analysis? Your current analysis will be saved.')) {
        localStorage.removeItem('current_contract_id');
        window.location.href = '../index.html';
    }
}

function showLoadingState() {
    // Show skeleton loaders
    document.querySelectorAll('.card-body').forEach(body => {
        body.innerHTML = `
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        `;
    });
}

function showError(message) {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <h3>Error Loading Analysis</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="window.location.reload()">
                Retry
            </button>
        </div>
    `;
}

function getContractIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Export for testing
window.DashboardFunctions = {
    switchTab,
    filterClauses,
    updateComparison,
    viewClauseDetails,
    chatAboutClause,
    exportReport,
    newAnalysis
};