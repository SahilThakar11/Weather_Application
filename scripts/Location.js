// const apiKey = "cbafd9efbbfea5b23d7266ddcf28daa0";
const apiKey = "9b4bbf30228eb8528d36e79d05da1fac";
const iconMapping = {
  "01d": "Media/url-img/url-to-clear-sky-icon.png",
  "01n": "Media/url-img/url-to-clear-sky-night-icon.png",
  "02d": "Media/url-img/url-to-few-clouds-icon.png",
  "02n": "Media/url-img/url-to-broken-clouds-night-icon.png",
  "03d": "Media/url-img/url-to-few-clouds-icon.png",
  "03n": "Media/url-img/url-to-broken-clouds-night-icon.png",
  "04d": "Media/url-img/url-to-broken-clouds-icon.png",
  "04n": "Media/url-img/url-to-broken-clouds-night-icon.png",
  "09d": "Media/url-img/url-to-shower-rain-icon.png",
  "09n": "Media/url-img/url-to-shower-rain-night-icon.png",
  "10d": "Media/url-img/url-to-rain-icon.png",
  "10n": "Media/url-img/url-to-rain-icon.png",
  "11d": "Media/url-img/url-to-thunderstorm-icon.png",
  "11n": "Media/url-img/url-to-thunderstorm-icon.png",
  "13d": "Media/url-img/url-to-snow-icon.png",
  "13n": "Media/url-img/url-to-snow-night-icon.png",
  "50d": "Media/url-img/url-to-mist-icon.png",
  "50n": "Media/url-img/url-to-mist-night-icon.png",
  // Add more mappings for specific icons as needed
};
// -------------------------------------------------------Get User Location-------------------------------------------------------
let btnGetLocation = document.querySelector(".btnGetLocation");
async function getGeographyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("access Denied");
  }
  async function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      const city = data.city;
      let userCity = city;

      getWeatherData(userCity);
      getNextDaysWeather(userCity);
      getWeeklyMaxTemperatures(userCity);
    } catch (err) {
      console.log(err);
    }
  }
}
btnGetLocation.addEventListener("click", getGeographyLocation());
