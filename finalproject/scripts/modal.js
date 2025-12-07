// Modal functionality module
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.modalClose = this.modal?.querySelector('.modal-close');
        this.modalTitle = this.modal?.querySelector('#modal-title');
        this.modalBody = this.modal?.querySelector('#modal-body');
        
        this.init();
    }
    
    init() {
        // Close modal when clicking X
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.close());
        }
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.getAttribute('aria-hidden') === 'false') {
                this.close();
            }
        });
    }
    
    open(service) {
        if (!service) return;
        
        // Update modal content
        this.modalTitle.textContent = service.name;
        
        this.modalBody.innerHTML = `
            <div class="service-details">
                <p><strong>Description:</strong> ${service.description}</p>
                <p><strong>Price:</strong> GH₵ ${service.price.toFixed(2)}</p>
                <p><strong>Duration:</strong> ${service.duration}</p>
                <p><strong>Category:</strong> ${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</p>
                <p><strong>Features:</strong></p>
                <ul>
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                ${service.popular ? '<p class="popular-tag">🌟 Popular Service</p>' : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" id="bookThisService">Book This Service</button>
            </div>
        `;
        
        // Add event listener to book button
        setTimeout(() => {
            const bookBtn = document.getElementById('bookThisService');
            if (bookBtn) {
                bookBtn.addEventListener('click', () => {
                    this.close();
                    // Scroll to booking form and populate service type
                    const bookingForm = document.getElementById('bookingForm');
                    const serviceSelect = document.getElementById('service-type');
                    if (bookingForm && serviceSelect) {
                        serviceSelect.value = service.category;
                        bookingForm.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }, 100);
        
        // Show modal
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Focus trap
        this.setFocusTrap();
    }
    
    close() {
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Return focus to the element that opened the modal
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }
    
    setFocusTrap() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            this.firstFocusableElement = focusableElements[0];
            this.lastFocusableElement = focusableElements[focusableElements.length - 1];
            
            this.firstFocusableElement.focus();
            
            // Trap focus within modal
            this.modal.addEventListener('keydown', this.handleTabKey.bind(this));
        }
    }
    
    handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusableElement) {
                this.lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === this.lastFocusableElement) {
                this.firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
}

export default Modal;