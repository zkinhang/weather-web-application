function fetchWeather(city) {
    const apiKey = '8d895e74c7e2e3a659f2640838cc8752';

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
    const apiKey = '8d895e74c7e2e3a659f2640838cc8752';
    // Using the One Call API 3.0
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', weatherUrl, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const weatherData = JSON.parse(xhr.responseText);
            // Add city name to the weather data since One Call API doesn't include it
            weatherData.name = cityName;
            // Add to search history with country code
            if (weatherData.name && weatherData.sys && weatherData.sys.country) {
                searchHistory.addCity(weatherData.name, weatherDataa.sys.country);
            } else if (weatherData.name) {
                searchHistory.addCity(weatherData.name);
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