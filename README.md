# Weather Application

This is a simple weather application that fetches real-time weather information from the OpenWeatherMap API. Users can search for weather in different cities, view current conditions, hourly forecasts, daily forecasts, and see their search history.

## Project Structure

```
weather-app
├── css
│   ├── reset.css        # Resets default browser styles for consistency.
│   ├── style.css        # Main styles for layout, typography, and components.
│   ├── weatherAni.css   # CSS for weather icon animations.
│   ├── indexStyle.css   # Specific styles for the main index page elements.
│   ├── background.css   # Styles for dynamic background changes based on weather.
│   ├── plotting.css     # Styles related to the Chart.js hourly forecast plot.
│   └── sidebar.css      # Styles for the search history sidebar.
├── js
│   ├── app.js           # Main application logic: event listeners (search, history clicks), initialization.
│   ├── api.js           # Handles API calls: fetches coordinates from city name and weather data from coordinates.
│   ├── config.js        # Configuration file: stores the API key. **Modify this file with your API key.**
│   ├── weatherDisplay.js # Functions to create and update HTML elements to display weather data (current, hourly, daily, details).
│   └── searchHistory.js # Manages the search history: adding cities, loading/saving from localStorage, displaying history, clearing history.
├── img
│   └── icons            # Directory for any static image assets (though current icons are loaded from API/CSS).
├── index.html           # Main HTML document: structure of the web page including search input, display areas, and sidebar.
├── favicon.ico          # Favicon for the web application shown in browser tabs.
└── README.md            # This documentation file.
```

## Before All

**Important:** Open `js/config.js` and replace the placeholder `apiKey` value with your own API key (don't use mine!) from [OpenWeatherMap](https://openweathermap.org/api)

## Features

-   Search for weather information by city name.
-   Display current weather conditions (temperature, feels like, description, icon).
-   Show detailed weather information (humidity, wind speed, pressure, UV index) with visual bars.
-   Display an hourly temperature forecast chart for the next 6 hours.
-   Show a 7-day daily forecast overview.
-   Dynamically change the background based on the current weather condition (day/night variations included).
-   Animated weather icons corresponding to conditions.
-   Maintain and display a search history in a sidebar.
-   Ability to click on history items to re-fetch weather for that city.
-   Ability to clear the search history.
-   Loading indicator during API calls.
-   Error handling for city not found or network issues.

## Technologies Used

-   HTML5
-   CSS3 (including CSS Variables and basic animations)
-   JavaScript (ES6+)
-   AJAX (XMLHttpRequest) for API calls
-   [OpenWeatherMap API](https://openweathermap.org/api) (Geocoding and One Call API 3.0)
-   [Chart.js](https://www.chartjs.org/) for the hourly forecast chart
-   LocalStorage for persisting search history