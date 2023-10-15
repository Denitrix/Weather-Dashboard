/* var weather = {
  cod: "200",
  message: 0,
  cnt: 40,
  list: [
    {
      dt: 1661871600,
      main: {
        temp: 296.76,
        feels_like: 296.98,
        temp_min: 296.76,
        temp_max: 297.87,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 933,
        humidity: 69,
        temp_kf: -1.11,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 0.62,
        deg: 349,
        gust: 1.18,
      },
      visibility: 10000,
      pop: 0.32,
      rain: {
        "3h": 0.26,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2022-08-30 15:00:00",
    },
    {
      dt: 1661882400,
      main: {
        temp: 295.45,
        feels_like: 295.59,
        temp_min: 292.84,
        temp_max: 295.45,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 931,
        humidity: 71,
        temp_kf: 2.61,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10n",
        },
      ],
      clouds: {
        all: 96,
      },
      wind: {
        speed: 1.97,
        deg: 157,
        gust: 3.39,
      },
      visibility: 10000,
      pop: 0.33,
      rain: {
        "3h": 0.57,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2022-08-30 18:00:00",
    },
    {
      dt: 1661893200,
      main: {
        temp: 292.46,
        feels_like: 292.54,
        temp_min: 290.31,
        temp_max: 292.46,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 931,
        humidity: 80,
        temp_kf: 2.15,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10n",
        },
      ],
      clouds: {
        all: 68,
      },
      wind: {
        speed: 2.66,
        deg: 210,
        gust: 3.58,
      },
      visibility: 10000,
      pop: 0.7,
      rain: {
        "3h": 0.49,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2022-08-30 21:00:00",
    },
    {
      dt: 1662292800,
      main: {
        temp: 294.93,
        feels_like: 294.83,
        temp_min: 294.93,
        temp_max: 294.93,
        pressure: 1018,
        sea_level: 1018,
        grnd_level: 935,
        humidity: 64,
        temp_kf: 0,
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d",
        },
      ],
      clouds: {
        all: 88,
      },
      wind: {
        speed: 1.14,
        deg: 17,
        gust: 1.57,
      },
      visibility: 10000,
      pop: 0,
      sys: {
        pod: "d",
      },
      dt_txt: "2022-09-04 12:00:00",
    },
  ],
  city: {
    id: 3163858,
    name: "Zocca",
    coord: {
      lat: 44.34,
      lon: 10.99,
    },
    country: "IT",
    population: 4593,
    timezone: 7200,
    sunrise: 1661834187,
    sunset: 1661882248,
  },
}; */

var apiKey = "8c72c62deec365c6dc9f57e7936265d9";

function getCoords(event) {
  //gets the latitude and longitude of inputed city name
  event.preventDefault();
  if ($(this).attr("id") == "citySearch") {
    var input = $("#cityInput").val().replaceAll(" ", "").split(","); //seperates country code from city name if inputed
    $("#cityInput").val("");
  } else {
    var input = $(this).text().replaceAll(" ", "").split(","); //seperates country code from city name if inputed
    console.log($(this).text());
  }
  var city = input[0];
  if (input[1]) {
    var country = "," + input[1];
  } else {
    var country = "";
  }
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}${country}&limit=1&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        console.log(
          "City URL:",
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}${country}&limit=1&appid=${apiKey}`
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
      saveCity(city, country.replaceAll(",", ", "));
      getWeather(lat, lon);
    });
}

function getWeather(lat, lon) {
  //fetches the weather data for a given latitude and longitude
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        console.log(
          "Weather URL:",
          `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
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
      $("#currentWeather") //changes the currentWeather header to the city name and date
        .children("h2")
        .text(
          data.city.name +
            " " +
            dayjs.unix(data.list[0].dt).format("(MM/DD/YYYY)")
        );
      $("#currentWeather") //changes the currentWeather img to the current weather icon
        .children("img")
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
            dayIndex,
            val
          );
          $(val) //changes the day's forecast header to the city name
            .children("h5")
            .text(dayjs.unix(data.list[0].dt).format("MM/DD/YYYY"));
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
    city += country;
  }
  console.log("Saving:", city);
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    console.log("Saved:", savedCities);
    var thisCity = $("<button></button>").text(city);
    thisCity.addClass(
      "btn btn-secondary form-control text-black my-2 savedCity"
    );
    $("#savedCities").append(thisCity);
  }
  localStorage.setItem("cities", JSON.stringify(savedCities));
}

function getSavedCities() {
  //gets the cities localstorage item and adds buttons for each item
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  for (i = 0; i < savedCities.length; i++) {
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
$(".savedCity").on("click", getCoords);
