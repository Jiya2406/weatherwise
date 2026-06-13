const express = require("express");
const router = express.Router();
const {
  getCurrentWeather,
  getForecast,
  searchCities,
} = require("../controllers/weatherController");

// GET /api/weather/search?q=lon  -> autocomplete city suggestions
router.get("/search", searchCities);

// GET /api/weather/current?city=London  (or ?lat=..&lon=..)
router.get("/current", getCurrentWeather);

// GET /api/weather/forecast?city=London  (or ?lat=..&lon=..)
router.get("/forecast", getForecast);

module.exports = router;
