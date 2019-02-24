import { LogLevel, Logger } from "./log.interface";
import { ConsoleLogger, NewLine } from "./Console";

/**
 * Application logging. Base logging should write to stderr, while our request
 * logging uses stdout.
 *
 * We may implement a log manager to wrap multiple loggers and dispatch calls to
 * each individually. This will let us do something like write to our process
 * stderr while also sending errors to an error tracking service like sentry.io.
 */

let logger: Logger;
if (process.env.NODE_ENV === "production") {
  logger = new ConsoleLogger(LogLevel.Error | LogLevel.Info, {
    stream: process.stderr,
    newLine: NewLine.LF,
  });
} else {
  logger = new ConsoleLogger(LogLevel.All, {
    stream: process.stderr,
    withColor: true,
    newLine: NewLine.LF,
  });
}

export { logger };
