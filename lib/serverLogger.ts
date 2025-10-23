import { createLogger, transports } from "winston";
import { format } from "logform";

const logLevel = process.env.LOG_LEVEL || "silly";
const fileLog = process.env.LOG_TO_FILENAME || false;

type TLogger =
  | ReturnType<typeof createLogger>
  | {
      info: (message: string, ...args: unknown[]) => void;
      error: (message: string, ...args: unknown[]) => void;
      warn: (message: string, ...args: unknown[]) => void;
      debug: (message: string, ...args: unknown[]) => void;
    };

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
