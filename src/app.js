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

  let hours = now.getHours();

  let AmOrPm = "";
  if (hours > 11) {
    AmOrPm = "PM";
  } else {
    AmOrPm = "AM";
  }

  if (hours > 12) {
    hours = hours - 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  hours = String(hours).padStart(2, "0");

  let minutes = String(now.getMinutes()).padStart(2, "0");

  h2.innerHTML = `${day} ${hours}:${minutes} ${AmOrPm}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let weatherForecast = document.querySelector(".weather-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
     <div class="col">
      <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
      <img
        src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
          forecastDay.condition.icon
        }.png"
        alt=""
        width="50px"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">${Math.round(
          forecastDay.temperature.maximum
        )}°/</span>
        <span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temperature.minimum
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
  let apiKey = "4e350df61at74oee42abc35600fd88fb";
  let units = "imperial";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(displayForecast);
}

function updateLocationData(response) {
  if (response.data.message !== "City not found") {
    let h1 = document.querySelector("h1");
    h1.innerHTML = response.data.city;
    let h3 = document.querySelector("h3");
    let weatherDescription = response.data.condition.description;
    h3.innerHTML = weatherDescription;
    let currentWeatherIcon = document.querySelector("#current-weather-icon");
    currentWeatherIcon.setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );
    let currentTemperature = document.querySelector("#current-temp-value");
    fahrenheitTemperature = Math.round(response.data.temperature.current);
    currentTemperature.innerHTML = fahrenheitTemperature;
    let currentHumidity = document.querySelector("#humidity");
    let humidity = response.data.temperature.humidity;
    currentHumidity.innerHTML = humidity;
    let currentWind = document.querySelector("#wind");
    let wind = Math.round(response.data.wind.speed);
    currentWind.innerHTML = wind;
    getForecast(response.data.coordinates);
  }
}

function searchCity(city) {
  let units = "imperial";
  let apiKey = "4e350df61at74oee42abc35600fd88fb";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
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
  let units = "imperial";
  let apiKey = "4e350df61at74oee42abc35600fd88fb";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateLocationData);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocationData);
}

let compass = document.querySelector(".compass");
compass.addEventListener("click", getCurrentLocation);

searchCity("Austin");
displayCurrentDate();
