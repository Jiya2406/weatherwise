/**
 * Catches unknown routes and forwards a 404 to the error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Centralized error handler. Any error passed to next(err) lands here and is
 * returned to the client in a consistent JSON shape.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};

module.exports = { notFound, errorHandler };
