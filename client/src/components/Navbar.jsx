import { useTheme } from "../context/ThemeContext";

// Top navigation bar: brand logo + dark/light mode toggle.
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌦️</span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Weather<span className="text-blue-600 dark:text-blue-400">Wise</span>
          </h1>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex items-center gap-2 rounded-full px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium shadow-sm"
        >
          {theme === "dark" ? (
            <>
              <span className="text-lg">☀️</span>
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <span className="text-lg">🌙</span>
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
