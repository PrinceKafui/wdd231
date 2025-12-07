// Services page specific functionality
import { fetchServices, filterServices, sortServices } from './data.js';
import Modal from './modal.js';
import { saveToLocalStorage, getFromLocalStorage, debounce } from './utils.js';

class ServicesPage {
    constructor() {
        this.services = [];
        this.filteredServices = [];
        this.modal = null;
        this.init();
    }
    
    async init() {
        // DOM Elements
        this.servicesContainer = document.getElementById('all-services-container');
        this.categoryFilter = document.getElementById('category-filter');
        this.sortFilter = document.getElementById('sort-filter');
        this.serviceCount = document.getElementById('service-count');
        this.summaryContainer = document.getElementById('services-summary');
        
        // Initialize
        this.initializeModal();
        this.initializeEventListeners();
        await this.loadServices();
        this.updateDisplay();
    }
    
    initializeModal() {
        this.modal = new Modal('serviceModal');
    }
    
    initializeEventListeners() {
        // Filter and sort event listeners
        this.categoryFilter.addEventListener('change', () => this.updateDisplay());
        this.sortFilter.addEventListener('change', () => this.updateDisplay());
        
        // Debounce for performance
        this.debouncedUpdate = debounce(() => this.updateDisplay(), 300);
        
        // FAQ accordion functionality
        this.initializeFAQAccordion();
        
        // Load user preferences
        this.loadUserPreferences();
    }
    
    async loadServices() {
        try {
            this.services = await fetchServices();
            
            // Try to load user's preferred filter from localStorage
            const preferences = getFromLocalStorage('user-preferences') || {};
            if (preferences.lastCategoryFilter) {
                this.categoryFilter.value = preferences.lastCategoryFilter;
            }
            if (preferences.lastSortFilter) {
                this.sortFilter.value = preferences.lastSortFilter;
            }
        } catch (error) {
            console.error('Error loading services:', error);
            this.services = [];
        }
    }
    
    updateDisplay() {
        this.applyFilters();
        this.displayServices();
        this.updateSummary();
        this.updateServiceCount();
        this.saveUserPreferences();
    }
    
    applyFilters() {
        // Apply category filter
        const category = this.categoryFilter.value;
        this.filteredServices = category === 'all' 
            ? [...this.services] 
            : filterServices(this.services, category);
        
        // Apply sort filter
        const sortBy = this.sortFilter.value;
        switch (sortBy) {
            case 'price-low':
                this.filteredServices.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredServices.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                this.filteredServices.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
                break;
            case 'name':
            default:
                this.filteredServices.sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    
    displayServices() {
        if (!this.servicesContainer || this.filteredServices.length === 0) {
            this.servicesContainer.innerHTML = '<p class="no-services">No services match your filters. Try a different category.</p>';
            return;
        }
        
        // Using array method: map (required)
        const servicesHTML = this.filteredServices.map(service => this.createServiceCard(service)).join('');
        
        this.servicesContainer.innerHTML = servicesHTML;
        
        // Add event listeners to service cards and buttons
        this.servicesContainer.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    const serviceId = parseInt(card.dataset.id);
                    const service = this.filteredServices.find(s => s.id === serviceId);
                    if (service) {
                        this.modal.open(service);
                    }
                }
            });
        });
        
        // Add event listeners to "View Details" buttons
        this.servicesContainer.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = parseInt(button.dataset.id);
                const service = this.filteredServices.find(s => s.id === serviceId);
                if (service) {
                    this.modal.open(service);
                }
            });
        });
        
        // Add event listeners to "Book Now" buttons
        this.servicesContainer.querySelectorAll('.book-service').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = parseInt(button.dataset.id);
                const service = this.filteredServices.find(s => s.id === serviceId);
                if (service) {
                    this.saveUserPreference(serviceId);
                    // Redirect to booking form
                    window.location.href = `index.html#booking?service=${service.category}`;
                }
            });
        });
    }
    
    createServiceCard(service) {
        // Using template literals (required)
        return `
            <div class="service-card" data-id="${service.id}" tabindex="0" role="button" aria-label="View details for ${service.name}">
                <div class="service-content">
                    <div class="service-header">
                        <h3>${service.name}</h3>
                        ${service.popular ? '<span class="popular-badge">Popular</span>' : ''}
                    </div>
                    <p>${service.description}</p>
                    <div class="service-price">GH₵ ${service.price.toFixed(2)}</div>
                    <div class="service-meta">
                        <span>⏱️ ${service.duration}</span>
                        <span>📁 ${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</span>
                        <span>${service.features.length} features included</span>
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-outline view-details" data-id="${service.id}">View Details</button>
                        <button class="btn btn-primary book-service" data-id="${service.id}">Book Now</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateSummary() {
        if (this.filteredServices.length === 0) return;
        
        // Calculate statistics
        const totalPrice = this.filteredServices.reduce((sum, service) => sum + service.price, 0);
        const averagePrice = totalPrice / this.filteredServices.length;
        const popularCount = this.filteredServices.filter(service => service.popular).length;
        
        // Using template literals
        this.summaryContainer.innerHTML = `
            <div class="summary-content">
                <div class="summary-item">
                    <span class="summary-value">${this.filteredServices.length}</span>
                    <span class="summary-label">Services Available</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">GH₵ ${averagePrice.toFixed(2)}</span>
                    <span class="summary-label">Average Price</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${popularCount}</span>
                    <span class="summary-label">Popular Services</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${this.getUniqueCategories().length}</span>
                    <span class="summary-label">Categories</span>
                </div>
            </div>
        `;
    }
    
    getUniqueCategories() {
        const categories = this.filteredServices.map(service => service.category);
        return [...new Set(categories)];
    }
    
    updateServiceCount() {
        if (this.serviceCount) {
            this.serviceCount.textContent = `${this.filteredServices.length} services found`;
        }
    }
    
    saveUserPreference(serviceId) {
        const preferences = getFromLocalStorage('user-preferences') || {};
        preferences.lastViewedService = serviceId;
        preferences.lastViewedDate = new Date().toISOString();
        saveToLocalStorage('user-preferences', preferences);
    }
    
    saveUserPreferences() {
        const preferences = getFromLocalStorage('user-preferences') || {};
        preferences.lastCategoryFilter = this.categoryFilter.value;
        preferences.lastSortFilter = this.sortFilter.value;
        preferences.lastFilteredServicesCount = this.filteredServices.length;
        saveToLocalStorage('user-preferences', preferences);
    }
    
    loadUserPreferences() {
        const preferences = getFromLocalStorage('user-preferences');
        if (preferences) {
            
            
        }
    }
    
    initializeFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answerId = question.getAttribute('aria-controls');
                const answer = document.getElementById(answerId);
                
                // Close all other FAQ items
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        const otherAnswerId = q.getAttribute('aria-controls');
                        const otherAnswer = document.getElementById(otherAnswerId);
                        otherAnswer.setAttribute('hidden', '');
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Toggle current item
                question.setAttribute('aria-expanded', !isExpanded);
                
                if (answer) {
                    if (isExpanded) {
                        answer.setAttribute('hidden', '');
                        answer.setAttribute('aria-hidden', 'true');
                    } else {
                        answer.removeAttribute('hidden');
                        answer.setAttribute('aria-hidden', 'false');
                    }
                }
            });
        });
    }
}

// Initialize services page
document.addEventListener('DOMContentLoaded', () => {
    new ServicesPage();
});