const cityInputEl = document.querySelector("#city");

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

};