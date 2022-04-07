var cities = [];

var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");

var formSubmitHandler = function (event) {

    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }

    localSaveSearch();

};

var localSaveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function (city) {

    // Contains info necessary to fetch weather info from OpenWeather One Call API

    var apiKey = "ae272275ce874ef7b48d818cfa8d90e6";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    
    // Fetches said information and converts it to JSON so it may be fed to displayWeather function

    fetch(apiURL)

        .then(function (response) {

        response.json()
            
            .then(function (data) {

            displayWeather(data, city);

        });
    });
};

var displayWeather = function (weather, searchCity) {

    // Clears the current weather container's input, setting it to an empty string
    // Sets citySearchInputE1's text content to the function's argument (searchCity)
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    // Creates span element containing the date provided by Moment.js
    var currentDate = document.createElement("span");

    // Moment.js is used to set the current date
    currentDate.textContent = "(" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // Creates image element for weather icon
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );

    citySearchInputEl.appendChild(weatherIcon);

    // Creates span element to contain temperature in Fahrenheit
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    // Creates spam element to contain air humidity percentage
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    // Creates span element to contain wind speed in MPH
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item";

    // Appends generated temp, humidity, and wind speed to weatherContainerE1
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    // Latitude and Longitude 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
};

var getUvIndex = function(lat,lon){
    
    var apiKey = "ae272275ce874ef7b48d818cfa8d90e6"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)

        .then(function(response){

        response.json()

            .then(function(data){

            displayUvIndex(data)

        });
    });
}

// displayUvIndex

cityFormEl.addEventListener("submit", formSumbitHandler);