// Search history functionality
class SearchHistory {
    constructor(maxItems = 10) {
        this.maxItems = maxItems;
        this.historyContainer = document.getElementById('searchHistory');
        this.clearBtn = document.getElementById('clearHistoryBtn');
        this.activeCity = null;
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        
        // Create toggle button
        this.createToggleButton();
        
        // Initialize
        this.loadHistory();
        this.bindEvents();
    }
    
    // Create sidebar toggle button
    createToggleButton() {
        // Create toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path></svg>`;
        
        // Add to body
        document.body.appendChild(toggleBtn);
        
        // Add click event
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });
    }
    
    // Toggle sidebar visibility
    toggleSidebar() {
        this.sidebar.classList.toggle('visible');
        this.mainContent.classList.toggle('sidebar-visible');
        
        // If closed, set a timer to auto-hide on next visibility
        if (!this.sidebar.classList.contains('visible')) {
            this.autoHideEnabled = true;
        }
    }

    // Show sidebar
    showSidebar() {
        this.sidebar.classList.add('visible');
        this.mainContent.classList.add('sidebar-visible');
    }
    
    // Hide sidebar
    hideSidebar() {
        this.sidebar.classList.remove('visible');
        this.mainContent.classList.remove('sidebar-visible');
    }

    // Load search history from localStorage
    loadHistory() {
        this.searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
        this.renderHistory();
    }
    
    // Save history to localStorage
    saveHistory() {
        localStorage.setItem('weatherSearchHistory', JSON.stringify(this.searchHistory));
    }
    
    // Add a city to search history
    addCity(cityName, countryCode) {
        // Create standardized format for city name
        const cityDisplay = countryCode ? 
            `${cityName}, ${countryCode}` : cityName;
            
        // Don't add if the city is already at the top of the list
        if (this.searchHistory.length > 0 && this.searchHistory[0].display === cityDisplay) {
            return;
        }
        
        // Remove the city if it already exists in the history
        this.searchHistory = this.searchHistory.filter(city => city.display !== cityDisplay);
        
        // Add the city to the beginning of the array
        this.searchHistory.unshift({
            name: cityName,
            country: countryCode,
            display: cityDisplay,
            timestamp: new Date().toISOString()
        });
        
        // Limit the number of items
        if (this.searchHistory.length > this.maxItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxItems);
        }
        
        // Save and update display
        this.saveHistory();
        this.renderHistory();
    }
    
    // Clear all search history
    clearHistory() {
        this.searchHistory = [];
        this.saveHistory();
        this.renderHistory();
    }
    
    // Render history list in the sidebar
renderHistory() {
    // Clear current history
    this.historyContainer.innerHTML = '';
    
    // If no history, show empty state
    if (this.searchHistory.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-history';
        emptyState.textContent = 'No search history yet';
        this.historyContainer.appendChild(emptyState);
        return;
    }
    
    // Create history items
    this.searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Check if it's the currently displayed city
        if (document.getElementById('cityHeading').textContent === city.display) {
            historyItem.classList.add('active');
        }
        
        historyItem.innerHTML = `
            <svg class="history-icon" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
            </svg>
            ${city.display}
        `;
        
        // Add click event to immediately load this city's weather
        historyItem.addEventListener('click', () => {
            // Update input field for consistency
            document.getElementById('cityInput').value = city.name;
            
            // Show loading indicator
            const weatherContainer = document.getElementById('weatherDisplay');
            weatherContainer.innerHTML = '<div class="loader"></div>';
            
            // Directly fetch weather data using the API
            fetchWeather(city.name);
            
            // Update active state
            document.querySelectorAll('.history-item').forEach(item => {
                item.classList.remove('active');
            });
            historyItem.classList.add('active');
        });
        
        this.historyContainer.appendChild(historyItem);
    });
}
    
    // Bind event listeners
    bindEvents() {
        this.clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your search history?')) {
                this.clearHistory();
            }
        });
    }
}

// Create search history instance
const searchHistory = new SearchHistory();