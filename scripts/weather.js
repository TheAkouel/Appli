// scripts/weather.js

function initWeather() {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const currentWeatherData = document.getElementById('currentWeatherData');
    const hourlyForecastData = document.getElementById('hourlyForecastData');
    const dailyForecastData = document.getElementById('dailyForecastData');
    const errorDiv = document.getElementById('error');

    const apiKey = 'd9e3b4506555b4559c9055895957cb58'; // Remplacez par votre clé API

    function displayCurrentWeather(data) {
        if (!data || data.cod !== 200) {
            throw new Error("Données météo non valides ou ville non trouvée.");
        }
        currentWeatherData.innerHTML = `
            <p>Température: ${data.main.temp}°C</p>
            <p>Ressenti: ${data.main.feels_like}°C</p>
            <p>Humidité: ${data.main.humidity}%</p>
            <p>Vent: <span class="math-inline">\{data\.wind\.speed\} m/s</p\>
<img src\="https\://openweathermap\.org/img/wn/</span>{data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
            <p>Conditions: ${data.weather[0].description}</p>
        `;
    }
    
function displayHourlyForecast(data) {
    if (!data || !data.list || data.list.length === 0) {
         hourlyForecastData.innerHTML = '<p>Aucune prévision horaire disponible.</p>';
         return;
     }

     hourlyForecastData.innerHTML = ''; // Efface le contenu précédent

     // Affiche les prévisions pour les prochaines 24 heures (8 intervalles de 3 heures)
     for (let i = 0; i < 8; i++) {
         const forecast = data.list[i];
         if (!forecast) break; // Gère le cas où il y a moins de 8 prévisions

         const dateTime = new Date(forecast.dt * 1000); // Convertit le timestamp en date
         const hour = dateTime.getHours();

         const forecastDiv = document.createElement('div');
         forecastDiv.classList.add('forecast-item');
         forecastDiv.innerHTML = `
             <p>${hour}:00</p>
             <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
             <p>${forecast.main.temp}°C</p>
         `;
         hourlyForecastData.appendChild(forecastDiv);
     }
 }

 function displayDailyForecast(data) {
     if (!data || !data.list || data.list.length === 0) {
         dailyForecastData.innerHTML = '<p>Aucune prévision quotidienne disponible.</p>';
         return;
     }

     dailyForecastData.innerHTML = ''; // Efface le contenu précédent

     // Affiche les prévisions pour les 3 prochains jours
     for (let i = 0; i < 3; i++) {
          const forecast = data.list[i*8]; // Prend une prévision sur 8 (toutes les 24h)
         if (!forecast) break;

         const date = new Date(forecast.dt * 1000);
         const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }); // Jour de la semaine en français

         const forecastDiv = document.createElement('div');
         forecastDiv.classList.add('forecast-item');
         forecastDiv.innerHTML = `
             <p>${dayName}</p>
             <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
             <p>Min: ${forecast.main.temp_min}°C</p>
             <p>Max: ${forecast.main.temp_max}°C</p>
         `;
         dailyForecastData.appendChild(forecastDiv);
     }
 }


  function showError(message) {
     errorDiv.textContent = message;
     errorDiv.style.display = 'block'; // Affiche le message d'erreur
 }

 function hideError() {
     errorDiv.style.display = 'none'; // Cache le message d'erreur
 }


 function getWeather(city) {
     hideError(); // Cache les erreurs précédentes

     const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
     const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

     // Fetch pour la météo actuelle
     fetch(currentWeatherUrl)
         .then(response => response.json())
         .then(data => {
            displayCurrentWeather(data);

            // Fetch pour les prévisions (seulement si la météo actuelle a réussi)
             return fetch(forecastUrl);
         })
         .then(response => response.json())
         .then(data => {
           displayHourlyForecast(data);
           displayDailyForecast(data);
         })

         .catch(error => {
             console.error("Erreur lors de la récupération des données météo:", error);
             showError("Impossible de récupérer les données météo. Veuillez vérifier le nom de la ville et votre connexion internet.");
         });
 }

 searchButton.addEventListener('click', () => {
     const city = cityInput.value.trim();
     if (city) {
         getWeather(city);
     } else {
        showError("Veuillez entrer le nom d'une ville.");
     }
 });

  //Pour permettre la recherche avec la touche "Entrée"
  cityInput.addEventListener('keypress', (event) =>{
     if(event.key === "Enter"){
         const city = cityInput.value.trim();
         if (city) {
             getWeather(city);
         } else {
            showError("Veuillez entrer le nom d'une ville.");
         }
     }
  })
}
// Pas de DOMContentLoaded ici