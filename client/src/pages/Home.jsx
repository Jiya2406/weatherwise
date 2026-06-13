import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import SearchHistory from "../components/SearchHistory";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../services/weatherApi";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved search history from the backend.
  const refreshHistory = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      // History is non-critical; ignore failures silently.
    }
  }, []);

  // Load history once on mount.
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Search weather + forecast by city name.
  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    try {
      const [current, days] = await Promise.all([
        getCurrentWeatherByCity(city),
        getForecastByCity(city),
      ]);
      setWeather(current);
      setForecast(days);
      refreshHistory(); // the backend just saved this search
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search weather + forecast by coordinates (used by geolocation and by
  // selecting a city from the autocomplete dropdown).
  const handleSearchCoords = async (lat, lon) => {
    setLoading(true);
    setError("");
    try {
      const [current, days] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
      ]);
      setWeather(current);
      setForecast(days);
      refreshHistory();
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search weather by the user's current location.
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => handleSearchCoords(coords.latitude, coords.longitude),
      () => {
        setLoading(false);
        setError("Unable to retrieve your location. Please allow access.");
      }
    );
  };

  // Delete a single history entry.
  const handleDeleteHistory = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch {
      /* ignore */
    }
  };

  // Clear all history.
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Intro shown only before the first search */}
      {!weather && !loading && !error && (
        <div className="text-center mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Check the weather anywhere 🌍
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Search any city or use your current location.
          </p>
        </div>
      )}

      <SearchBar
        onSearch={handleSearch}
        onSelectCoords={handleSearchCoords}
        onLocate={handleLocate}
        loading={loading}
      />

      {loading && <Loader />}
      {error && !loading && <ErrorMessage message={error} />}

      {!loading && weather && (
        <>
          <WeatherCard weather={weather} />
          <Forecast forecast={forecast} />
        </>
      )}

      <SearchHistory
        history={history}
        onSelect={handleSearch}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />
    </main>
  );
};

export default Home;
