// Join page specific JavaScript functionality

// Membership benefits data
const membershipBenefits = {
    np: {
        title: "NP Membership",
        price: "No Fee",
        description: "For non-profit organizations",
        features: [
            "Basic directory listing",
            "Monthly newsletter",
            "Access to member events",
            "Business networking opportunities",
            "Community recognition"
        ],
        benefits: [
            "Free basic directory listing on our website",
            "Monthly digital newsletter with community updates",
            "Invitations to member-only networking events",
            "Access to community business forums",
            "Non-profit recognition in chamber publications",
            "Volunteer opportunity listings",
            "Community service project participation",
            "Annual non-profit showcase event"
        ]
    },
    bronze: {
        title: "Bronze Membership",
        price: "GHC2,000/year",
        description: "Essential business benefits",
        features: [
            "Enhanced directory listing",
            "Business training workshops",
            "Event discounts",
            "Social media mentions",
            "Newsletter features"
        ],
        benefits: [
            "Enhanced business directory listing with logo",
            "2 free tickets to business training workshops annually",
            "10% discount on chamber event tickets",
            "Monthly social media feature on chamber platforms",
            "Quarterly newsletter business spotlight",
            "Access to business resource library",
            "Member-to-member discount program",
            "Business referral network access"
        ]
    },
    silver: {
        title: "Silver Membership",
        price: "GHC4,000/year",
        description: "Enhanced visibility and opportunities",
        features: [
            "Premium directory listing",
            "Spotlight advertising",
            "Training program access",
            "Event sponsorship opportunities",
            "Dedicated support"
        ],
        benefits: [
            "Premium directory listing with featured placement",
            "Home page spotlight advertising (2 weeks per year)",
            "Access to all chamber training programs",
            "Priority event sponsorship opportunities",
            "Dedicated member support representative",
            "25% discount on chamber event tickets",
            "Business workshop hosting opportunities",
            "Annual business achievement recognition"
        ]
    },
    gold: {
        title: "Gold Membership",
        price: "GHC6,000/year",
        description: "Maximum exposure and influence",
        features: [
            "Featured directory placement",
            "Home page spotlight priority",
            "Executive networking events",
            "Major event sponsorships",
            "Strategic leadership opportunities"
        ],
        benefits: [
            "Featured placement in business directory",
            "Priority home page spotlight (1 month per year)",
            "Invitation to exclusive executive networking events",
            "First right of refusal for major event sponsorships",
            "Strategic planning committee participation",
            "50% discount on all chamber events",
            "Dedicated business development consultation",
            "Leadership opportunities in chamber committees"
        ]
    }
};

// Initialize join page
document.addEventListener('DOMContentLoaded', function() {
    initializeJoinPage();
});

function initializeJoinPage() {
    // Set form timestamp
    setFormTimestamp();
    
    // Create membership cards
    createMembershipCards();
    
    // Create modals
    createModals();
    
    // Add form validation
    initializeFormValidation();
    
    // Add real-time validation
    initializeRealTimeValidation();
}

// Set current timestamp in hidden field
function setFormTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }
}

// Create membership level cards
function createMembershipCards() {
    const cardsContainer = document.getElementById('membership-cards');
    
    if (!cardsContainer) return;
    
    const levels = ['np', 'bronze', 'silver', 'gold'];
    
    cardsContainer.innerHTML = levels.map(level => {
        const data = membershipBenefits[level];
        return `
            <div class="membership-card ${level}">
                <div class="membership-icon">${getMembershipIcon(level)}</div>
                <h3>${data.title}</h3>
                <div class="membership-price">${data.price}</div>
                <p class="membership-description">${data.description}</p>
                <ul class="membership-features">
                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="learn-more-btn" data-level="${level}" type="button">
                    Learn More
                </button>
            </div>
        `;
    }).join('');
    
    // Add event listeners to learn more buttons
    const learnMoreButtons = cardsContainer.querySelectorAll('.learn-more-btn');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            openModal(level);
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const level = this.getAttribute('data-level');
                openModal(level);
            }
        });
    });
}

// Get membership level icon
function getMembershipIcon(level) {
    const icons = {
        np: '🏛️',
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇'
    };
    return icons[level] || '💼';
}

