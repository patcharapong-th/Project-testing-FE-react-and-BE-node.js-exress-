const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      statusCode = 400;
      break;
    case constants.NOT_FOUND:
      statusCode = 404;
      break;
    case constants.UNAUTHORIZED:
      statusCode = 401;
      break;
    case constants.FORBIDDEN:
      statusCode = 403;
      break;
    case constants.SERVER_ERROR:
      statusCode = 500;
      break;
    default:
      statusCode = 500;
      break;
  }

  const response = {
    title: err.title || "Error",
    message: err.message,
    stackTrace: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    resource: req.baseUrl.split("/").pop(),
    method: req.method,
    url: req.originalUrl,
  };

  res.status(statusCode).json(response);

  console.error(
    `[${new Date().toISOString()}] ERROR ${statusCode} - ${req.method} ${
      req.originalUrl
    }`
  );
  console.error(err);
};

module.exports = errorHandler;
