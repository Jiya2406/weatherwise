# CLAUDE.md

Guidance for working in the **WeatherWise** repository.

## Overview

WeatherWise is a full-stack MERN weather app. The React client talks **only** to the
Express server; the server is the sole caller of the OpenWeatherMap API (so the API
key is never exposed to the browser).

```
Browser (React/Vite)  ──HTTP──►  Express API  ──HTTP──►  OpenWeatherMap
                                      │
                                      └──►  MongoDB (search history)
```

## Commands

### Backend (`server/`)
```bash
npm run dev      # nodemon, auto-reload on changes
npm start        # node app.js
```

### Frontend (`client/`)
```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

> On Windows PowerShell, `Start-Process node app.js` works, but `Start-Process npm`
> does not (npm is a `.cmd`). Run npm scripts through a shell / the Bash tool instead.

## Architecture & Conventions

### Backend (layered: routes → controllers → services)
- **`app.js`** — entry point. Loads env, connects DB, mounts CORS + JSON middleware,
  mounts routes, then `notFound` + `errorHandler` last.
- **`config/db.js`** — Mongoose connection. **Non-blocking**: if Mongo is down the
  server still serves weather; only history is affected.
- **`services/weatherService.js`** — the ONLY place that calls OpenWeatherMap. It
  fetches with `units=metric` and **normalizes** responses into clean shapes
  (`normalizeCurrent`, `normalizeForecast`). Errors are converted via `toApiError`
  into `Error` objects carrying a `.status` field.
- **`controllers/`** — thin. Read query params, call a service, return
  `{ success, data }`, and pass errors to `next(error)`.
- **`middleware/errorHandler.js`** — single place that shapes error responses as
  `{ success: false, message }` using `err.status` (default 500).
- **History auto-save**: `weatherController.getCurrentWeather` calls
  `saveSearch(data)` (from `historyController`) after a successful lookup. This is
  fire-and-forget — it must never throw or block the weather response.

### Frontend
- **`services/weatherApi.js`** — single axios instance (`baseURL = VITE_API_URL`).
  Every call unwraps `data.data` and rethrows a clean `Error(message)`.
  `searchCities` is the exception: it fails **quietly** (returns `[]`) so typing in
  the search box is never interrupted.
- **`pages/Home.jsx`** — owns all state (`weather`, `forecast`, `history`, `loading`,
  `error`) and the handlers. Key helper: `handleSearchCoords(lat, lon)` is shared by
  both geolocation and autocomplete-suggestion selection.
- **`components/`** — presentational; receive data + callbacks via props.
- **`context/ThemeContext.jsx`** — dark/light mode. Toggles a `dark` class on
  `<html>`; persisted to `localStorage` under `weatherwise-theme`.
- **`utils/format.js`** — all formatting (°C→°F, icon URLs, date/time using the
  city's timezone offset, wind m/s→km/h, visibility m→km). Put new formatting here.

### Styling
- Tailwind CSS v3, `darkMode: "class"`. Dark variants use `dark:` prefixes.
- Responsive via Tailwind breakpoints (`sm:`, `md:`). Mobile-first.

## Data Shapes

**Normalized current weather** (from `weatherService.normalizeCurrent`):
`city, country, coordinates{lat,lon}, temperature, feelsLike, tempMin, tempMax,
condition, description, icon, humidity, pressure, windSpeed, visibility, sunrise,
sunset, timezone, dateTime`

**Forecast day** (`normalizeForecast`, 5 entries): `date, dateTime, tempMin, tempMax,
temp, condition, description, icon, humidity, windSpeed`. The 3-hourly OWM feed is
grouped by day and the midday (12:00) reading is used as the day's representative.

**SearchHistory model**: `city, country, temperature, condition, icon, searchedAt`
+ timestamps. `GET /api/history` returns newest-first, capped at 20.

## Environment Variables

`server/.env`: `PORT`, `MONGO_URI`, `OPENWEATHER_API_KEY`, `OPENWEATHER_BASE_URL`,
`CLIENT_URL`
`client/.env`: `VITE_API_URL`

Both `.env` files are git-ignored; `.env.example` files document the shape.

## Gotchas

- **API key activation**: a new OpenWeatherMap key returns **401** for up to 1–2
  hours after creation. This is expected, not a bug.
- **Temperatures are metric** end-to-end; Fahrenheit is derived on the client only.
- **Timezone**: `dateTime` is a UTC unix timestamp; `timezone` is the city's offset
  in seconds. `formatCityDateTime` shifts and renders as UTC to show local city time.
- **Don't add OpenWeatherMap calls in the controller or client** — they belong in
  `weatherService.js` so error handling and the secret stay in one place.

## What's Implemented

Search by city (with autocomplete), current-location weather, 5-day forecast, search
history (save/list/delete/clear), dark/light mode, responsive UI, loading states, and
centralized API error handling.
