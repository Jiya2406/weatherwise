# 🌦️ WeatherWise

A modern, full-stack **weather application** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Search any city, get your current location's weather, view a 5-day forecast, and keep track of your search history — all wrapped in a responsive UI with dark/light mode.

> Built as an internship / portfolio project.

---

## ✨ Features

- 🔍 **Search weather by city** with a live **autocomplete dropdown** (powered by the OpenWeatherMap Geocoding API)
- 📍 **Current location weather** via the browser Geolocation API
- 🌡️ **Detailed current conditions** — temperature (°C **and** °F), feels-like, weather condition + icon, humidity, wind speed, pressure, visibility, and local date/time
- 📅 **5-day forecast** with daily high/low and conditions
- 🕘 **Search history** — automatically saved to MongoDB; re-run, delete, or clear searches
- 🌙 **Dark / Light mode** toggle (remembers your choice, respects system preference)
- 📱 **Fully responsive** design with Tailwind CSS
- ⏳ **Loading spinner** while fetching and friendly **error messages** for invalid cities
- 🛡️ **Secure API key** handling via environment variables

---

## 🛠️ Tech Stack

| Layer        | Technologies                                            |
| ------------ | ------------------------------------------------------- |
| **Frontend** | React.js (Vite), Tailwind CSS, Axios, React Hooks       |
| **Backend**  | Node.js, Express.js, Axios                              |
| **Database** | MongoDB, Mongoose                                       |
| **API**      | OpenWeatherMap (Current Weather, 5-Day Forecast, Geocoding) |

---

## 📁 Project Structure

```
WeatherWise/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx        # search + autocomplete dropdown
│   │   │   ├── WeatherCard.jsx      # current weather details
│   │   │   ├── Forecast.jsx         # 5-day forecast
│   │   │   ├── SearchHistory.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx             # main page logic (state + effects)
│   │   ├── services/
│   │   │   └── weatherApi.js        # axios API layer
│   │   ├── context/
│   │   │   └── ThemeContext.jsx     # dark/light mode
│   │   ├── utils/
│   │   │   └── format.js            # temp/date/unit formatters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                    # VITE_API_URL
│   └── tailwind.config.js
│
└── server/                     # Express backend
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── controllers/
    │   ├── weatherController.js
    │   └── historyController.js
    ├── routes/
    │   ├── weatherRoutes.js
    │   └── historyRoutes.js
    ├── services/
    │   └── weatherService.js   # OpenWeatherMap integration
    ├── models/
    │   └── SearchHistory.js    # Mongoose schema
    ├── middleware/
    │   └── errorHandler.js     # 404 + centralized errors
    ├── .env                    # PORT, MONGO_URI, OPENWEATHER_API_KEY
    └── app.js                  # entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas connection string)
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd WeatherWise
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/weatherwise
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev      # development (nodemon, auto-reload)
# or
npm start        # production
```

The API runs at **http://localhost:5000**.

### 3. Frontend setup

In a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in `client/` (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

> ⚠️ A brand-new OpenWeatherMap API key can take **up to 1–2 hours** to activate. Until then, weather requests return a 401 error.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Weather

| Method | Endpoint                                   | Description                          |
| ------ | ------------------------------------------ | ------------------------------------ |
| GET    | `/weather/current?city=London`             | Current weather by city              |
| GET    | `/weather/current?lat=51.5&lon=-0.12`      | Current weather by coordinates       |
| GET    | `/weather/forecast?city=London`            | 5-day forecast by city               |
| GET    | `/weather/forecast?lat=51.5&lon=-0.12`     | 5-day forecast by coordinates        |
| GET    | `/weather/search?q=lon`                    | City autocomplete suggestions        |

### Search History

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| GET    | `/history`      | Recent searches (newest first)    |
| DELETE | `/history/:id`  | Delete a single history entry     |
| DELETE | `/history`      | Clear all history                 |

**Example response** (`GET /weather/current?city=London`):

```json
{
  "success": true,
  "data": {
    "city": "London",
    "country": "GB",
    "temperature": 21,
    "feelsLike": 20,
    "condition": "Clouds",
    "description": "broken clouds",
    "icon": "04d",
    "humidity": 47,
    "pressure": 1021,
    "windSpeed": 3.13,
    "visibility": 10000,
    "timezone": 3600,
    "dateTime": 1781357526
  }
}
```

---

## 🔒 Security Notes

- The OpenWeatherMap API key is stored **only** in `server/.env` and never exposed to the frontend.
- `.env` files are git-ignored.
- The frontend talks only to the backend, which proxies all OpenWeatherMap calls.

---

## 📜 License

This project is open source and available for educational/portfolio use.

---

## 🙌 Acknowledgements

- Weather data from [OpenWeatherMap](https://openweathermap.org/)
- Icons via OpenWeatherMap icon set & emoji
