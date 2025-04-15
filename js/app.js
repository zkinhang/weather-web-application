// app.js
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const cityInput = document.getElementById('cityInput');
    const weatherDisplay = document.getElementById('weatherDisplay');

    // Load Hong Kong weather by default
    fetchWeather('Hong Kong');

    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            fetchWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const city = cityInput.value;
            if (city) {
                fetchWeather(city);
            }
        }
    });
});

document.getElementById('searchButton').addEventListener('click', () => {
    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        fetchWeatherData(cityInput);
    }
});

// Enter key for search
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cityInput = document.getElementById('cityInput').value.trim();
        if (cityInput) {
            fetchWeatherData(cityInput);
        }
    }
});
