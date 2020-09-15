import { createLogger, format, transports } from 'winston';

let logger;

// This is the main app logger.
export function spawnLogger() {
  // If logger already exists return the existing logger.
  if (logger) {
    return logger;
  }

  const {
    colorize, combine, padLevels, printf, timestamp
  } = format;

  // Add a custom format to the logger.
  const logFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`);

  // Create the logger.
  logger = createLogger({
    transports: [
      new transports.Console({
        format: combine(colorize(), timestamp(), padLevels(), logFormat)
      })
    ]
  });

  return logger;
}

// Custom express logging middleware. Logs some request/response info.
export const loggerMiddleware = function (req, res, next) {
  const { end } = res;

  res.end = function (chunk, encoding) {
    let message = '';

    // Get the IP of the actual user (if it exists) not just the frontend server address.
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    message = message.concat(`Remote IP: ${ip} | HTTP Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode}`);

    spawnLogger().info(message);
    res.end = end;
    res.end(chunk, encoding);
  };

  next();
};
