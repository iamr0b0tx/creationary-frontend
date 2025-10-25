type envType = "development" | "production";

class Logger {
  readonly log!: (message: string, ...optionalParams: unknown[]) => void;
  readonly info!: (message: string, ...optionalParams: unknown[]) => void;
  readonly warn!: (message: string, ...optionalParams: unknown[]) => void;
  readonly error!: (message: string, ...optionalParams: unknown[]) => void;

  constructor(envType: envType = "development") {
    const date = new Date();
    switch (envType) {
      case "production":
        this.log = () => {};
        this.info = () => {};
        this.warn = () => {};
        this.error = () => {};
        break;
      case "development":
        this.log = console.log.bind(console, [date.toISOString().split("T")[1], "LOG"].join(" "));
        this.info = console.info.bind(
          console,
          [date.toISOString().split("T")[1], "INFO"].join(" ")
        );
        this.warn = console.warn.bind(
          console,
          [date.toISOString().split("T")[1], "WARN"].join(" ")
        );
        this.error = console.error.bind(
          console,
          [date.toISOString().split("T")[1], "ERROR"].join(" ")
        );
        break;
    }
  }
}
export const logger = new Logger(process.env.NODE_ENV as envType);
