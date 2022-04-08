var cities = [];

var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");

var formSubmitHandler = function (event) {

    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        get5DayForecast(city);
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

    // Fetches said information and converts it to JSON so it may be fed to displayUvIndex function
    fetch(apiURL)

        .then(function(response){

        response.json()

            .then(function(data){

            displayUvIndex(data)

        });
    });
}

var displayUvIndex = function(index){

    // Creates div element that contains text presenting UV Index value
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    // Creates span element that contains the UV Index value
    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    // If statement that checks index.value then assigns a rating of either favorable, moderate, or severe.
    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    // Appends uvIndexValue to uvIndexE1 then appends uvIndexValue to weatherContainerE1 (current weather)
    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
};

var get5DayForecast = function(city){

    var apiKey = "ae272275ce874ef7b48d818cfa8d90e6"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)

    .then(function(response){

        response.json()
            .then(function(data){

           display5DayForecast(data);

        });
    });
};

// This function creates a div container that contains our cards then appends it to the 5Day Forecast container

var display5DayForecast = function(weather) {

    // Sets forecastContainerE1 content to an empty string
    // Sets forecastTitle content to a string containing "5-Day Forecast:"
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    // Loops through the 5-Day weather forecast
    var forecast = weather.list;

        for(var i=5; i < forecast.length; i=i+8){

    // Sets dailyForecast to the specified spot in the above loop 
    var dailyForecast = forecast[i];
        
    // Creates div element and assigns it a classList filled with bootstrap styling
    var forecastEl=document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    // Creates an h5 element. This element will contain textContent equal to the date as determined by Moment.js. It will then be assigned bootstrap styling then it will be appended to the div above.
    var forecastDate = document.createElement("h5")
    forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center"
    forecastEl.appendChild(forecastDate);

    // Create image element with boostrap styling that contains an icon provided by OpenWeather One Call API!
    var weatherIcon = document.createElement("img")
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

    // Append the weatherIcon to forecastE1
    forecastEl.appendChild(weatherIcon);
    
    // Creates span w/ bootstrap styling that contains the temperature pulled from main
    var forecastTempEl=document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";

    // append the above to our forecast container
    forecastEl.appendChild(forecastTempEl);

    // Creats span w/ bootstrap styling that contains the wind speed pulled from main
    var forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body text-center";
    forecastWindEl.textContent = dailyForecast.main.wind + " MPH";
    forecastEl.appendChild(forecastWindEl);

    // Creates span w/ bootstrap styling that contains the humidity percentage pulled from main
    var forecastHumEl=document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  % Humidity";

    // Append the above to our forecast container
    forecastEl.appendChild(forecastHumEl);

    // Append our forecast container to the 5DForecast container so that all 5 days may be displayed side by side.
    forecastContainerEl.appendChild(forecastEl);
    }
};

cityFormEl.addEventListener("submit", formSubmitHandler);