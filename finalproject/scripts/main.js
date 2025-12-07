// Main JavaScript module
import { fetchServices, filterServices, sortServices } from './data.js';
import { saveToLocalStorage, getFromLocalStorage, updateLastModified, updateCurrentYear } from './utils.js';
import Modal from './modal.js';

class SparkAndShineWebsite {
    constructor() {
        this.services = [];
        this.modal = null;
        this.init();
    }
    
       async init() {
        // DOM Elements
        this.servicesContainer = document.getElementById('services-container');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.bookingForm = document.getElementById('bookingForm');
        
        // Initialize
        this.initializeModal();
        this.initializeEventListeners();
        await this.loadServices();
        this.updateUI();
        
        // Initialize page-specific features
        this.initializePageSpecificFeatures();
        
        // Set last modified date and current year
        updateLastModified();
        updateCurrentYear();
    }
    
    initializeModal() {
        this.modal = new Modal('serviceModal');
    }
    
    initializeEventListeners() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Booking form submission
        if (this.bookingForm) {
            this.bookingForm.addEventListener('submit', (e) => this.handleBookingForm(e));
        }
        
        // Save user preferences on service click
        document.addEventListener('click', (e) => {
            const serviceCard = e.target.closest('.service-card');
            if (serviceCard) {
                const serviceId = parseInt(serviceCard.dataset.id);
                this.saveUserPreference(serviceId);
            }
        });
    }
    
    async loadServices() {
        // Try to get from localStorage first
        const cachedServices = getFromLocalStorage('spark-and-shine-services');
        
        if (cachedServices && cachedServices.length >= 15) {
            this.services = cachedServices;
        } else {
            // Fetch from JSON file
            this.services = await fetchServices();
            saveToLocalStorage('spark-and-shine-services', this.services);
        }
    }
    
    updateUI() {
        this.displayServices();
        this.updateServiceCount();
    }
    
    displayServices() {
        if (!this.servicesContainer || this.services.length === 0) return;
        
        // Using array method: map (required)
        const servicesHTML = this.services.map(service => this.createServiceCard(service)).join('');
        
        this.servicesContainer.innerHTML = servicesHTML;
        
        // Add event listeners to service cards
        this.servicesContainer.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) { // Don't trigger if clicking the button
                    const serviceId = parseInt(card.dataset.id);
                    const service = this.services.find(s => s.id === serviceId);
                    if (service) {
                        this.modal.open(service);
                    }
                }
            });
        });
    }
    
    createServiceCard(service) {
        // Using template literals (required)
        return `
            <div class="service-card" data-id="${service.id}" tabindex="0" role="button" aria-label="View details for ${service.name}">
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <div class="service-price">GH₵ ${service.price.toFixed(2)}</div>
                    <div class="service-meta">
                        <span>⏱️ ${service.duration}</span>
                        <span>📁 ${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</span>
                    </div>
                    <button class="btn btn-outline view-details" data-id="${service.id}">View Details</button>
                </div>
            </div>
        `;
    }
    
    updateServiceCount() {
        const serviceCount = document.getElementById('service-count');
        if (serviceCount) {
            serviceCount.textContent = this.services.length;
        }
    }
    
    saveUserPreference(serviceId) {
        const preferences = getFromLocalStorage('user-preferences') || {};
        preferences.lastViewedService = serviceId;
        preferences.lastViewedDate = new Date().toISOString();
        saveToLocalStorage('user-preferences', preferences);
    }
    
    toggleMobileMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.mainNav.setAttribute('aria-hidden', isExpanded);
        
        // Update hamburger animation
        this.menuToggle.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }
    
    closeMobileMenu() {
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.setAttribute('aria-hidden', 'true');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleBookingForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.bookingForm);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            serviceType: formData.get('service-type'),
            date: formData.get('date'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            submittedAt: new Date().toISOString()
        };
        
        // Save booking data to localStorage
        const bookings = getFromLocalStorage('booking-requests') || [];
        bookings.push(bookingData);
        saveToLocalStorage('booking-requests', bookings);
        
        // Redirect to form action page
        const queryParams = new URLSearchParams(bookingData).toString();
        window.location.href = `form-action.html?${queryParams}`;
    }



    // Check if we're on the services page
    isServicesPage() {
        return window.location.pathname.includes('services.html');
    }
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures() {
        if (this.isServicesPage()) {
            // Load services page specific JavaScript
            import('./services.js')
                .catch(error => console.error('Error loading services module:', error));
        }
    }



        // Check if we're on the contact page
    isContactPage() {
        return window.location.pathname.includes('contact.html');
    }
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures() {
        if (this.isServicesPage()) {
            // Load services page specific JavaScript
            import('./services.js')
                .catch(error => console.error('Error loading services module:', error));
        } else if (this.isContactPage()) {
            // Load contact page specific JavaScript
            import('./contact.js')
                .catch(error => console.error('Error loading contact module:', error));
        }
    }



}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SparkAndShineWebsite();
});


