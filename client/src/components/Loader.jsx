// Animated loading spinner shown while weather data is being fetched.
const Loader = ({ message = "Fetching weather..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin dark:border-slate-700 dark:border-t-blue-400" />
      <p className="text-slate-600 dark:text-slate-300 font-medium">
        {message}
      </p>
    </div>
  );
};

export default Loader;
