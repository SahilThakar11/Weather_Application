async function getRandomeWeather(e) {
  e.preventDefault();

  try {
    const response = await fetch("https://randomuser.me/api/");
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    const randomCity = data.results[0].location.city;
    getWeatherData(randomCity);
    getNextDaysWeather(randomCity);
    getWeeklyMaxTemperatures(randomCity);
  } catch (err) {
    return null;
  }
}

const btnRandom = document.querySelector("#randome");
btnRandom.addEventListener("click", getRandomeWeather);
