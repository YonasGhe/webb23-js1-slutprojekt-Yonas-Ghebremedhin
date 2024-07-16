const apiKey = "78a99f0ea4a259da90f9dda6a811ec3e";

let city = "";
let lat = "";
let lon = "";
let errorMessage = document.querySelector("h4");

const form = document.getElementById("weatherForm");
const input = document.getElementById("cityInput");
const forecastHoursInput = document.getElementById("forecastHours");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", findWeather);

function findWeather(event) {
    event.preventDefault();
    city = input.value.trim();
    form.reset();
    resetForecast();
    console.log(`Finding weather for city: ${city}`);

    const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(weatherUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch city data.");
            }
        })
        .then((data) => {
            console.log("City data received:", data);
            if (!data || data.length === 0 || !data[0].lat || !data[0].lon) {
                throw new Error("Invalid city data.");
            }

            lat = data[0].lat;
            lon = data[0].lon;

            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(weatherApiUrl);
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch weather data.");
            }
        })
        .then(displayWeather)
        .catch(handleError);
}

function displayWeather(data) {
    console.log("Weather data received:", data);
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const iconCode = data.weather[0].icon;

    const weatherData = document.querySelector(".weatherData");
    weatherData.innerHTML = `
        <h2>Current weather in ${city}</h2>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <div class="weatherInfo">
            <p>Temperature: ${temperature}°C</p>
            <p>Wind speed: ${windSpeed} m/s</p>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${lon}</p>
        </div>`;

    // Reveal the forecast input
    forecastHoursInput.removeAttribute("hidden");
    submitButton.innerText = "Show Forecast";
}

submitButton.addEventListener("click", (event) => {
    if (submitButton.innerText === "Show Forecast") {
        displayForecast(event);
    }
});

function displayForecast(event) {
    event.preventDefault();
    const hours = parseInt(forecastHoursInput.value);
    console.log(`Displaying forecast for ${hours} hours`);

    if (![3, 6, 9, 12].includes(hours)) {
        errorMessage.innerText = "Please enter 3, 6, 9, or 12 hours.";
        resetForecast();
        return;
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch forecast data.");
            }
        })
 
        .then((forecastData) => {
            console.log("Forecast data received:", forecastData);
            const forecastResult = document.getElementById("result");
            forecastResult.innerHTML = `<h3>${hours} hours forecast in ${city}</h3>`;

            const currentTime = new Date().getTime();

            const filteredForecast = forecastData.list.filter((item) => {
                const itemTime = new Date(item.dt * 1000).getTime();
                const hoursDifference = (itemTime - currentTime) / (1000 * 60 * 60);

                return hoursDifference >= 0 && hoursDifference < hours;
            });

            filteredForecast.forEach((item) => {
                const temperature = item.main.temp;
                const iconCode = item.weather[0].icon;
                const forecastTime = new Date(item.dt * 1000).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecastItem");
                forecastItem.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
                    <p>Temperature at ${forecastTime}: ${temperature}°C</p>`;
                forecastResult.appendChild(forecastItem);
            });
        })
        .catch(handleError);
}

function resetForecast() {
    const forecastResult = document.getElementById("result");
    forecastResult.innerHTML = "";
    forecastHoursInput.value = "";
    forecastHoursInput.setAttribute("hidden", true);
    submitButton.innerText = "Show Weather";
}

function handleError(error) {
    console.error("Error occurred:", error);
    errorMessage.innerText = error.message;
}
