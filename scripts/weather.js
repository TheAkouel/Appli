const apiKey = '7f9f2a18dc4a91e51d24d41db645cfe0';
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const currentWeatherDiv = document.getElementById('currentWeatherData');
const hourlyForecastDiv = document.getElementById('hourlyForecastData');
const dailyForecastDiv = document.getElementById('dailyForecastData');
const errorDiv = document.getElementById('error');


searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        showError('Veuillez entrer le nom d\'une ville.');
    }
});

async function getWeatherData(city) {
    try {

        currentWeatherDiv.innerHTML = '';
        hourlyForecastDiv.innerHTML = '';
        dailyForecastDiv.innerHTML = '';
        errorDiv.textContent = '';



        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`);
        const currentWeatherData = await currentWeatherResponse.json();
        if (currentWeatherData.cod !== 200) {
          throw new Error(currentWeatherData.message);
        }

        displayCurrentWeather(currentWeatherData);



        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
          throw new Error(forecastData.message);
        }
        displayHourlyForecast(forecastData);
        displayDailyForecast(forecastData);


    } catch (error) {
        showError(error.message);
        console.error("Erreur lors de la récupération des données:", error);

    }
}

function displayCurrentWeather(data) {
    const weather = data.weather[0];
    currentWeatherDiv.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}">
        <div>
            <p>Température: ${data.main.temp}°C</p>
            <p>Ressenti: ${data.main.feels_like}°C</p>
            <p>Conditions: ${weather.description}</p>
            <p>Humidité: ${data.main.humidity}%</p>
            <p>Vent: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayHourlyForecast(data) {

  const hourlyData = data.list.filter((item, index) => index % 2 === 0 && index < 8 );

    hourlyData.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const weather = item.weather[0];
        const temps = Math.round(item.main.temp);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${hour}:00</p>
            <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
            <p>${temps}°C</p>
            <p>${weather.description}</p>
        `;
        hourlyForecastDiv.appendChild(forecastItem);
    });
}

function displayDailyForecast(data) {

    const dailyData = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });


    const next3Days = Object.keys(dailyData).slice(1, 4); // Ignorer le jour actuel

    next3Days.forEach(date => {
      const dayData = dailyData[date];


      const temps = dayData.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const roundMinTemp = Math.round(minTemp);
      const roundMaxTemp = Math.round(maxTemp);

      const weather = dayData[0].weather[0];

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
            <p>Min: ${roundMinTemp}°C</p>
            <p>Max: ${roundMaxTemp}°C</p>
            <p>${weather.description}</p>

        `;
        dailyForecastDiv.appendChild(forecastItem);
    });
}

function showError(message) {
    errorDiv.textContent = message;
}

