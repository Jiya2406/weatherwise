import { iconUrl } from "../utils/format";

// Format an ISO timestamp into a short local "MMM D, h:mm AM" string.
const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Recent search history list.
 * - history          -> array of saved searches
 * - onSelect(city)   -> re-run a search when an item is clicked
 * - onDelete(id)     -> delete a single item
 * - onClear()        -> clear all history
 */
const SearchHistory = ({ history, onSelect, onDelete, onClear }) => {
  if (!history || history.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white dark:bg-slate-800 p-6 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          Search History
        </h3>
        <p className="text-slate-400 text-sm">
          Your recent searches will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Search History
        </h3>
        <button
          onClick={onClear}
          className="text-sm font-medium text-red-500 hover:text-red-600"
        >
          Clear All
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {history.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-700/50 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <button
              onClick={() => onSelect(item.city)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              {item.icon && (
                <img
                  src={iconUrl(item.icon)}
                  alt={item.condition}
                  className="h-9 w-9"
                />
              )}
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {item.city}
                  {item.country ? `, ${item.country}` : ""}
                </p>
                <p className="text-xs text-slate-400">
                  {formatTime(item.createdAt)} · {item.condition}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {item.temperature}°C
              </span>
              <button
                onClick={() => onDelete(item._id)}
                title="Delete"
                className="text-slate-400 hover:text-red-500 text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
