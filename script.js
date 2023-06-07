//own api key
const apiKey = "78a99f0ea4a259da90f9dda6a811ec3e";

let city = " ";
let lat = "";
let lon = "";
let errorMessage = document.querySelector("h4");

const form = document.querySelector("form");
const input = document.querySelector("input");
form.addEventListener("submit", findWeather);

function findWeather(event) {
    event.preventDefault();

    city = input.value;
    form.reset();
    resetForcast();

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
        .then(openWeatherMap)
        .catch(handleError);
}

//open city position
function openWeatherMap(position) {
    if (!position || !position[0] || !position[0].lat || !position[0].lon) {
        errorMessage.innerText = "Invalid position data!";
        return;
    }

    lat = position[0].lat;
    lon = position[0].lon;

    const geoApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(geoApi)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Failed to search weather data!";
            }

        })
        .then(displayWeather)
        .catch(handleError);
}

//dispplay current weather
function displayWeather(data) {
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const iconCode = data.weather[0].icon;

    const weatherData = document.querySelector(".weatherData");
    weatherData.innerHTML = `<h2> Current weather in ${city}</h2>
    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt = "Weather Icon"> 
    <div class="weatherInfo">
    <p>Temperature: ${temperature}°C</p>
    <p>Wind speed: ${windSpeed} m/s</p>
    <p>Latitude: ${lat}</p>
    <p>Longtitude: ${lon}</p>
    </div>`;
}

// Get forecast data.
const button = document.querySelector("#button");
button.addEventListener("click", displayForecast);

function displayForecast(event) {
    event.preventDefault();
    const forecastInput = document.querySelector("#forecastHours");
    const hours = parseInt(forecastInput.value);

    if (![3, 6, 9, 12].includes(hours)) {
        errorMessage.innerText = "Invalid hours!";
        resetForcast();
        return;
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw "Failed to retrieve forecast data";
            }
        })
        .then((forecastData) => {
            const forecast = document.querySelector("#result");
            forecast.innerHTML = "";

            forecast.innerHTML = `<h3>${hours} hours forecast in ${city}</h3>`;

            const time = new Date().getTime();

            const forecastFilter = forecastData.list.filter((item) =>{
                const itemTime = new Date(item.dt_txt).getTime();
                const timeDifference = (itemTime - time) / (1000 * 60 * 60);
                
                return timeDifference >= 0 && timeDifference < hours;
            });

            //const filteredTemperatures = {};

            forecastFilter.forEach((item)=>{ 
                const temperature = item.main.temp;
                const iconCode = item.weather[0].icon;
                const itemHours = Math.floor(
                    (new Date(item.dt_txt).getTime() - time )/(1000 * 60 * 60)
                    );
/*
                if(!filteredTemperatures[itemHours]){
                    filteredTemperatures[itemHours] = {  
                        temperature,
                        iconCode,
                    };
                }
            });

            for(let i = 0; i < hours; i++){
                if(filteredTemperatures[i]){ 
                const temperature = filteredTemperatures[i].temperature;
                const iconCode = filteredTemperatures[i].iconCode;
*/
                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecastItem");
                forecastItem.innerHTML = `
              <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
             <p>Temperature in ${itemHours + 1} hours: ${temperature}°C</p>`;
             forecast.appendChild(forecastItem);
            
            });
        })
        .catch (handleError);
}

//reset function
function resetForcast(){
    const forecast = document.querySelector("#result");
    forecast.innerHTML = "";
    const forecastInput = document.querySelector("#forecastHours");
    forecastInput.value = "";
}

//check for error message.
function handleError(error) {
    console.log(error);

    errorMessage.innerText = error;

}

