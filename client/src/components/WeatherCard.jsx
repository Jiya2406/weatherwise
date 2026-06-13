import {
  celsiusToFahrenheit,
  iconUrl,
  capitalize,
  formatVisibility,
  formatWind,
  formatCityDateTime,
} from "../utils/format";

// A single stat tile (humidity, wind, etc.)
const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white/60 dark:bg-slate-800/60 px-4 py-3">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  </div>
);

/**
 * The primary weather display card showing current conditions and all metrics.
 */
const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const {
    city,
    country,
    temperature,
    feelsLike,
    condition,
    description,
    icon,
    humidity,
    pressure,
    windSpeed,
    visibility,
    timezone,
    dateTime,
  } = weather;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 text-white shadow-xl animate-fade-in">
      {/* Header: location + date */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {city}
            {country && (
              <span className="text-blue-100 dark:text-slate-400">
                , {country}
              </span>
            )}
          </h2>
          <p className="text-blue-100 dark:text-slate-400 text-sm mt-1">
            {formatCityDateTime(dateTime, timezone)}
          </p>
        </div>
        <div className="flex items-center">
          <img
            src={iconUrl(icon)}
            alt={condition}
            className="h-20 w-20 -my-2 drop-shadow"
          />
        </div>
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-4 mt-2">
        <span className="text-6xl sm:text-7xl font-extrabold leading-none">
          {temperature}°
        </span>
        <div className="mb-2">
          <p className="text-lg font-medium">
            {temperature}°C / {celsiusToFahrenheit(temperature)}°F
          </p>
          <p className="text-blue-100 dark:text-slate-300 capitalize">
            {capitalize(description || condition || "")}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        <Stat
          icon="🌡️"
          label="Feels Like"
          value={`${feelsLike}°C / ${celsiusToFahrenheit(feelsLike)}°F`}
        />
        <Stat icon="💧" label="Humidity" value={`${humidity}%`} />
        <Stat icon="💨" label="Wind" value={formatWind(windSpeed)} />
        <Stat icon="🧭" label="Pressure" value={`${pressure} hPa`} />
        <Stat
          icon="👁️"
          label="Visibility"
          value={formatVisibility(visibility)}
        />
        <Stat icon="⛅" label="Condition" value={condition} />
      </div>
    </div>
  );
};

export default WeatherCard;
