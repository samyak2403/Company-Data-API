// Global variables
let companiesData = [];
let filteredCompanies = [];
let industries = new Set();
let companySizes = new Set();

// DOM elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const industryFilter = document.getElementById('industry-filter');
const recruitmentFilter = document.getElementById('recruitment-filter');
const sizeFilter = document.getElementById('size-filter');
const resultsCount = document.getElementById('results-count');
const companiesContainer = document.getElementById('companies-container');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const modal = document.getElementById('company-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchBtn.addEventListener('click', applyFilters);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilters();
});
industryFilter.addEventListener('change', applyFilters);
recruitmentFilter.addEventListener('change', applyFilters);
sizeFilter.addEventListener('change', applyFilters);
gridViewBtn.addEventListener('click', () => changeView('grid'));
listViewBtn.addEventListener('click', () => changeView('list'));
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Initialize the application
async function initializeApp() {
    try {
        await fetchCompaniesData();
        populateFilterOptions();
        applyFilters();
    } catch (error) {
        console.error('Error initializing app:', error);
        companiesContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load companies data. Please try again later.</p>
            </div>
        `;
    }
}

// Fetch companies data from the JSON file
async function fetchCompaniesData() {
    try {
        const response = await fetch('data/database.json');
        const data = await response.json();
        
        // Extract company data from the JSON structure
        companiesData = data.map(item => item.companies);
        
        // Collect unique industries and company sizes for filters
        companiesData.forEach(company => {
            if (company.industry) industries.add(company.industry);
            if (company.size) companySizes.add(company.size);
        });
        
        return companiesData;
    } catch (error) {
        console.error('Error fetching companies data:', error);
        throw error;
    }
}

// Populate filter dropdowns with options
function populateFilterOptions() {
    // Populate industry filter
    industries.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry;
        option.textContent = industry;
        industryFilter.appendChild(option);
    });
    
    // Populate company size filter
    companySizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeFilter.appendChild(option);
    });
}

// Apply filters and search
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedIndustry = industryFilter.value;
    const selectedRecruitment = recruitmentFilter.value;
    const selectedSize = sizeFilter.value;
    
    filteredCompanies = companiesData.filter(company => {
        // Search term filter
        const matchesSearch = 
            !searchTerm || 
            company.name.toLowerCase().includes(searchTerm) ||
            company.industry?.toLowerCase().includes(searchTerm) ||
            company.headquarters?.toLowerCase().includes(searchTerm) ||
            company.description?.toLowerCase().includes(searchTerm);
        
        // Industry filter
        const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
        
        // Recruitment status filter
        const matchesRecruitment = !selectedRecruitment || company.recruitmentStatus === selectedRecruitment;
        
        // Company size filter
        const matchesSize = !selectedSize || company.size === selectedSize;
        
        return matchesSearch && matchesIndustry && matchesRecruitment && matchesSize;
    });
    
    displayCompanies(filteredCompanies);
}

// Display companies in the container
function displayCompanies(companies) {
    // Update results count
    resultsCount.textContent = `(${companies.length})`;
    
    // Clear the container
    companiesContainer.innerHTML = '';
    
    if (companies.length === 0) {
        companiesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No companies found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    // Create and append company cards
    companies.forEach(company => {
        const card = createCompanyCard(company);
        companiesContainer.appendChild(card);
    });
}

// Create a company card element
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    
    // Determine status class
    let statusClass = '';
    switch (company.recruitmentStatus) {
        case 'Active':
            statusClass = 'status-active';
            break;
        case 'Completed':
            statusClass = 'status-completed';
            break;
        case 'On Hold':
            statusClass = 'status-hold';
            break;
        case 'Inactive':
            statusClass = 'status-inactive';
            break;
    }
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${company.name}</h3>
            <p>${company.industry || 'Industry not specified'}</p>
        </div>
        <div class="card-body">
            <div class="company-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${company.headquarters || 'Location not specified'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>${company.size || 'Size not specified'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Founded: ${company.founded || 'Not specified'}</span>
                </div>
            </div>
            <div class="recruitment-info">
                <span class="recruitment-status ${statusClass}">
                    ${company.recruitmentStatus || 'Status not specified'}
                </span>
                <div class="info-item">
                    <i class="fas fa-briefcase"></i>
                    <span>${company.jobRoles || 'Roles not specified'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${company.ctcRange || 'CTC not specified'}</span>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <button class="view-details-btn" data-company-id="${company.companyId}">View Details</button>
        </div>
    `;
    
    // Add event listener to the view details button
    card.querySelector('.view-details-btn').addEventListener('click', () => showCompanyDetails(company));
    
    return card;
}

// Show company details in a modal
function showCompanyDetails(company) {
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${company.name}</h2>
            <p>${company.industry || 'Industry not specified'} | ${company.headquarters || 'Location not specified'}</p>
        </div>
        <div class="modal-body">
            <div class="detail-section">
                <h3>Company Information</h3>
                <p><strong>Size:</strong> ${company.size || 'Not specified'}</p>
                <p><strong>Founded:</strong> ${company.founded || 'Not specified'}</p>
                <p><strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website || 'Not available'}</a></p>
                <p><strong>Description:</strong> ${company.description || 'No description available'}</p>
            </div>
            
            <div class="detail-section">
                <h3>Recruitment Information</h3>
                <p><strong>Status:</strong> <span class="recruitment-status ${getStatusClass(company.recruitmentStatus)}">${company.recruitmentStatus || 'Not specified'}</span></p>
                <p><strong>Job Roles:</strong> ${company.jobRoles || 'Not specified'}</p>
                <p><strong>CTC Range:</strong> ${company.ctcRange || 'Not specified'}</p>
                <p><strong>Hiring Frequency:</strong> ${company.hiringFrequency || 'Not specified'}</p>
                <p><strong>Campus Recruitment:</strong> ${company.campusRecruitment ? 'Yes' : 'No'}</p>
                <p><strong>Minimum GPA:</strong> ${company.minGpa || 'Not specified'}</p>
                <p><strong>Required Skills:</strong> ${company.skills || 'Not specified'}</p>
                <p><strong>Preferred Colleges:</strong> ${company.preferredColleges || 'Not specified'}</p>
                <p><strong>Last Recruitment:</strong> ${company.lastRecruitment || 'Not specified'}</p>
                <p><strong>Next Recruitment:</strong> ${company.nextRecruitment || 'Not specified'}</p>
                <p><strong>Internships Available:</strong> ${company.internships ? 'Yes' : 'No'}</p>
            </div>
            
            <div class="detail-section">
                <h3>Contact Information</h3>
                <p><strong>HR Email:</strong> <a href="mailto:${company.hrEmail}">${company.hrEmail || 'Not available'}</a></p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Get status class for a recruitment status
function getStatusClass(status) {
    switch (status) {
        case 'Active':
            return 'status-active';
        case 'Completed':
            return 'status-completed';
        case 'On Hold':
            return 'status-hold';
        case 'Inactive':
            return 'status-inactive';
        default:
            return '';
    }
}

// Change view between grid and list
function changeView(viewType) {
    if (viewType === 'grid') {
        companiesContainer.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        companiesContainer.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
} 