
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const primaryNav = document.getElementById('primaryNav');
    
    hamburgerBtn.addEventListener('click', function() {
        primaryNav.classList.toggle('active');
        
        
        const span = hamburgerBtn.querySelector('span');
        if (primaryNav.classList.contains('active')) {
            span.textContent = '✕';
        } else {
            span.textContent = '☰';
        }
    });
    
    
    const navLinks = primaryNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                primaryNav.classList.remove('active');
                const span = hamburgerBtn.querySelector('span');
                span.textContent = '☰';
            }
        });
    });
    

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            primaryNav.classList.remove('active');
            const span = hamburgerBtn.querySelector('span');
            span.textContent = '☰';
        }
    });
});