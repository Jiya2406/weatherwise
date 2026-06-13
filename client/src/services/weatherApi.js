import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Shared axios instance pointed at our backend.
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Pull a friendly message out of an axios error.
const extractError = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

// --- Weather -----------------------------------------------------------

export const getCurrentWeatherByCity = async (city) => {
  try {
    const { data } = await api.get("/weather/current", { params: { city } });
    return data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const { data } = await api.get("/weather/current", {
      params: { lat, lon },
    });
    return data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const getForecastByCity = async (city) => {
  try {
    const { data } = await api.get("/weather/forecast", { params: { city } });
    return data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const getForecastByCoords = async (lat, lon) => {
  try {
    const { data } = await api.get("/weather/forecast", {
      params: { lat, lon },
    });
    return data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

// --- City autocomplete -------------------------------------------------

export const searchCities = async (query) => {
  try {
    const { data } = await api.get("/weather/search", { params: { q: query } });
    return data.data;
  } catch {
    // Suggestions are non-critical — fail quietly so typing isn't disrupted.
    return [];
  }
};

// --- Search history ----------------------------------------------------

export const getHistory = async () => {
  try {
    const { data } = await api.get("/history");
    return data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const { data } = await api.delete(`/history/${id}`);
    return data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const clearHistory = async () => {
  try {
    const { data } = await api.delete("/history");
    return data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export default api;
