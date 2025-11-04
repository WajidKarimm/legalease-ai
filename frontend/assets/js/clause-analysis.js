// Clause analysis functionality
import { API, endpoints } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    initClauseAnalysis();
});

function initClauseAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const fileInput = document.getElementById('document-upload');

    if (analyzeBtn && fileInput) {
        analyzeBtn.addEventListener('click', () => handleAnalysis(fileInput.files[0]));
    }
}

async function handleAnalysis(file) {
    if (!file) {
        alert('Please select a file first');
        return;
    }

    try {
        const results = await API.upload(endpoints.predict, file);
        displayAnalysisResults(results);
    } catch (error) {
        console.error('Analysis failed:', error);
        alert('Failed to analyze document. Please try again.');
    }
}

function displayAnalysisResults(results) {
    const resultsContainer = document.getElementById('analysis-results');
    
    if (!results || !resultsContainer) return;

    resultsContainer.innerHTML = `
        <div class="analysis-summary">
            <h4>Document Analysis Summary</h4>
            <p>Total Clauses: ${results.totalClauses}</p>
            <p>Potential Issues: ${results.potentialIssues}</p>
        </div>
        <div class="clauses-list">
            ${results.clauses.map(clause => `
                <div class="clause-item ${clause.risk}">
                    <h5>${clause.title}</h5>
                    <p>${clause.description}</p>
                    <div class="risk-level">Risk Level: ${clause.risk}</div>
                </div>
            `).join('')}
        </div>
    `;
}