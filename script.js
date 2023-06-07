const apiKey = "78a99f0ea4a259da90f9dda6a811ec3e";

let city = "";
let errorMessage = document.querySelector("h5");

const form = document.querySelector("form");
const input = document.querySelector("input");
form.addEventListener("submit", findWeather);

function findWeather(event) {
    event.preventDefault();

    city = input.value;
    form.reset();

    //Get weather url link
    const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(weatherUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Signal doesn't work!";
            }
        })
        .then(displayWeather)
        .catch(handleError);
}

//Display weather direction
function displayWeather(position) {
    if (!position || !position[0] || !position[0].lat || !position[0].lon) {
        errorMessage.innerText = "Invalid position data!";
        return;
      }
    
    const lat = position[0].lat;
    const lon = position[0].lon;

    const geoApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(geoApi)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Failed to search weather data";
            }

        })
        .then(openWeatherMap)
        .catch(handleError);
}

// Display data for currently temperature and icon data
function openWeatherMap(data) {
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const iconCode = data.weather[0].icon;

    const weatherData = document.querySelector("#weatherData");
    weatherData.innerHTML = `<h2> Current Weather</h2> 
    <h4>Temperature in ${city} is: ${temperature}°C</h4>
    <h4>Wind speed in ${city} is: ${windSpeed} m/s</h4>`;

    //Icon url link
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const Icon = document.createElement("img");
    Icon.src = iconUrl;
    Icon.alt = "Weather Icon";
    weatherData.append(Icon);

    // Get forecast data.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

    fetch(forecastUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw "Failed to retrieve forecast data";
            }
        })
        .then((forecastData) => {
            const forecastList = forecastData.list;

            // Extract temperature and icon for specific time intervals.
            const forecastIntervals = [3, 6, 9, 12];
            const forecastDtataList= forecastIntervals.map((interval) => {
                const index = Math.floor(interval / 3) - 1;
                const forecast = forecastList[index];
                return {
                    temperature: forecast.main.temp,
                    iconCode: forecast.weather[0].icon,
                };
            });

            //Display temperature and icon for the upcoming hours.
            const forecastContainer = document.querySelector(".forecastData");
            forecastContainer.innerHTML = "<h3> Temperature forecast</h3>";
            forecastDtataList.forEach((forecast, index) => {
                const hour = forecastIntervals[index];
                const iconUrl = `https://openweathermap.org/img/w/${forecast.iconCode}.png`;
                forecastContainer.innerHTML += `<div class ="hourlyForecast">
            <p>Temperature in ${city} in ${hour} hours: ${forecast.temperature}°C </p>
            <img src="${iconUrl}" alt="Weather Icon">
             </div>`;

            });

        })
        .catch(handleError);
}

//check for error message.
function handleError(error) {
    console.log(error);

    errorMessage.innerText = error;

}
