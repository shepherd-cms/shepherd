import { LogLevel, Logger } from "./log.interface";
import { StreamLogger, NewLine } from "./StreamLogger";
import { LogManager } from "./Manager";

let manager = new LogManager(LogLevel.All);

switch (process.env.NODE_ENV) {
  case "production":
    manager.setLevel(
      LogLevel.Fatal | LogLevel.Error | LogLevel.Warn | LogLevel.Info
    );
    manager.add(
      new StreamLogger(LogLevel.Error | LogLevel.Warn | LogLevel.Info, {
        stream: process.stderr,
        newLine: NewLine.LF,
      })
    );
    break;

  default:
    manager.add(
      new StreamLogger(LogLevel.All, {
        stream: process.stderr,
        withColor: true,
        newLine: NewLine.LF,
      })
    );
    break;
}

export const logger: Logger = manager;
