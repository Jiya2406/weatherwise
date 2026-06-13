// Friendly error banner for invalid cities, network issues, etc.
const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-red-50 border border-red-200 px-6 py-5 text-center shadow-sm dark:bg-red-950/40 dark:border-red-900 animate-fade-in">
      <div className="text-4xl mb-2">⚠️</div>
      <p className="text-red-700 dark:text-red-300 font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;
