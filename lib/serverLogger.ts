import { createLogger, transports } from "winston";
import { format } from "logform";

const logLevel = process.env.LOG_LEVEL || "silly";
const fileLog = process.env.LOG_TO_FILENAME || false;


let appFormat = format.json();

if (process.env.NODE_ENV === "development") {
  appFormat = format.combine(
    format.timestamp(),
    format.splat(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  );
}

const appTransports = [];
appTransports.push(new transports.Console());

if (fileLog) appTransports.push(new transports.File({ filename: fileLog }));

const logger = createLogger({
  level: logLevel,
  format: appFormat,
  transports: appTransports,
});

export default logger;
