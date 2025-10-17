type envType = "development" | "production";

class Logger {
  readonly log!: (message: string, ...optionalParams: unknown[]) => void;
  readonly info!: (message: string, ...optionalParams: unknown[]) => void;
  readonly warn!: (message: string, ...optionalParams: unknown[]) => void;
  readonly error!: (message: string, ...optionalParams: unknown[]) => void;

  constructor(envType: envType = "development") {
    switch (envType) {
      case "production":
        this.log = () => {};
        this.info = () => {};
        this.warn = () => {};
        this.error = () => {};
        break;
      case "development":
        this.log = console.log.bind(console);
        this.info = console.info.bind(console);
        this.warn = console.warn.bind(console);
        this.error = console.error.bind(console);
        break;
    }
  }
}
export const logger = new Logger(process.env.NODE_ENV as envType);
