function displayCurrentDate() {
  let now = new Date();
  let h2 = document.querySelector("h2");

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");

  h2.innerHTML = `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let weatherForecast = document.querySelector(".weather-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
     <div class="col">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="40px"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">${Math.round(
          forecastDay.temp.max
        )}°/</span>
        <span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  weatherForecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(displayForecast);
}

function updateLocationData(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  let h3 = document.querySelector("h3");
  let weatherDescription = response.data.weather[0].description;
  h3.innerHTML = weatherDescription;
  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let currentTemperature = document.querySelector("#current-temp-value");
  celsiusTemperature = Math.round(response.data.main.temp);
  currentTemperature.innerHTML = celsiusTemperature;
  let currentHumidity = document.querySelector("#humidity");
  let humidity = response.data.main.humidity;
  currentHumidity.innerHTML = humidity;
  let currentWind = document.querySelector("#wind");
  let wind = Math.round(response.data.wind.speed);
  currentWind.innerHTML = wind;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  getForecast(response.data.coord);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(updateLocationData);
}

function findCity(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#city-search-input");
  let city = citySearchInput.value;
  citySearchInput.value = "";
  searchCity(city);
}

let searchButton = document.querySelector(".search-box");
searchButton.addEventListener("submit", findCity);

function getCurrentLocationData(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(updateLocationData);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocationData);
}

let compass = document.querySelector(".compass");
compass.addEventListener("click", getCurrentLocation);

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temp-value");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  currentTemperature.innerHTML = fahrenheitTemperature;
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temp-value");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertToCelsius);

let celsiusTemperature = null;

searchCity("Austin");
displayCurrentDate();
