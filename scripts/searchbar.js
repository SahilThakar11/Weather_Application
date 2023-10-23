let btnSearch = document.querySelector(".btnSearch");
btnSearch.addEventListener("click", function (e) {
  let cityinput = document.querySelector(".search-bar").value;

  getWeatherData(cityinput);
  getNextDaysWeather(cityinput);
  getWeeklyMaxTemperatures(cityinput);
  e.stopPropagation();
  e.preventDefault();
});
