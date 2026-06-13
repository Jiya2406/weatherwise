import { useState, useEffect, useRef } from "react";
import { searchCities } from "../services/weatherApi";

// Build a readable label like "London, England, GB".
const cityLabel = (c) =>
  [c.name, c.state, c.country].filter(Boolean).join(", ");

/**
 * Search bar with a city autocomplete dropdown and a geolocation button.
 * - onSearch(city)            -> free-text search (Enter / Search button)
 * - onSelectCoords(lat, lon)  -> a dropdown suggestion was picked (precise)
 * - onLocate()                -> "use my location"
 * - loading                   -> disables controls while fetching
 */
const SearchBar = ({ onSearch, onSelectCoords, onLocate, loading }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const skipFetch = useRef(false); // don't re-fetch right after selecting
  const containerRef = useRef(null);

  // Debounced fetch of city suggestions as the user types.
  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }
    const query = city.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchCities(query);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIndex(-1);
    }, 350);

    return () => clearTimeout(timer);
  }, [city]);

  // Close the dropdown when clicking outside the search bar.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      setOpen(false);
      onSearch(trimmed);
    }
  };

  const handleSelect = (suggestion) => {
    skipFetch.current = true;
    setCity(cityLabel(suggestion));
    setOpen(false);
    setSuggestions([]);
    onSelectCoords(suggestion.lat, suggestion.lon);
  };

  // Keyboard navigation through the suggestion list.
  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-xl mx-auto relative"
    >
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search for a city..."
            autoComplete="off"
            disabled={loading}
            className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-4 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />

          {/* Autocomplete dropdown */}
          {open && (
            <ul className="absolute z-30 mt-2 w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <li key={`${s.lat}-${s.lon}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-2 ${
                      i === activeIndex
                        ? "bg-blue-50 dark:bg-slate-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="text-slate-400">📍</span>
                    <span className="text-slate-700 dark:text-slate-200">
                      {cityLabel(s)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white shadow-md disabled:opacity-60"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onLocate}
            disabled={loading}
            title="Use my current location"
            className="rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-3 text-slate-700 dark:text-slate-200 shadow-sm disabled:opacity-60"
          >
            📍<span className="hidden sm:inline ml-1">My Location</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
