// Convert Celsius to Fahrenheit (rounded).
export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);

// OpenWeatherMap icon URL (2x size).
export const iconUrl = (icon) =>
  icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : "";

// Capitalize the first letter of each word.
export const capitalize = (text = "") =>
  text.replace(/\b\w/g, (ch) => ch.toUpperCase());

// Visibility comes in meters -> show in km.
export const formatVisibility = (meters) =>
  meters == null ? "—" : `${(meters / 1000).toFixed(1)} km`;

// Wind speed comes in m/s -> show in km/h.
export const formatWind = (mps) =>
  mps == null ? "—" : `${Math.round(mps * 3.6)} km/h`;

/**
 * Format a unix timestamp (seconds) into a readable local date/time for the
 * searched city, using the city's timezone offset (seconds from UTC).
 */
export const formatCityDateTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!unixSeconds) return "";
  // Shift into the city's local time, then read as UTC.
  const local = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return local.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

// Format a forecast date string ("YYYY-MM-DD") into a short weekday + date.
export const formatForecastDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};
