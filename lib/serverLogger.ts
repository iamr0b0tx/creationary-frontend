import { createLogger, transports } from "winston";
import { format } from "logform";
import { inspect } from "util";

const logLevel = process.env.LOG_LEVEL || "silly";
const fileLog = process.env.LOG_TO_FILENAME || false;

let appFormat = format.json();

if (process.env.NODE_ENV === "development") {
  appFormat = format.combine(
    format.timestamp(),
    format.splat(),
    format.printf((info) => {
      // stringify the main message if it's an object
      const message =
        typeof info.message === "object"
          ? inspect(info.message, { depth: null, colors: false })
          : info.message;

      // handle additional splat arguments (extra objects/arrays passed to logger)
      const splat = info[Symbol.for("splat")] as unknown[] | undefined;
      const splatStr =
        Array.isArray(splat) && splat.length
          ? " " +
            splat
              .map((s) =>
                typeof s === "object" ? inspect(s, { depth: null, colors: false }) : String(s)
              )
              .join(" ")
          : "";

      return `${info.timestamp} ${info.level}: ${message}${splatStr}`;
    })
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
