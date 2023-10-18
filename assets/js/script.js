var apiKey = "8c72c62deec365c6dc9f57e7936265d9";

function getCoords(event) {
  //gets the latitude and longitude of inputed city name
  event.preventDefault();
  if ($(this).attr("id") == "citySearch") {
    var input = $("#cityInput").val().split(","); //seperates country code from city name if inputed
    console.log("City Name:", input);
    $("#cityInput").val("");
  } else {
    var input = $(event.target).text().split(","); //seperates country code from city name if inputed
    console.log("City Name:", $(event.target).text());
  }
  var city = input[0];
  if (input[1]) {
    var country = "," + input[1];
  } else {
    var country = "";
  }
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}${country}&limit=1&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        console.log(
          "City URL:",
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}${country}&limit=1&appid=${apiKey}`
        );
        return response.json();
      } else {
        //TODO: Error message on not response.ok
      }
    })
    .then((data) => {
      console.log("City Data:", data[0]);
      var lat = data[0].lat;
      var lon = data[0].lon;
      console.log("Latitude:", lat, " Longitude:", lon);
      if ($(this).attr("id") == "citySearch") {
        saveCity(data[0].name, country.replaceAll(",", ", "));
      }
      getWeather(lat, lon);
    });
}

function getWeather(lat, lon) {
  //fetches the weather data for a given latitude and longitude
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        console.log(
          "Weather URL:",
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
        );
        return response.json();
      } else {
        //TODO: Error message on not response.ok
      }
    })
    .then((data) => {
      console.log("Weather Data:", data);
      console.log(
        //logs the current weather data and and the date
        "Today:",
        data.list[0],
        dayjs.unix(data.list[0].dt).format("MM/DD/YYYY")
      );
      if (data.city.country) {
        var country = ", " + data.city.country + " ";
      } else {
        var country = " ";
      }
      $("#currentWeather") //changes the currentWeather header to the city name and date
        .children("h2")
        .text(
          data.city.name +
            country +
            dayjs.unix(data.list[0].dt).format("(MM/DD/YYYY)")
        );
      $("#currentWeather") //changes the currentWeather img to the current weather icon
        .find("img")
        .attr({
          src: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
          alt: data.list[0].weather[0].main + " weather icon",
        });
      $("#currentWeather") //changes the currentWeather temp text to the temperature
        .children(".temp")
        .text("Temp: " + data.list[0].main.temp + "9\xB0F");
      $("#currentWeather") //changes the currentWeather wind to the wind speed
        .children(".wind")
        .text("Wind: " + data.list[0].wind.speed + "MPH");
      $("#currentWeather") //changes the currentWeather humid to the humidity
        .children(".humid")
        .text("Humidity: " + data.list[0].main.humidity + "%");
      /* for (i = 7; i < data.list.length; i += 8) */
      $("#forecast")
        .children()
        .each(function (i, val) {
          var dayIndex = 7 + i * 8; //the index for the weather data of the date at the current time
          var date = dayjs.unix(data.list[dayIndex].dt).format("MM/DD/YYYY"); //current date formated
          console.log(
            //logs the weather data and and the date for each day
            "Day " + (i + 2) + ":",
            data.list[dayIndex],
            date,
            dayIndex
          );
          $(val) //changes the day's forecast header to the city name
            .children("h5")
            .text(dayjs.unix(data.list[dayIndex].dt).format("MM/DD/YYYY"));
          $(val) //changes the day's forecast img to the current weather icon
            .children("img")
            .attr({
              src: `https://openweathermap.org/img/wn/${data.list[dayIndex].weather[0].icon}@2x.png`,
              alt: data.list[dayIndex].weather[0].main + " weather icon",
            });
          $(val) //changes the day's forecast temp text to the temperature
            .children(".temp")
            .text("Temp: " + data.list[dayIndex].main.temp + "9\xB0F");
          $(val) //changes the day's forecast wind to the wind speed
            .children(".wind")
            .text("Wind: " + data.list[dayIndex].wind.speed + "MPH");
          $(val) //changes the day's forecast humid to the humidity
            .children(".humid")
            .text("Humidity: " + data.list[dayIndex].main.humidity + "%");
        });
    });
}

function saveCity(city, country) {
  //saves the searched city in local storage
  if (country) {
    // adds country code if it was inputed
    city += country.toUpperCase();
  }
  console.log("Saving:", city);
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    var thisCity = $("<button></button>").text(city);
    thisCity.addClass(
      "btn btn-secondary form-control text-black my-2 savedCity"
    );
    $("#savedCities").append(thisCity);
  }
  while (savedCities.length > 15) {
    savedCities.shift();
  }
  localStorage.setItem("cities", JSON.stringify(savedCities));
  getSavedCities();
}

function getSavedCities() {
  //gets the cities localstorage item and adds buttons for each item
  $("#savedCities").html("");
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  console.log("Saved:", savedCities);
  for (i = savedCities.length - 1; i > -1; i--) {
    var name = savedCities[i];
    var thisCity = $("<button></button>").text(name);
    thisCity.addClass(
      "btn btn-secondary form-control text-black my-2 savedCity"
    );
    $("#savedCities").append(thisCity);
  }
}

getSavedCities();
getWeather(0, 0);
$("#citySearch").on("submit", getCoords);
$(document).delegate(".savedCity", "click", getCoords);
