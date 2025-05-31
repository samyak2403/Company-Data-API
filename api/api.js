/**
 * Company Data API
 * Handles API requests, authentication, and responses
 */

// API Configuration
const API_CONFIG = {
    version: '1.0.0',
    rateLimit: {
        default: 100, // requests per hour
        demo: 50      // requests per hour for demo key
    },
    demoKey: 'demo-key-123456'
};

// Initialize API keys in local storage if they don't exist
function initializeApiKeys() {
    if (!localStorage.getItem('apiKeys')) {
        const initialKeys = [{
            key: API_CONFIG.demoKey,
            owner: 'Demo User',
            rateLimit: API_CONFIG.rateLimit.demo,
            created: new Date().toISOString(),
            calls: {
                total: 0,
                lastHour: 0,
                lastReset: new Date().toISOString()
            }
        }];
        localStorage.setItem('apiKeys', JSON.stringify(initialKeys));
    }
}

// Get all API keys from local storage
function getApiKeys() {
    return JSON.parse(localStorage.getItem('apiKeys') || '[]');
}

// Save API keys to local storage
function saveApiKeys(keys) {
    localStorage.setItem('apiKeys', JSON.stringify(keys));
}

// Validate API key
function validateApiKey(key) {
    const keys = getApiKeys();
    const apiKey = keys.find(k => k.key === key);
    
    if (!apiKey) {
        return {
            valid: false,
            error: 'Invalid API key'
        };
    }
    
    // Check rate limiting
    const now = new Date();
    const lastReset = new Date(apiKey.calls.lastReset);
    const hoursPassed = (now - lastReset) / (1000 * 60 * 60);
    
    // Reset counter if more than an hour has passed
    if (hoursPassed >= 1) {
        apiKey.calls.lastHour = 0;
        apiKey.calls.lastReset = now.toISOString();
    }
    
    // Check if rate limit exceeded
    if (apiKey.calls.lastHour >= apiKey.rateLimit) {
        return {
            valid: false,
            error: 'Rate limit exceeded',
            resetTime: new Date(lastReset.getTime() + (60 * 60 * 1000)).toISOString()
        };
    }
    
    return {
        valid: true,
        key: apiKey
    };
}

// Update API key usage
function updateApiKeyUsage(key) {
    const keys = getApiKeys();
    const apiKeyIndex = keys.findIndex(k => k.key === key);
    
    if (apiKeyIndex !== -1) {
        keys[apiKeyIndex].calls.total += 1;
        keys[apiKeyIndex].calls.lastHour += 1;
        saveApiKeys(keys);
    }
}

// Generate API response
function generateResponse(status, data = null, error = null) {
    return {
        status,
        timestamp: new Date().toISOString(),
        data,
        error
    };
}

// Handle API requests
async function handleApiRequest(params) {
    // Check for API key
    if (!params.api_key) {
        return generateResponse(401, null, 'API key is required');
    }
    
    // Validate API key
    const keyValidation = validateApiKey(params.api_key);
    if (!keyValidation.valid) {
        return generateResponse(403, null, keyValidation.error);
    }
    
    // Update API key usage
    updateApiKeyUsage(params.api_key);
    
    // Check for endpoint
    if (!params.endpoint) {
        return generateResponse(400, null, 'Endpoint parameter is required');
    }
    
    try {
        // Fetch the database
        const response = await fetch('../data/database.json');
        if (!response.ok) {
            throw new Error('Failed to fetch database');
        }
        
        const database = await response.json();
        const companies = database.companies || [];
        
        // Handle different endpoints
        switch (params.endpoint.toLowerCase()) {
            case 'companies':
                return generateResponse(200, companies);
                
            case 'company':
                if (!params.id) {
                    return generateResponse(400, null, 'Company ID is required');
                }
                
                const company = companies.find(c => c.companyId.toString() === params.id.toString());
                if (!company) {
                    return generateResponse(404, null, 'Company not found');
                }
                
                return generateResponse(200, company);
                
            case 'search':
                if (!params.term) {
                    return generateResponse(400, null, 'Search term is required');
                }
                
                const term = params.term.toLowerCase();
                const results = companies.filter(company => 
                    company.name.toLowerCase().includes(term) || 
                    company.industry.toLowerCase().includes(term) || 
                    (company.headquarters && company.headquarters.toLowerCase().includes(term))
                );
                
                return generateResponse(200, results);
                
            case 'industries':
                const industries = [...new Set(companies.map(company => company.industry))].sort();
                return generateResponse(200, industries);
                
            case 'sizes':
                const sizes = [...new Set(companies.map(company => company.size))].sort();
                return generateResponse(200, sizes);
                
            case 'stats':
                const stats = {
                    totalCompanies: companies.length,
                    industries: [...new Set(companies.map(company => company.industry))].length,
                    activelyRecruiting: companies.filter(company => company.isRecruiting).length,
                    notRecruiting: companies.filter(company => !company.isRecruiting).length
                };
                return generateResponse(200, stats);
                
            default:
                return generateResponse(400, null, 'Invalid endpoint');
        }
    } catch (error) {
        console.error('API Error:', error);
        return generateResponse(500, null, 'Internal server error');
    }
}

// Parse URL parameters
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Handle API request if this is the API endpoint page
async function processApiRequest() {
    // Only process if this is the API endpoint page (index.html in the api folder)
    if (window.location.pathname.includes('/api/') && 
        (window.location.pathname.endsWith('/api/') || 
         window.location.pathname.endsWith('/api/index.html'))) {
        
        const params = parseUrlParams();
        
        // If there are API parameters, process the request
        if (params.endpoint) {
            const response = await handleApiRequest(params);
            
            // Return JSON response
            document.body.innerHTML = '';
            document.body.style.fontFamily = 'monospace';
            document.body.style.whiteSpace = 'pre';
            document.body.textContent = JSON.stringify(response, null, 2);
            
            // Set content type header for JSON (doesn't work in all browsers)
            document.contentType = 'application/json';
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeApiKeys();
    processApiRequest();
});

// Export functions for use in other scripts
window.CompanyDataApi = {
    validateApiKey,
    getApiKeys,
    saveApiKeys,
    generateApiKey: () => {
        const randomString = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);
        return `api-${randomString}`;
    }
}; 