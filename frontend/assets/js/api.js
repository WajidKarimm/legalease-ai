// API configuration and endpoints
const API_BASE_URL = 'http://localhost:8000';

class API {
    static async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // File upload method
    static async upload(endpoint, file) {
        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get contract analysis by ID
    static async getContractAnalysis(contractId) {
        return await this.get(`/api/contracts/${contractId}/analysis`);
    }

    // Health check
    static async healthCheck() {
        return await this.get('/api/health');
    }

    // Upload and analyze contract
    static async analyzeContract(file) {
        return await this.upload('/api/predict', file);
    }
}

// API endpoints
const endpoints = {
    predict: '/api/predict',
    health: '/api/health',
    contracts: '/api/contracts'
};

// Legacy API wrapper for compatibility
const LegalLensAPI = {
    getContractAnalysis: async (contractId) => {
        // For now, return mock data since we don't have this endpoint yet
        // TODO: Implement backend endpoint for contract retrieval
        const storedAnalysis = localStorage.getItem('legallens_analysis');
        if (storedAnalysis) {
            return JSON.parse(storedAnalysis);
        }
        throw new Error('No contract analysis found');
    },
    
    uploadContract: async (file) => {
        return await API.analyzeContract(file);
    }
};

// Make available globally
window.API = API;
window.LegalLensAPI = LegalLensAPI;

export { API, endpoints, LegalLensAPI };