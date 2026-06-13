import {
  iconUrl,
  capitalize,
  celsiusToFahrenheit,
  formatForecastDate,
} from "../utils/format";

// A single day's forecast tile.
const ForecastDay = ({ day }) => {
  const { weekday, date } = formatForecastDate(day.date);

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white dark:bg-slate-800 px-3 py-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform">
      <p className="font-semibold text-slate-700 dark:text-slate-200">
        {weekday}
      </p>
      <p className="text-xs text-slate-400">{date}</p>
      <img src={iconUrl(day.icon)} alt={day.condition} className="h-12 w-12" />
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
        {day.tempMax}° / {day.tempMin}°
      </p>
      <p className="text-[11px] text-slate-400">
        {celsiusToFahrenheit(day.tempMax)}°F
      </p>
      <p className="text-xs text-center text-slate-500 dark:text-slate-400 capitalize">
        {capitalize(day.description || day.condition || "")}
      </p>
    </div>
  );
};

/**
 * 5-day forecast row. Scrolls horizontally on small screens.
 */
const Forecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {forecast.map((day) => (
          <ForecastDay key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