// Create modals for membership benefits
function createModals() {
    const modalContainer = document.getElementById('modal-container');
    
    if (!modalContainer) return;
    
    const levels = ['np', 'bronze', 'silver', 'gold'];
    
    modalContainer.innerHTML = levels.map(level => {
        const data = membershipBenefits[level];
        return `
            <div class="modal" id="modal-${level}" role="dialog" aria-labelledby="modal-title-${level}" aria-modal="true">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title-${level}">${data.title} Benefits</h3>
                        <button class="close-modal" data-level="${level}" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <ul class="benefits-list">
                            ${data.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners to close buttons
    const closeButtons = modalContainer.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            closeModal(level);
        });
    });
    
    // Close modal when clicking outside
    const modals = modalContainer.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const level = this.id.replace('modal-', '');
                closeModal(level);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const level = openModal.id.replace('modal-', '');
                closeModal(level);
            }
        }
    });
}

// Open modal
function openModal(level) {
    const modal = document.getElementById(`modal-${level}`);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus trap inside modal
        trapFocus(modal);
    }
}

// Close modal
function closeModal(level) {
    const modal = document.getElementById(`modal-${level}`);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Return focus to the button that opened the modal
        const triggerButton = document.querySelector(`[data-level="${level}"]`);
        if (triggerButton) {
            triggerButton.focus();
        }
    }
}

// Focus trap for modal accessibility
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
        firstElement.focus();
    }
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('membership-form');
    
    if (!form) return;
    
    // Form submission validation - ONLY prevent default if validation fails
    form.addEventListener('submit', function(e) {
        console.log('Form submission started');
        
        if (!validateForm(this)) {
            e.preventDefault();
            console.log('Form validation failed - submission prevented');
            showFormError('Please fix the errors highlighted above before submitting.');
        } else {
            console.log('Form validation passed - allowing submission to thankyou.html');
            // Allow the form to submit naturally to thankyou.html
        }
    });
}

// Initialize real-time validation
function initializeRealTimeValidation() {
    const form = document.getElementById('membership-form');
    
    if (!form) return;
    
    // Real-time validation for organizational title
    const orgTitleInput = form.querySelector('input[name="orgTitle"]');
    if (orgTitleInput) {
        orgTitleInput.addEventListener('blur', function() {
            validateOrgTitle(this);
        });
        
        orgTitleInput.addEventListener('input', function() {
            // Clear error when user starts typing
            if (this.value) {
                clearFieldError(this);
                this.style.borderColor = '';
            }
        });
    }
    
    // Real-time email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // Clear errors when user focuses on fields
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            clearFieldError(this);
            this.style.borderColor = '';
        });
    });
}

// Validate organizational title
function validateOrgTitle(input) {
    const value = input.value.trim();
    
    if (value === '') {
        // Empty is allowed since it's not required
        return true;
    }
    
    const pattern = /^[A-Za-z\s\-]{7,}$/;
    
    if (!pattern.test(value)) {
        input.style.borderColor = '#e53e3e';
        showFieldError(input, 'Title must be at least 7 characters and contain only letters, spaces, and hyphens');
        return false;
    }
    
    input.style.borderColor = '#38a169';
    return true;
}

// Validate email format
function validateEmail(input) {
    const value = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value && !emailPattern.test(value)) {
        input.style.borderColor = '#e53e3e';
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    if (value) {
        input.style.borderColor = '#38a169';
    }
    
    return true;
}

// Show field error message
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Clear field error message
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    
    // Clear all previous errors
    const existingErrors = form.querySelectorAll('.field-error, .form-error-message');
    existingErrors.forEach(error => error.remove());
    
    // Reset all borders
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e53e3e';
            showFieldError(field, 'This field is required');
        }
    });
    
    // Validate organizational title if provided
    const orgTitleInput = form.querySelector('input[name="orgTitle"]');
    if (orgTitleInput && orgTitleInput.value.trim()) {
        if (!validateOrgTitle(orgTitleInput)) {
            isValid = false;
        }
    }
    
    // Validate email format
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        if (!validateEmail(emailInput)) {
            isValid = false;
        }
    }
    
    // Check if a membership level is selected
    const membershipSelected = form.querySelector('input[name="membershipLevel"]:checked');
    if (!membershipSelected) {
        isValid = false;
        const radioGroup = form.querySelector('.radio-group');
        if (radioGroup) {
            showFieldError(radioGroup, 'Please select a membership level');
        }
    }
    
    return isValid;
}

// Show form error message
function showFormError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('membership-form');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}