import { ERROR_STATUS } from "../constant.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  switch (statusCode) {
    case ERROR_STATUS.VALIDATION_ERROR:
      res.json({
        title: "Validation Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ERROR_STATUS.UNAUTHORISED:
      res.json({
        title: "Unauthorised Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ERROR_STATUS.FORBIDDEN:
      res.json({
        title: "Forbidden Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ERROR_STATUS.NOT_FOUND:
      res.json({
        title: "Resource Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case ERROR_STATUS.SERVER_ERROR:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      res.json({
        title: "Unknown Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
};