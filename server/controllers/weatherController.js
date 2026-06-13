const weatherService = require("../services/weatherService");
const { saveSearch } = require("./historyController");

/**
 * GET /api/weather/current?city=London
 * GET /api/weather/current?lat=51.5&lon=-0.12
 * Returns the current weather for a city name or coordinates.
 */
const getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    let data;
    if (city) {
      data = await weatherService.getCurrentWeatherByCity(city.trim());
    } else if (lat && lon) {
      data = await weatherService.getCurrentWeatherByCoords(lat, lon);
    } else {
      return res.status(400).json({
        success: false,
        message: "Provide a 'city' or both 'lat' and 'lon' query params.",
      });
    }

    // Record the lookup in search history (non-blocking, never throws).
    saveSearch(data);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/forecast?city=London
 * GET /api/weather/forecast?lat=51.5&lon=-0.12
 * Returns a 5-day forecast for a city name or coordinates.
 */
const getForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    let data;
    if (city) {
      data = await weatherService.getForecastByCity(city.trim());
    } else if (lat && lon) {
      data = await weatherService.getForecastByCoords(lat, lon);
    } else {
      return res.status(400).json({
        success: false,
        message: "Provide a 'city' or both 'lat' and 'lon' query params.",
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/search?q=lon
 * Returns city suggestions for the search autocomplete dropdown.
 */
const searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }
    const data = await weatherService.searchCities(q.trim());
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentWeather, getForecast, searchCities };
