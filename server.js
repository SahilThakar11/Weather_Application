const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/Charts", (req, res) => {
  res.sendFile(path.join(__dirname, "public/WeatherCharts.html"));
});

app.get("/Forecast", (req, res) => {
  res.sendFile(path.join(__dirname, "public/NxtDayForecast.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
