// Home page specific JavaScript functionality

// Global variables
let membersData = [];

// Initialize the home page
document.addEventListener('DOMContentLoaded', function() {
    initializeHamburgerMenu();
    updateLastModified();
    loadWeatherData();
    loadSpotlightMembers();
});

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

// Last modified date functionality
function updateLastModified() {
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastModifiedElement.textContent = lastModified.toLocaleDateString('en-US', options);
    }
    
    // Update current year if needed
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// ... rest of your existing JavaScript code (weather and spotlights) remains the same ...

// Weather data functionality
async function loadWeatherData() {
    const apiKey = '7cfe2610d8025acaa487ef9ed8a8fcbe';
    const lat = '5.583226607571061';
    const lon = '-0.10452039847224213';
    
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        
        if (!currentResponse.ok) {
            throw new Error(`Weather API error: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();
        
        // 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Display weather data
        displayCurrentWeather(currentData);
        displayWeatherForecast(forecastData);
        
    } catch (error) {
        console.error('Weather loading error:', error);
        document.getElementById('current-weather').innerHTML = `
            <div class="weather-error">
                <p>Weather data currently unavailable</p>
                <p class="error-detail">Please check your connection</p>
            </div>
        `;
        document.getElementById('weather-forecast').innerHTML = '<p>Forecast unavailable</p>';
    }
}

function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    
    document.getElementById('current-weather').innerHTML = `
        <div class="weather-header">
            <h3>Current Weather</h3>
            <p class="weather-location">Accra, Ghana</p>
        </div>
        <div class="weather-main">
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="weather-details">
                <p class="weather-temp">${temp}°C</p>
                <p class="weather-desc">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            </div>
        </div>
        <div class="weather-extra">
            <p>Feels like: ${feelsLike}°C</p>
            <p>Humidity: ${humidity}%</p>
        </div>
    `;
}

function displayWeatherForecast(data) {
    const dailyForecasts = [];
    const processedDays = new Set();
    
    // Get forecasts for the next 3 days
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Get one forecast per day around midday
        if (!processedDays.has(dateString) && date.getHours() >= 11 && date.getHours() <= 13) {
            processedDays.add(dateString);
            dailyForecasts.push({
                date: date,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            });
        }
    });
    
    // Take the first 3 days
    const threeDayForecast = dailyForecasts.slice(0, 3);
    
    let forecastHTML = `
        <div class="forecast-header">
            <h3>3-Day Forecast</h3>
        </div>
        <div class="forecast-grid">
    `;
    
    if (threeDayForecast.length === 0) {
        forecastHTML += '<p>No forecast data available</p>';
    } else {
        threeDayForecast.forEach(day => {
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}.png`;
            
            forecastHTML += `
                <div class="forecast-day">
                    <p class="forecast-date">${day.day}</p>
                    <img src="${iconUrl}" alt="${day.description}" class="forecast-icon">
                    <p class="forecast-temp">${day.temp}°C</p>
                    <p class="forecast-desc">${day.description.charAt(0).toUpperCase() + day.description.slice(1)}</p>
                </div>
            `;
        });
    }
    
    forecastHTML += '</div>';
    document.getElementById('weather-forecast').innerHTML = forecastHTML;
}

// Member spotlights functionality
async function loadSpotlightMembers() {
    try {
        // Load member data from JSON file
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }
        const membersData = await response.json();
        
        // Filter for gold and silver members
        const premiumMembers = membersData.filter(member => 
            member.membershipLevel === 2 || member.membershipLevel === 3
        );
        
        // Randomly select 2-3 members
        const shuffled = [...premiumMembers].sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, Math.min(3, shuffled.length));
        
        displaySpotlights(selectedMembers);
        
    } catch (error) {
        console.error('Error loading member data:', error);
        // Fallback to sample data if JSON file fails
        loadSampleSpotlightMembers();
    }
}

function loadSampleSpotlightMembers() {
    // Sample member data as fallback
    const sampleMembers = [
        {
            "name": "Manuel-Johnson Hardware",
            "address": "Teiman - Borga town, Ghana",
            "phone": "+233 55 735 9204",
            "email": "info@manueljohnson.com",
            "website": "https://manueljohnsongh.com/",
            "image": "https://placehold.co/400x300/1a365d/white?text=Hardware+Store",
            "membershipLevel": 3,
            "description": "Building Hardware Retail and Supply - Your trusted partner for quality construction materials"
        },
        {
            "name": "CalBank Ghana",
            "address": "RING ROAD CENTRAL. 989, Accra-Ghana",
            "phone": "+233 302 680 063",
            "email": "customercare@calbank.net",
            "website": "https://calbank.net/",
            "image": "https://placehold.co/400x300/2b6cb0/white?text=CalBank",
            "membershipLevel": 3,
            "description": "Better bank that rewards you everyday with innovative financial solutions"
        },
        {
            "name": "Capitol Cafe",
            "address": "5th Circular Rd. 19Cantonments Accra – Ghana",
            "phone": "+233 553 975 553",
            "email": "info@capitolgh.com",
            "website": "https://capitolgh.com/",
            "image": "https://placehold.co/400x300/ed8936/white?text=Capitol+Cafe",
            "membershipLevel": 2,
            "description": "Traditional dishes with highest quality ingredients and authentic Ghanaian flavors"
        }
    ];
    
    // Randomly select 2-3 members from sample data
    const shuffled = [...sampleMembers].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffled.slice(0, Math.min(3, shuffled.length));
    
    displaySpotlights(selectedMembers);
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    
    if (!members || members.length === 0) {
        container.innerHTML = '<div class="loading">No premium members available for spotlight</div>';
        return;
    }
    
    container.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';
        
        card.innerHTML = `
            <div class="spotlight-image">
                <img src="${member.image}" alt="${member.name}" loading="lazy">
            </div>
            <div class="spotlight-info">
                <h3 class="spotlight-name">${member.name}</h3>
                <p class="spotlight-description">${member.description}</p>
                <p class="spotlight-address">${member.address}</p>
                <p class="spotlight-phone">${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener" class="spotlight-website">Visit Website</a>
                <div class="membership-badge membership-${member.membershipLevel}">
                    ${getMembershipLevelText(member.membershipLevel)}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function getMembershipLevelText(level) {
    switch(level) {
        case 1: return 'Member';
        case 2: return 'Silver';
        case 3: return 'Gold';
        default: return 'Member';
    }
}