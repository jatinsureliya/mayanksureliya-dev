class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');

        currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            previousOperandElement.textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    } else if (event.key === '.') {
        calculator.appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        calculator.chooseOperation(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
    } else if (event.key === 'Backspace') {
        calculator.delete();
    } else if (event.key === 'Escape') {
        calculator.clear();
    }
});

// Weather Widget
class WeatherWidget {
    constructor() {
        this.modal = document.getElementById('weather-modal');
        this.loadingEl = document.getElementById('weather-loading');
        this.errorEl = document.getElementById('weather-error');
        this.dataEl = document.getElementById('weather-data');

        // Rajkot coordinates
        this.latitude = 22.3039;
        this.longitude = 70.8022;
        this.apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current_weather=true&timezone=Asia/Kolkata&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min`;
    }

    openModal() {
        this.modal.classList.add('active');
        this.loadingEl.style.display = 'block';
        this.errorEl.style.display = 'none';
        this.dataEl.style.display = 'none';
        this.fetchWeather();
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

    async fetchWeather() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            this.showError('Unable to load weather data. Please try again later.');
            console.error('Weather fetch error:', error);
        }
    }

    displayWeather(data) {
        this.loadingEl.style.display = 'none';
        this.dataEl.style.display = 'block';

        // Current weather
        const current = data.current_weather;
        const hourly = data.hourly;

        // Get current hour index to fetch humidity
        const currentHourIndex = 0; // First entry is usually current or most recent

        document.getElementById('current-temp').textContent = `${Math.round(current.temperature)}°C`;
        document.getElementById('current-icon').textContent = this.getWeatherIcon(current.weathercode);
        document.getElementById('current-desc').textContent = this.getWeatherDescription(current.weathercode);
        document.getElementById('humidity').textContent = `${Math.round(hourly.relative_humidity_2m[currentHourIndex])}%`;
        document.getElementById('wind-speed').textContent = `${Math.round(current.windspeed)} km/h`;

        // Forecast
        if (data.daily) {
            this.displayForecast(data.daily);
        }
    }

    displayForecast(daily) {
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">${this.getWeatherIcon(daily.weather_code[i])}</div>
                <div class="forecast-temp">
                    <div class="forecast-temp-max">${Math.round(daily.temperature_2m_max[i])}°</div>
                    <div class="forecast-temp-min">${Math.round(daily.temperature_2m_min[i])}°</div>
                </div>
            `;
            forecastContainer.appendChild(card);
        }
    }

    showError(message) {
        this.loadingEl.style.display = 'none';
        this.dataEl.style.display = 'none';
        this.errorEl.style.display = 'block';
        this.errorEl.textContent = message;
    }

    getWeatherIcon(code) {
        // WMO Weather interpretation codes
        const weatherIcons = {
            0: '☀️',      // Clear sky
            1: '🌤️',     // Mainly clear
            2: '⛅',     // Partly cloudy
            3: '☁️',      // Overcast
            45: '🌫️',    // Fog
            48: '🌫️',    // Depositing rime fog
            51: '🌦️',    // Light drizzle
            53: '🌦️',    // Moderate drizzle
            55: '🌧️',    // Dense drizzle
            61: '🌧️',    // Slight rain
            63: '🌧️',    // Moderate rain
            65: '⛈️',     // Heavy rain
            71: '🌨️',    // Slight snow
            73: '🌨️',    // Moderate snow
            75: '❄️',     // Heavy snow
            77: '🌨️',    // Snow grains
            80: '🌦️',    // Slight rain showers
            81: '🌧️',    // Moderate rain showers
            82: '⛈️',     // Violent rain showers
            85: '🌨️',    // Slight snow showers
            86: '❄️',     // Heavy snow showers
            95: '⛈️',     // Thunderstorm
            96: '⛈️',     // Thunderstorm with slight hail
            99: '⛈️'      // Thunderstorm with heavy hail
        };
        return weatherIcons[code] || '🌤️';
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light drizzle',
            53: 'Drizzle',
            55: 'Heavy drizzle',
            61: 'Light rain',
            63: 'Rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light showers',
            81: 'Showers',
            82: 'Heavy showers',
            85: 'Light snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Severe thunderstorm'
        };
        return descriptions[code] || 'Unknown';
    }
}

// Initialize weather widget
const weatherWidget = new WeatherWidget();

// Close modal when clicking outside
document.getElementById('weather-modal').addEventListener('click', (event) => {
    if (event.target.id === 'weather-modal') {
        weatherWidget.closeModal();
    }
});
