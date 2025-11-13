// Select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const loadingElement = document.querySelector('#loading');
const weatherDetails = document.querySelector('#weather-details');

// API URL with coordinates for Trier, Germany
const apiKey = '7cfe2610d8025acaa487ef9ed8a8fcbe';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=metric&appid=${apiKey}`;

// Display results function
function displayResults(data) {
    console.log(data); 
    
    // Hide loading message
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Display temperature
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    
    // Set weather icon and description
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
    
    // Display additional weather details
    if (weatherDetails) {
        weatherDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Feels Like</div>
                <div class="detail-value">${Math.round(data.main.feels_like)}&deg;C</div>
            </div>
            <div class="detail-label">Humidity</div>
            <div class="detail-value">${data.main.humidity}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${data.wind.speed} m/s</div>
            </div>
        `;
    }
}

// API fetch function
async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
        
        // Display error message to user
        if (loadingElement) {
            loadingElement.textContent = 'Error loading weather data. Please try again later.';
            loadingElement.className = 'error';
        }
    }
}

// Initialize the page
apiFetch();