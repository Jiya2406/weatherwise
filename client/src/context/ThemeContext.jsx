import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Decide the initial theme: saved preference -> system preference -> light.
const getInitialTheme = () => {
  const saved = localStorage.getItem("weatherwise-theme");
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme to <html> and persist it whenever it changes.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("weatherwise-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Convenience hook for consuming the theme.
export const useTheme = () => useContext(ThemeContext);
