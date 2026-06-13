import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navbar />
      <Home />
      <footer className="text-center text-sm text-slate-400 dark:text-slate-500 py-6">
        Built with the MERN stack · Data from OpenWeatherMap
      </footer>
    </div>
  );
}

export default App;
