// Contact page specific functionality
import { saveToLocalStorage, getFromLocalStorage, updateLastModified, updateCurrentYear } from './utils.js';

class ContactPage {
    constructor() {
        this.weatherData = null;
        this.lastWeatherUpdate = null;
        this.init();
    }


    
    async init() {
        // DOM Elements
        this.weatherWidget = document.getElementById('weather-widget');
        this.currentWeather = document.getElementById('current-weather');
        this.weatherForecast = document.getElementById('weather-forecast');
        this.refreshButton = document.querySelector('.refresh-weather');
        this.contactForm = document.getElementById('contactForm');
        this.charCounter = document.getElementById('char-counter');
        this.messageTextarea = document.getElementById('contact-message');
        this.submitBtn = document.getElementById('submit-btn');
        this.formSuccess = document.getElementById('form-success');
        this.sendAnotherBtn = document.getElementById('send-another');
        this.emergencyModal = document.getElementById('emergencyModal');
        this.emergencyLink = document.getElementById('emergency-contact');
        
        // Initialize
        this.initializeEventListeners();
        await this.loadWeatherData();
        this.initializeMapInteraction();
        
        // Update last modified date and current year
        updateLastModified();
        updateCurrentYear();
    }
    
    initializeEventListeners() {
        // Weather refresh button
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => this.loadWeatherData(true));
        }
        
        // Contact form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
            
            // Character counter for message textarea
            this.messageTextarea.addEventListener('input', () => {
                const length = this.messageTextarea.value.length;
                this.charCounter.textContent = length;
                
                // Add warning class if near limit
                if (length > 450) {
                    this.charCounter.style.color = '#ff9800';
                } else if (length > 490) {
                    this.charCounter.style.color = '#f44336';
                } else {
                    this.charCounter.style.color = 'inherit';
                }
            });
            
            // Form reset
            this.contactForm.addEventListener('reset', () => {
                this.charCounter.textContent = '0';
                this.charCounter.style.color = 'inherit';
            });
        }
        
        // Send another message button
        if (this.sendAnotherBtn) {
            this.sendAnotherBtn.addEventListener('click', () => {
                this.formSuccess.style.display = 'none';
                this.contactForm.reset();
                this.contactForm.style.display = 'block';
            });
        }
        
        // Emergency contact link
        if (this.emergencyLink) {
            this.emergencyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEmergencyModal();
            });
        }
        
        // Form terms links
        document.querySelectorAll('.terms-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Terms of Service and Privacy Policy pages would be implemented in a full website.');
            });
        });
    }
    
    async loadWeatherData(forceRefresh = false) {
        // Check if we have cached weather data (less than 10 minutes old)
        const cachedWeather = getFromLocalStorage('accra-weather');
        const cacheTime = getFromLocalStorage('weather-cache-time');
        const tenMinutes = 10 * 60 * 1000;
        
        // In loadWeatherData() method:
const API_KEY = '7cfe2610d8025acaa487ef9ed8a8fcbe';
const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=5.6037&lon=-0.1870&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
);
const data = await response.json();
        // Show loading state
        this.showWeatherLoading();
        
        try {
           
        
            const mockWeatherData = {
                current: {
                    temp: 28,
                    feels_like: 30,
                    humidity: 78,
                    wind_speed: 12,
                    weather: [{ 
                        description: 'partly cloudy', 
                        icon: '03d',
                        main: 'Clouds'
                    }],
                    dt: Math.floor(Date.now() / 1000)
                },
                daily: [
                    { 
                        dt: Math.floor(Date.now() / 1000) + 86400,
                        temp: { day: 29, night: 24 },
                        weather: [{ description: 'sunny', icon: '01d' }]
                    },
                    { 
                        dt: Math.floor(Date.now() / 1000) + 172800,
                        temp: { day: 27, night: 23 },
                        weather: [{ description: 'light rain', icon: '10d' }]
                    },
                    { 
                        dt: Math.floor(Date.now() / 1000) + 259200,
                        temp: { day: 28, night: 24 },
                        weather: [{ description: 'cloudy', icon: '04d' }]
                    }
                ]
            };
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.weatherData = mockWeatherData;
            this.lastWeatherUpdate = Date.now();
            
            // Cache the weather data
            saveToLocalStorage('accra-weather', mockWeatherData);
            saveToLocalStorage('weather-cache-time', Date.now());
            
            this.displayWeatherData();
            
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.showWeatherError();
        }
    }
    
    showWeatherLoading() {
        this.currentWeather.innerHTML = `
            <div class="weather-loading">
                <div class="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>
        `;
        this.weatherForecast.innerHTML = '';
    }
    
    showWeatherError() {
        this.currentWeather.innerHTML = `
            <div class="weather-error">
                <p><i class="fas fa-exclamation-triangle"></i> Unable to load weather data</p>
                <p>Please try again later or check your internet connection.</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
        this.weatherForecast.innerHTML = '';
    }
    
    displayWeatherData() {
        if (!this.weatherData) return;
        
        // Display current weather
        const current = this.weatherData.current;
        const weatherIcon = this.getWeatherIcon(current.weather[0].icon);
        
        this.currentWeather.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-temp">${Math.round(current.temp)}°C</div>
                <div class="weather-desc">${current.weather[0].description}</div>
                <div class="weather-feels">Feels like ${Math.round(current.feels_like)}°C</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="detail-value">${current.humidity}%</div>
                    <div class="detail-label">Humidity</div>
                </div>
                <div class="weather-detail">
                    <div class="detail-value">${current.wind_speed} km/h</div>
                    <div class="detail-label">Wind</div>
                </div>
                <div class="weather-detail">
                    <div class="detail-value">${this.formatTime(current.dt)}</div>
                    <div class="detail-label">Updated</div>
                </div>
            </div>
        `;
        
        // Display forecast
        if (this.weatherData.daily && this.weatherData.daily.length > 0) {
            let forecastHTML = '';
            
            this.weatherData.daily.slice(0, 3).forEach((day, index) => {
                const date = new Date(day.dt * 1000);
                const dayName = this.getDayName(date.getDay());
                const weatherIcon = this.getWeatherIcon(day.weather[0].icon);
                
                forecastHTML += `
                    <div class="forecast-day">
                        <h4>${index === 0 ? 'Tomorrow' : dayName}</h4>
                        <div class="forecast-icon">${weatherIcon}</div>
                        <div class="forecast-temp">${Math.round(day.temp.day)}°</div>
                        <div class="forecast-desc">${day.weather[0].description}</div>
                        <div class="forecast-low">Low: ${Math.round(day.temp.night)}°</div>
                    </div>
                `;
            });
            
            this.weatherForecast.innerHTML = forecastHTML;
        }
        
        // Add weather-based cleaning tip
        this.addCleaningTip(current.weather[0].main);
    }
    
    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', // clear sky day
            '01n': '🌙', // clear sky night
            '02d': '⛅', // few clouds day
            '02n': '☁️', // few clouds night
            '03d': '☁️', // scattered clouds
            '03n': '☁️',
            '04d': '☁️', // broken clouds
            '04n': '☁️',
            '09d': '🌧️', // shower rain
            '09n': '🌧️',
            '10d': '🌦️', // rain day
            '10n': '🌧️', // rain night
            '11d': '⛈️', // thunderstorm
            '11n': '⛈️',
            '13d': '❄️', // snow
            '13n': '❄️',
            '50d': '🌫️', // mist
            '50n': '🌫️'
        };
        
        return iconMap[iconCode] || '☀️';
    }
    
    getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-GH', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    addCleaningTip(weatherCondition) {
        const tips = {
            'Clear': 'Perfect weather for window cleaning!',
            'Clouds': 'Great day for indoor cleaning tasks.',
            'Rain': 'Ideal for deep cleaning indoor spaces.',
            'Thunderstorm': 'Stay indoors - perfect for organizing and decluttering.',
            'Drizzle': 'Good humidity for floor cleaning.',
            'Snow': 'Focus on indoor winter cleaning tasks.'
        };
        
        const tip = tips[weatherCondition] || 'Good day for general cleaning activities.';
        
        const weatherInfo = document.querySelector('.weather-info');
        if (weatherInfo) {
            weatherInfo.innerHTML = `
                <p><i class="fas fa-lightbulb"></i> <strong>Cleaning Tip:</strong> ${tip}</p>
            `;
        }
    }
    
    initializeMapInteraction() {
        // Interactive map points
        const mapPoints = document.querySelectorAll('.map-point');
        
        mapPoints.forEach(point => {
            point.addEventListener('click', () => {
                const area = point.getAttribute('data-area');
                alert(`You selected ${area}. We provide comprehensive cleaning services in this area!`);
            });
            
            // Keyboard accessibility
            point.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const area = point.getAttribute('data-area');
                    alert(`You selected ${area}. We provide comprehensive cleaning services in this area!`);
                }
            });
            
            point.setAttribute('tabindex', '0');
            point.setAttribute('role', 'button');
            point.setAttribute('aria-label', `View cleaning services in ${point.getAttribute('data-area')}`);
        });
    }
    
    async handleContactForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(formValues)) {
            return;
        }
        
        // Show loading state
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        this.submitBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save form data to localStorage
            const contactSubmissions = getFromLocalStorage('contact-submissions') || [];
            contactSubmissions.push({
                ...formValues,
                submittedAt: new Date().toISOString(),
                page: 'contact'
            });
            saveToLocalStorage('contact-submissions', contactSubmissions);
            
            // Show success message
            this.contactForm.style.display = 'none';
            this.formSuccess.style.display = 'block';
            
            // Scroll to success message
            this.formSuccess.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your message. Please try again.');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }
    
    validateForm(formData) {
        // Check required fields
        const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                alert(`Please fill in the ${field.replace('-', ' ')} field.`);
                return false;
            }
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        // Validate phone (Ghana format)
        const phoneRegex = /^(\+233|0)[235]\d{8}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            alert('Please enter a valid Ghanaian phone number (e.g., +233 24 123 4567 or 024 123 4567).');
            return false;
        }
        
        // Check message length
        if (formData.message.length > 500) {
            alert('Message must be 500 characters or less.');
            return false;
        }
        
        // Check terms agreement
        if (!formData.terms) {
            alert('You must agree to the Terms of Service and Privacy Policy.');
            return false;
        }
        
        return true;
    }
    
    showEmergencyModal() {
        this.emergencyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = this.emergencyModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            firstElement.focus();
        }
        
        // Add event listener to close button
        const closeBtn = this.emergencyModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEmergencyModal());
        }
        
        // Close modal when clicking outside
        this.emergencyModal.addEventListener('click', (e) => {
            if (e.target === this.emergencyModal) {
                this.hideEmergencyModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.emergencyModal.getAttribute('aria-hidden') === 'false') {
                this.hideEmergencyModal();
            }
        });
    }
    
    hideEmergencyModal() {
        this.emergencyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }



    
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});


