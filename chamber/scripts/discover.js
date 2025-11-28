import attractions from '../data/attractions.mjs';

document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('gallery-container');
    const visitorMessage = document.getElementById('visitor-message');
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');
    
   // Hamburger menu functionality
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event from bubbling up
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            // Change hamburger icon
            if (isExpanded) {
                hamburger.innerHTML = '✕';
            } else {
                hamburger.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.innerHTML = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.innerHTML = '☰';
            }
        });
        
        // Prevent menu from closing when clicking inside the menu
        navMenu.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
}

    // Set current year and last modified date
    function setFooterDates() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
        if (lastModified) {
            lastModified.textContent = document.lastModified;
        }
    }

    // Display visitor message
    function displayVisitorMessage() {
        if (!visitorMessage) return;

        const lastVisit = localStorage.getItem('lastVisit');
        const currentVisit = Date.now();
        
        let message = '';

        if (!lastVisit) {
            message = 'Welcome! Let us know if you have any questions.';
        } else {
            const daysBetween = Math.floor((currentVisit - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
            
            if (daysBetween < 1) {
                message = 'Back so soon! Awesome!';
            } else {
                const dayText = daysBetween === 1 ? 'day' : 'days';
                message = `You last visited ${daysBetween} ${dayText} ago.`;
            }
        }

        visitorMessage.textContent = message;
        localStorage.setItem('lastVisit', currentVisit.toString());
    }

    // Generate attraction cards
    function generateAttractionCards() {
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';

        attractions.forEach(attraction => {
            const card = document.createElement('article');
            card.className = 'card';
            
            card.innerHTML = `
                <figure class="card-image">
                    <img src="${attraction.image}" alt="${attraction.name}" loading="lazy">
                </figure>
                <div class="card-content">
                    <h2>${attraction.name}</h2>
                    <address>${attraction.address}</address>
                    <p>${attraction.description}</p>
                    <button class="learn-more-btn" onclick="learnMore('${attraction.name}')">Learn More</button>
                </div>
            `;
            
            galleryContainer.appendChild(card);
        });
    }

    // Global function for learn more buttons
    window.learnMore = function(attractionName) {
        alert(`More information about ${attractionName} will be available soon!`);
    };
});