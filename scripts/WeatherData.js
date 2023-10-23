// -----------------------------------------------------Get Weather Data----------------------------------------------------------
async function getWeatherData(weatherCity) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }

    const data = await res.json();

    let weatherCityName = data.name;
    let weathericon;
    let Main;
    let Desc;
    data.weather.forEach((currentWeather) => {
      let main = currentWeather.main;
      let description = currentWeather.description;
      let icon = currentWeather.icon;
      weathericon = icon;
      Main = main;
      Desc = description;
    });
    let mainData = data.main;
    let pressure = mainData.pressure;
    let pressureContainer = document.querySelector(".pressure-data");
    pressureContainer.innerHTML = pressure + " mb";
    let visibility = data.visibility / 1000;
    const visibilityCategory = getVisibilityCategory(visibility);
    let visibilityContainer = document.querySelector(".visibility-data");
    visibilityContainer.innerHTML = visibility + "km - " + visibilityCategory;
    let temperature = Math.round(mainData.temp - 273.15);
    let feelsLike = Math.round(mainData.feels_like - 273.15);
    let humidity = mainData.humidity;
    const windData = data.wind;
    let speed = windData.speed;
    let degree = windData.deg;
    const directions = [
      "North",
      "North-East",
      "East",
      "South-East",
      "South",
      "South-West",
      "West",
      "North-West",
    ];
    const indexDegree = Math.round(degree / 45) % 8;
    let direction = directions[indexDegree];
    const sys = data.sys;
    let weatherCountry = sys.country;
    let sunrise = sys.sunrise;
    const sunriseTime = new Date(sunrise * 1000);
    let sunset = sys.sunset;
    const sunsetTime = new Date(sunset * 1000);
    const formattedSunrise = sunriseTime.toLocaleTimeString();
    const formattedSunset = sunsetTime.toLocaleTimeString();
    const flagURL = await getCountryFlag(weatherCountry);

    let weatherDataContainer = document.querySelector(".weather-data");
    weatherDataContainer.innerHTML = "";
    let dataDiv = document.createElement("div");
    dataDiv.className = "cell dayDiv";
    dataDiv.innerHTML = `
        <span class="cityTitle">${weatherCityName},${weatherCountry}</span>
        <img class="flag" src="https://flagsapi.com/${weatherCountry}/flat/32.png">
        <br />
        <span class="mainTemp">${temperature}°</span>
        <br />
        <span class="mainTemp">Feels Like:${feelsLike}°</span>
        <br />
        <img class="wIcon" src="${iconMapping[weathericon]}" alt="weather-Icon" width="100px" height="100px">
        <span class="mainStat">${Main}: ${Desc}</span>
        `;
    weatherDataContainer.appendChild(dataDiv);

    let weatherWindContainer = document.querySelector(".wind");
    weatherWindContainer.innerHTML = "";
    let windDiv = document.createElement("div");
    windDiv.className = "cell windDiv";
    windDiv.innerHTML = `
        <h3>Wind Speed</h3>
        <span class="wind-speed"
              ><img
                src="./Media/windSpeed.png"
                alt="wind speed"
                height="100px"
                width="100px"
            /></span>
        <span class="wind-data">${speed} Km/h <br /> ${direction}</span>
        

        `;
    weatherWindContainer.appendChild(windDiv); //
    const humidityText = document.querySelector(".percentage");
    humidityText.textContent = `${humidity}%`;

    let weatherSunData = document.querySelector(".sunset-sunrise");
    weatherSunData.innerHTML = "";
    let sunDiv = document.createElement("div");
    sunDiv.className = "cell sunDiv";
    sunDiv.innerHTML = `
        <img class="ImgRise" src="./Media/sunrise.png" width="50px" height="50px" />
        <span class="tmRise">Sunrise: ${formattedSunrise} (EST)</span>
        <br />
        <br />
        <img class="ImgSet" src="./Media/sunset.png" width="50px" height="50px" />
        <span class="tmSet">Sunset: ${formattedSunset} (EST)</span>
      `;
    weatherSunData.appendChild(sunDiv);

    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
    const uvRes = await fetch(uvUrl);
    if (!uvRes.ok) {
      throw new Error(`UV API response was not ok: ${uvRes.status}`);
    }
    const uvData = await uvRes.json();
    const uvIndex = uvData.value;
    const uvColor = getColorBasedOnUV(uvIndex);
    const uvDescription = getUVDescription(uvIndex);

    // Update the HTML to display the UV index bar with the color
    let uvIndexContainer = document.querySelector(".Uv-index");
    uvIndexContainer.classList.add("uvDiv");
    uvIndexContainer.innerHTML = `
        <h3>UV Index</h3>
        <span class="uv-info"> ${uvIndex}<br> (${uvDescription})</span>
        <div class="uv-bar" style="background-color: ${uvColor};"></div>
        <p></p>
      `;
  } catch (err) {
    console.error(err);
  }
}

function getColorBasedOnUV(uvIndex) {
  if (uvIndex <= 3) {
    return "green"; // Low UV index
  } else if (uvIndex <= 5) {
    return "yellow"; // Moderate UV index
  } else if (uvIndex <= 7) {
    return "#FFA500"; // High UV index
  } else if (uvIndex <= 10) {
    return "red"; // Very high UV index
  } else {
    return "purple"; // Extreme UV index
  }
}
function getUVDescription(uvIndex) {
  if (uvIndex < 3 && uvIndex > 0) {
    return "Low";
  } else if (uvIndex < 6) {
    return "Medium";
  } else if (uvIndex < 8) {
    return "High";
  } else if (uvIndex < 11) {
    return "Very High";
  } else {
    return "Extreme";
  }
}
async function getCountryFlag(countryCode) {
  try {
    const countryInfoUrl = `https://restcountries.com/v3/alpha/${countryCode}`;
    const response = await fetch(countryInfoUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch country information: ${response.status}`
      );
    }

    const countryData = await response.json();

    if (Array.isArray(countryData.flags) && countryData.flags.length > 0) {
      const flagURL = countryData.flags[0];
      return flagURL;
    } else {
      throw new Error("Country flag data is missing or empty.");
    }
  } catch (error) {
    console.error(error);
    return null; // Return null in case of an error
  }
}
function getVisibilityCategory(visibility) {
  if (visibility < 1) {
    return "Poor";
  } else if (visibility < 5) {
    return "Moderate";
  } else {
    return "Good";
  }
}
