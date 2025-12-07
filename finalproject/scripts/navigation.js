// navigation.js - Shared navigation functionality
export class NavigationManager {
    constructor() {
        this.menuToggle = null;
        this.mainNav = null;
    }
    
    init() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        
        if (!this.menuToggle || !this.mainNav) return;
        
        this.initializeHamburger();
    }
    
    initializeHamburger() {
        this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Set initial ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.setAttribute('aria-hidden', 'true');
    }
    
    toggleMobileMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.mainNav.setAttribute('aria-hidden', isExpanded);
        
        // Toggle body scroll
        document.body.style.overflow = isExpanded ? '' : 'hidden';
        
        // Update hamburger animation
        this.menuToggle.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.setAttribute('aria-hidden', 'true');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Auto-initialize on all pages
document.addEventListener('DOMContentLoaded', () => {
    const navManager = new NavigationManager();
    navManager.init();
});