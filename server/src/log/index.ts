import { LogLevel, Logger } from "./log.interface";
import { ConsoleLogger } from "./Console";

let logger: Logger;
if (process.env.NODE_ENV === "production") {
  logger = new ConsoleLogger(LogLevel.Error | LogLevel.Info, {
    stream: process.stderr,
  });
} else {
  logger = new ConsoleLogger(LogLevel.All, {
    stream: process.stderr,
    withColor: true,
  });
}

export { logger };
