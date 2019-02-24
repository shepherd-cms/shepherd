import { LogLevel, Logger } from "./log.interface";
import { ConsoleLogger } from "./Console";

let logger: Logger = new ConsoleLogger(LogLevel.All);
if (process.env.NODE_ENV === "production") {
  logger = new ConsoleLogger(LogLevel.Error);
}

export { logger };
