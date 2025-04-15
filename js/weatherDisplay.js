function updateWeatherDisplay(data) {
    // Update the heading with city name
    const cityHeading = document.getElementById('cityHeading');
    if (cityHeading) {
        cityHeading.textContent = data.name;
    }
    // Set background based on weather condition
    const currentWeatherId = data.current.weather[0].id;
    const isDay = data.current.weather[0].icon.includes('d');

    // Remove any existing weather classes
    document.body.classList.remove('clear-day', 'clear-night', 'cloudy', 'rain', 'snow', 'thunderstorm', 'mist');

    // Add the appropriate class based on weather conditions
    if (currentWeatherId >= 200 && currentWeatherId < 300) {
        document.body.classList.add('thunderstorm');
    } else if (currentWeatherId >= 300 && currentWeatherId < 600) {
        document.body.classList.add('rain');
    } else if (currentWeatherId >= 600 && currentWeatherId < 700) {
        document.body.classList.add('snow');
    } else if (currentWeatherId >= 700 && currentWeatherId < 800) {
        document.body.classList.add('mist');
    } else if (currentWeatherId === 800) {
        document.body.classList.add(isDay ? 'clear-day' : 'clear-night');
    } else if (currentWeatherId > 800) {
        document.body.classList.add('cloudy');
    }

    const weatherContainer = document.getElementById('weatherDisplay');
    weatherContainer.innerHTML = '';

    // Main weather container with two-column layout
    const mainWeather = document.createElement('div');
    mainWeather.className = 'main-weather';

    // Left container - current weather info
    const leftContainer = document.createElement('div');
    leftContainer.className = 'weather-container-left';

    // Current weather container
    const currentWeather = document.createElement('div');
    currentWeather.className = 'current-weather';

    // Temperature
    const temperature = document.createElement('p');
    temperature.className = 'temperature';
    temperature.textContent = `${Math.round(data.current.temp)}°C`;
    currentWeather.appendChild(temperature);

    // Feels like
    const feelsLike = document.createElement('p');
    feelsLike.className = 'feels-like';
    feelsLike.textContent = `Feels like: ${Math.round(data.current.feels_like)}°C`;
    currentWeather.appendChild(feelsLike);

    // Weather description
    const weatherDescription = document.createElement('p');
    weatherDescription.className = 'description';
    weatherDescription.textContent = data.current.weather[0].description;
    currentWeather.appendChild(weatherDescription);

    // Weather icon
    const icon = document.createElement('img');
    icon.className = 'weather-icon';

    // Apply animation class based on weather conditions
    if (currentWeatherId >= 200 && currentWeatherId < 300) {
        icon.classList.add('thunder'); // Thunderstorm
    } else if (currentWeatherId >= 300 && currentWeatherId < 600) {
        icon.classList.add('rainy'); // Drizzle and Rain
    } else if (currentWeatherId >= 600 && currentWeatherId < 700) {
        icon.classList.add('snowy'); // Snow
    } else if (currentWeatherId >= 700 && currentWeatherId < 800) {
        icon.classList.add('mist'); // Atmosphere (fog, mist, etc.)
    } else if (currentWeatherId === 800) {
        icon.classList.add(isDay ? 'sunny' : 'night'); // Clear sky
    } else if (currentWeatherId > 800) {
        icon.classList.add('cloudy'); // Clouds
    }

    icon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    icon.alt = data.current.weather[0].description;
    currentWeather.appendChild(icon);

    leftContainer.appendChild(currentWeather);

    // Right container for hourly temperature plot
    const rightContainer = document.createElement('div');
    rightContainer.className = 'weather-container-right hourly-plot-container';

    // Create canvas for Chart.js
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'hourlyTempChart';
    canvasContainer.appendChild(chartCanvas);
    rightContainer.appendChild(canvasContainer);

    // Add containers to main weather
    mainWeather.appendChild(leftContainer);
    mainWeather.appendChild(rightContainer);
    weatherContainer.appendChild(mainWeather);

    // In the right container, create a chart for hourly temperature
    // If hourly data exists, create the chart
    if (data.hourly && data.hourly.length > 0) {
        // Get the next 6 hours
        const hourlyData = data.hourly.slice(0, 6);
        
        // Prepare data for the chart
        const hours = hourlyData.map(hour => {
            const date = new Date(hour.dt * 1000);
            return date.toLocaleTimeString('en-US', { hour: '2-digit' });
        });
        
        const temperatures = hourlyData.map(hour => Math.round(hour.temp));
        
        // Find min and max temperature to set reasonable y-axis bounds
        let minTemp = Math.min(...temperatures);
        let maxTemp = Math.max(...temperatures);
        
        // Add more padding to temperature range for a longer y-axis look
        const tempRange = Math.max(maxTemp - minTemp, 4);
        minTemp = Math.floor(minTemp - tempRange * 0.3); // Increase padding at bottom
        maxTemp = Math.ceil(maxTemp + tempRange * 0.3); // Increase padding at top
        
        // Create chart using Chart.js
        const ctx = chartCanvas.getContext('2d');
        
        // Create chart with temperature data
        const tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: 'white',
                    pointBorderColor: '#3498db',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y}°C`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        titleColor: '#333',
                        bodyColor: '#333',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 6
                    },
                    title: {
                        display: true,
                        text: '6-Hour Forecast',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#2c3e50',
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                },
                scales: {
                    y: {
                        min: minTemp,
                        max: maxTemp,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return value + '°C';
                            },
                            font: {
                                weight: 'bold'
                            },
                            color: '#555'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#555',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 10,
                        right: 10
                    }
                }
            }
        });
    }

    // Weather details with simple bar visualizations and icons
    const details = document.createElement('div');
    details.className = 'weather-details';

    // Humidity visualization
    const humidityValue = data.current.humidity;
    const humidityItem = document.createElement('div');
    humidityItem.className = 'detail-item humidity';
    humidityItem.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24"><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" /></svg>
            </div>
            <span class="detail-label">Humidity</span>
            <span class="detail-value">${humidityValue}%</span>
        </div>
        <div class="bar-container">
            <div class="bar-fill" style="--fill-percent: ${humidityValue}%"></div>
        </div>
    `;
    details.appendChild(humidityItem);

    // Wind visualization
    const windValue = data.current.wind_speed;
    const windPercent = Math.min(windValue * 10, 100); // Scale wind speed to percentage (max at 10 m/s)
    const windItem = document.createElement('div');
    windItem.className = 'detail-item wind';
    windItem.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24"><path d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10H5A1,1 0 0,0 4,11A1,1 0 0,0 5,12H19M18,18H4A1,1 0 0,0 3,19A1,1 0 0,0 4,20H18A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" /></svg>
            </div>
            <span class="detail-label">Wind</span>
            <span class="detail-value">${windValue} m/s</span>
        </div>
        <div class="bar-container">
            <div class="bar-fill" style="--fill-percent: ${windPercent}%"></div>
        </div>
    `;
    details.appendChild(windItem);

    // Pressure visualization
    const pressureValue = data.current.pressure;
    const pressurePercent = Math.min(Math.max(((pressureValue - 970) / 80) * 100, 0), 100); // Scale pressure (970-1050 hPa range)
    const pressureItem = document.createElement('div');
    pressureItem.className = 'detail-item pressure';
    pressureItem.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M16.5,11.5H14.5V9.5H16.5V11.5M12,9.5H10V11.5H12V9.5M7.5,9.5H9.5V11.5H7.5V9.5M12,13.5H10V15.5H12V13.5Z" /></svg>
            </div>
            <span class="detail-label">Pressure</span>
            <span class="detail-value">${pressureValue} hPa</span>
        </div>
        <div class="bar-container">
            <div class="bar-fill" style="--fill-percent: ${pressurePercent}%"></div>
        </div>
    `;
    details.appendChild(pressureItem);

    // UV Index visualization
    const uvValue = data.current.uvi;
    // Determine UV class
    let uvClass;
    if (uvValue <= 2) {
        uvClass = 'uv-low';
    } else if (uvValue <= 5) {
        uvClass = 'uv-moderate';
    } else if (uvValue <= 7) {
        uvClass = 'uv-high';
    } else if (uvValue <= 10) {
        uvClass = 'uv-very-high';
    } else {
        uvClass = 'uv-extreme';
    }
    const uvPercent = Math.min(uvValue * 8, 100); // Scale UV index (max at 12.5)
    const uvItem = document.createElement('div');
    uvItem.className = `detail-item uv ${uvClass}`;
    uvItem.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24"><path d="M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17Z" /></svg>
            </div>
            <span class="detail-label">UV Index</span>
            <span class="detail-value">${uvValue}</span>
        </div>
        <div class="bar-container">
            <div class="bar-fill" style="--fill-percent: ${uvPercent}%"></div>
        </div>
    `;
    details.appendChild(uvItem);

    weatherContainer.appendChild(details);



    // Daily forecast section (if data.daily exists)
    if (data.daily && data.daily.length > 0) {
        const dailySection = document.createElement('div');
        dailySection.className = 'daily-forecast';
        
        const dailyTitle = document.createElement('h3');
        dailyTitle.textContent = '7-Day Forecast';
        dailySection.appendChild(dailyTitle);

        const dailyContainer = document.createElement('div');
        dailyContainer.className = 'daily-container';

        // Display 7 days forecast
        for (let i = 0; i < Math.min(7, data.daily.length); i++) {
            const dayData = data.daily[i];
            const date = new Date(dayData.dt * 1000);
            const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Get weather condition and determine icon animation class
            const dayWeatherId = dayData.weather[0].id;
            const isDayIcon = dayData.weather[0].icon.includes('d');
            let animationClass = '';
            
            // Apply animation class based on weather conditions
            if (dayWeatherId >= 200 && dayWeatherId < 300) {
                animationClass = 'thunder'; // Thunderstorm
            } else if (dayWeatherId >= 300 && dayWeatherId < 600) {
                animationClass = 'rainy'; // Drizzle and Rain
            } else if (dayWeatherId >= 600 && dayWeatherId < 700) {
                animationClass = 'snowy'; // Snow
            } else if (dayWeatherId >= 700 && dayWeatherId < 800) {
                animationClass = 'mist'; // Atmosphere (fog, mist, etc.)
            } else if (dayWeatherId === 800) {
                animationClass = isDayIcon ? 'sunny' : 'night'; // Clear sky
            } else if (dayWeatherId > 800) {
                animationClass = 'cloudy'; // Clouds
            }
            
            const dayBox = document.createElement('div');
            dayBox.className = 'day-box';
            dayBox.innerHTML = `
                <p class="day-name">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" 
                    alt="${dayData.weather[0].description}" 
                    class="weather-icon ${animationClass}">
                <div class="day-temp">
                    <p class="max">${Math.round(dayData.temp.max)}°</p>
                    <p class="min">${Math.round(dayData.temp.min)}°</p>
                </div>
                <p class="day-description">${dayData.weather[0].description}</p>
            `;
            dailyContainer.appendChild(dayBox);
        }

        dailySection.appendChild(dailyContainer);
        weatherContainer.appendChild(dailySection);
    }
}