// Global state
const state = {
    currentUser: null,
    currentContract: null,
    analysisResults: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    checkAuth();
    loadFromLocalStorage();
}

// Event Listeners
function setupEventListeners() {
    // File upload
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showUpload() {
    showModal('uploadModal');
}

function showUploadModal() {
    showModal('uploadModal');
}

function showLogin() {
    // Redirect to login page or show login modal
    alert('Login functionality - integrate with your auth system');
}

function showSignup() {
    // Redirect to signup page or show signup modal
    alert('Signup functionality - integrate with your auth system');
}

function showDemo() {
    alert('Demo video functionality - integrate with video player');
}

function scrollToDemo() {
    const demoSection = document.getElementById('how-it-works');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleFileSelect(event) {
    handleFileUpload(event);
}

// Mobile Menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (toggle) {
        toggle.classList.toggle('active');
    }
}

// File Upload Handlers
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.style.background = 'var(--gray-50)';
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.borderColor = '';
    event.currentTarget.style.background = '';
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = event.currentTarget;
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// File Processing
async function processFile(file) {
    // Validate file
    if (!validateFile(file)) {
        return;
    }
    
    // Show processing state
    showProcessingState();
    
    try {
        // Upload and analyze using the API
        const result = await window.LegalLensAPI.uploadContract(file);
        
        // Store results
        state.currentContract = {
            id: result.contract_id || Date.now().toString(),
            filename: file.name,
            upload_date: new Date().toISOString()
        };
        state.analysisResults = result;
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Redirect to dashboard
        window.location.href = 'pages/dashboard.html';
    } catch (error) {
        console.error('Upload error:', error);
        showError('An error occurred. Please try again.');
    }
}

function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
        showError('File size must be less than 10MB');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showError('Please upload a PDF or Word document');
        return false;
    }
    
    return true;
}

function showProcessingState() {
    const uploadArea = document.getElementById('uploadArea');
    const processingArea = document.getElementById('processingArea');
    
    if (uploadArea && processingArea) {
        uploadArea.style.display = 'none';
        processingArea.style.display = 'block';
    }
    
    // Simulate processing steps
    const steps = [
        'Extracting text...',
        'Identifying clauses...',
        'Analyzing risks...',
        'Comparing with database...',
        'Generating insights...'
    ];
    
    let stepIndex = 0;
    const stepElement = document.getElementById('processingStep');
    
    const interval = setInterval(() => {
        if (stepElement && stepIndex < steps.length) {
            stepElement.textContent = steps[stepIndex];
            stepIndex++;
        } else {
            clearInterval(interval);
        }
    }, 800);
}

function showError(message) {
    // Hide processing state
    const uploadArea = document.getElementById('uploadArea');
    const processingArea = document.getElementById('processingArea');
    
    if (uploadArea && processingArea) {
        uploadArea.style.display = 'block';
        processingArea.style.display = 'none';
    }
    
    // Show error alert
    alert(message);
}

// Smooth Scrolling
function smoothScroll(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Pricing Plans
function selectPlan(plan) {
    if (plan === 'free') {
        showUploadModal();
    } else if (plan === 'business') {
        alert('Contact sales: hello@legallens.ai');
    } else {
        showUploadModal();
    }
}

// Local Storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('legallens_contract', JSON.stringify(state.currentContract));
        localStorage.setItem('legallens_analysis', JSON.stringify(state.analysisResults));
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const contract = localStorage.getItem('legallens_contract');
        const analysis = localStorage.getItem('legallens_analysis');
        
        if (contract) state.currentContract = JSON.parse(contract);
        if (analysis) state.analysisResults = JSON.parse(analysis);
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

function clearLocalStorage() {
    try {
        localStorage.removeItem('legallens_contract');
        localStorage.removeItem('legallens_analysis');
        state.currentContract = null;
        state.analysisResults = null;
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

// Auth
function checkAuth() {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Validate token with backend
        state.currentUser = { authenticated: true };
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    state.currentUser = null;
    clearLocalStorage();
    window.location.href = '/';
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export state for other modules
window.LegalLensState = state;
window.LegalLensUtils = {
    formatDate,
    formatFileSize,
    truncateText,
    debounce,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
};

console.log('LegalLens AI initialized');