const axios = require("axios");

const BASE_URL =
  process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * A small wrapper around the OpenWeatherMap API.
 * All requests use metric units (Celsius); Fahrenheit is derived on the client.
 */

// Build common query params, optionally merged with extra params (q or lat/lon).
const buildParams = (extra) => ({
  appid: API_KEY,
  units: "metric",
  ...extra,
});

// Translate axios/OWM errors into clean Error objects with a `status` field.
const toApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message =
      status === 404
        ? "City not found. Please check the spelling and try again."
        : status === 401
        ? "Invalid or missing OpenWeatherMap API key."
        : error.response.data?.message || "Failed to fetch weather data.";
    const err = new Error(message);
    err.status = status === 404 ? 404 : status === 401 ? 500 : status;
    return err;
  }
  const err = new Error("Weather service is unreachable. Please try again later.");
  err.status = 503;
  return err;
};

// Normalize a "current weather" response into the exact fields the UI needs.
const normalizeCurrent = (data) => ({
  city: data.name,
  country: data.sys?.country,
  coordinates: { lat: data.coord?.lat, lon: data.coord?.lon },
  temperature: Math.round(data.main?.temp),
  feelsLike: Math.round(data.main?.feels_like),
  tempMin: Math.round(data.main?.temp_min),
  tempMax: Math.round(data.main?.temp_max),
  condition: data.weather?.[0]?.main,
  description: data.weather?.[0]?.description,
  icon: data.weather?.[0]?.icon,
  humidity: data.main?.humidity,
  pressure: data.main?.pressure,
  windSpeed: data.wind?.speed,
  visibility: data.visibility, // in meters
  sunrise: data.sys?.sunrise,
  sunset: data.sys?.sunset,
  timezone: data.timezone, // shift in seconds from UTC
  dateTime: data.dt, // unix timestamp
});

// Group the 3-hour forecast into 5 daily summaries.
const normalizeForecast = (data) => {
  const byDay = {};

  data.list.forEach((entry) => {
    const day = entry.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(entry);
  });

  const days = Object.keys(byDay).slice(0, 5);

  return days.map((day) => {
    const entries = byDay[day];
    // Prefer the reading closest to midday for the day's representative weather.
    const midday =
      entries.find((e) => e.dt_txt.includes("12:00:00")) ||
      entries[Math.floor(entries.length / 2)];

    const temps = entries.map((e) => e.main.temp);

    return {
      date: day,
      dateTime: midday.dt,
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      temp: Math.round(midday.main.temp),
      condition: midday.weather?.[0]?.main,
      description: midday.weather?.[0]?.description,
      icon: midday.weather?.[0]?.icon,
      humidity: midday.main.humidity,
      windSpeed: midday.wind.speed,
    };
  });
};

// --- Public service functions -------------------------------------------

const getCurrentWeatherByCity = async (city) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: buildParams({ q: city }),
    });
    return normalizeCurrent(data);
  } catch (error) {
    throw toApiError(error);
  }
};

const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: buildParams({ lat, lon }),
    });
    return normalizeCurrent(data);
  } catch (error) {
    throw toApiError(error);
  }
};

const getForecastByCity = async (city) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: buildParams({ q: city }),
    });
    return normalizeForecast(data);
  } catch (error) {
    throw toApiError(error);
  }
};

const getForecastByCoords = async (lat, lon) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: buildParams({ lat, lon }),
    });
    return normalizeForecast(data);
  } catch (error) {
    throw toApiError(error);
  }
};

/**
 * Search for matching cities for the autocomplete dropdown.
 * Uses the OpenWeatherMap Geocoding API (returns up to `limit` matches).
 */
const searchCities = async (query, limit = 5) => {
  try {
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit, appid: API_KEY },
    });
    // De-duplicate and normalize into a clean shape for the UI.
    return data.map((c) => ({
      name: c.name,
      state: c.state || "",
      country: c.country,
      lat: c.lat,
      lon: c.lon,
    }));
  } catch (error) {
    throw toApiError(error);
  }
};

module.exports = {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  searchCities,
};
