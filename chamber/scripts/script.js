// Common JavaScript for all pages

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Set last modified date
document.getElementById('last-modified').textContent = document.lastModified;

// Common JavaScript for all pages

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Set last modified date
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navigation = document.getElementById('navigation');

    if (hamburgerMenu && navigation) {
        hamburgerMenu.addEventListener('click', function() {
            navigation.classList.toggle('show');
            hamburgerMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const bars = hamburgerMenu.querySelectorAll('.bar');
            if (navigation.classList.contains('show')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navigation.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('show');
                hamburgerMenu.classList.remove('active');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }
});