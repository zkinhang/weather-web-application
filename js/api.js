function fetchWeather(city) {
    // Use apiKey from config object
    const apiKey = config.apiKey;

    // Show loading indicator
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = '<div class="loader"></div>';

    // Step 1: Get coordinates from city name using Geocoding API
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', geocodingUrl, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const locationData = JSON.parse(xhr.responseText);
            
            if (locationData.length > 0) {
                const { lat, lon, name } = locationData[0];
                // Step 2: Get weather data using coordinates
                fetchWeatherByCoordinates(lat, lon, name);
            } else {
                document.getElementById('weatherDisplay').innerHTML = 
                    `<p class="error">City "${city}" not found. Please check spelling.</p>`;
            }
        } else {
            document.getElementById('weatherDisplay').innerHTML = 
                `<p class="error">Geocoding API error: ${xhr.status}</p>`;
        }
    };
    xhr.onerror = () => {
        document.getElementById('weatherDisplay').innerHTML = 
            '<p class="error">Network Error. Please check your connection.</p>';
    };
    xhr.send();
    
}

function fetchWeatherByCoordinates(lat, lon, cityName) {
    // Use apiKey from config object
    const apiKey = config.apiKey;
    // Using the One Call API 3.0
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', weatherUrl, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const weatherData = JSON.parse(xhr.responseText);
            // Add city name to the weather data since One Call API doesn't include it
            weatherData.name = cityName;
            // Add to search history - Note: OneCall API doesn't provide country code in sys object directly
            // We might need to adjust how country code is obtained if needed, or just use city name.
            if (weatherData.name) {
                // Assuming searchHistory object exists and has an addCity method
                // The original code had a typo 'weatherDataa', corrected to 'weatherData'
                // Also, OneCall API v3 response structure might differ, sys.country might not be present.
                // Let's simplify to just adding the city name for now.
                if (typeof searchHistory !== 'undefined' && searchHistory.addCity) {
                     searchHistory.addCity(weatherData.name);
                }
            }
            updateWeatherDisplay(weatherData);
        } else {
            document.getElementById('weatherDisplay').innerHTML = 
                `<p class="error">Weather API error: ${xhr.status}</p>`;
        }
    };
    xhr.onerror = () => {
        document.getElementById('weatherDisplay').innerHTML = 
            '<p class="error">Network Error. Please check your connection.</p>';
    };
    xhr.send();
}