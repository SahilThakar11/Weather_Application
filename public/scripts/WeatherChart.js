function getWeeklyMaxTemperatures(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=17&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const forecasts = data.list;

      const dailyMaxTemperatures = {};
      forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const forecastDate = date.toISOString().split("T")[0];
        const temperature = Math.round(forecast.temp.max - 273.15);

        dailyMaxTemperatures[forecastDate] = temperature;
      });

      const dates = Object.keys(dailyMaxTemperatures);
      const maxTemperatures = dates.map((date) => dailyMaxTemperatures[date]);

      createWeeklyMaxTemperatureChart(dates, maxTemperatures);
      getCName(cityName);
    })
    .catch((error) => {
      console.error(error);
    });
}
getWeeklyMaxTemperatures("New York");
function createWeeklyMaxTemperatureChart(dates, maxTemperatures) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Max Temperature (°C)",
          data: maxTemperatures,
          fill: true,
          fontColor: "white",
          borderColor: "cyan",
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: "cyan",
          pointBorderWidth: 2,
          lineTension: 0.2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y: {
          beginAtZero: true,

          ticks: {
            color: "white",
          },
          max: Math.max(...maxTemperatures) + 3,
        },
      },
    },
  });
}
async function getCName(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }

    const data = await res.json();
    const sys = data.sys;
    let weatherCountry = sys.country;
    let cc = document.querySelector(".cName");
    cc.innerHTML = "";
    cc.innerHTML = `${cityName} ,${weatherCountry}<br><img class="flagChart" src="https://flagsapi.com/${weatherCountry}/flat/32.png">`;
  } catch (error) {}
}
