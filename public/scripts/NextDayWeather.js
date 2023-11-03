const apiKey = "9b4bbf30228eb8528d36e79d05da1fac";
async function getNextDaysWeather(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }
    const data = await res.json();
    const forecasts = data.list;
    const forecastContainer = document.querySelector(".forecast-container");

    forecastContainer.innerHTML = "";

    // Define the specific hours you want to display (2 AM, 5 AM, 8 AM, 11 AM).
    const targetHours = [2, 5, 8, 11];

    let currentDay = "";
    let skipFirstDay = true;
    forecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Check if this forecast belongs to the next day
      if (formattedDate !== currentDay) {
        currentDay = formattedDate;
        if (skipFirstDay) {
          skipFirstDay = false;
        } else {
        }
        // Create a card element for the day
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${formattedDate}</h5>
            <div class="weather-details"></div>
          </div>
        `;

        forecastContainer.appendChild(card);
      }

      // Populate the card with weather information
      const card = forecastContainer.lastChild;
      const weatherDetails = card.querySelector(".weather-details");

      const formattedHour = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const icon = forecast.weather[0].icon;
      const temperature = Math.round(forecast.main.temp - 273.15);
      const feels_like = Math.round(forecast.main.feels_like - 273.15);
      const weatherDescription = forecast.weather[0].main;

      // Create elements to display the data inside the card
      const weatherInfo = document.createElement("div");
      weatherInfo.classList.add("cell");
      weatherInfo.innerHTML = `
        <p>${formattedHour}</p>
        <img src="${iconMapping[icon]}" alt="Weather Icon" style="height: 50px; width: 50px;">
        <p>${temperature}°C / feels like ${feels_like}°C</p>
        <p>${weatherDescription}</p>
      `;
      weatherDetails.appendChild(weatherInfo);
      getCountryName(cityName);
    });
  } catch (error) {
    console.log(error);
  }
}
async function getCountryName(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }

    const data = await res.json();
    const sys = data.sys;
    let weatherCountry = sys.country;
    document.querySelector(
      ".cityName"
    ).innerHTML = `${cityName}, ${weatherCountry} <img class="flag" src="https://flagsapi.com/${weatherCountry}/flat/32.png">`;
  } catch (error) {}
}
getNextDaysWeather("New York");
