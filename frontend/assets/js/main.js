// Main application logic
import { API, endpoints } from './api.js';

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Initialize components
    setupNavigation();
    setupEventListeners();
    checkAuthState();
}

function setupNavigation() {
    // Add navigation event listeners
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function setupEventListeners() {
    // Add global event listeners
    const uploadBtn = document.querySelector('#upload-document');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleDocumentUpload);
    }
}

function checkAuthState() {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
        // Redirect to login if needed
        // window.location.href = '/login.html';
    }
}

// Event handlers
async function handleDocumentUpload(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);

        const response = await API.post(endpoints.analyze, formData);
        // Handle response
        console.log('Upload successful:', response);
    } catch (error) {
        console.error('Upload failed:', error);
    }
}

function handleNavigation(event) {
    event.preventDefault();
    const path = event.target.getAttribute('href');
    // Handle navigation
    window.history.pushState({}, '', path);
}