import { Logger, levelSatisfies, LogLevel } from "./log.interface";

/**
 * LogManager wraps any number of logging implementations.
 * It dispatch calls to each logger, provided the manager's level satisfies.
 * This allows for logging to process stderr while also sending errors to an
 * error tracking service like sentry.io--each managing their own internal
 * log levels, but governed by the LogManager's log level.
 */
export class LogManager implements Logger {
  loggers: Logger[] = [];

  constructor(protected level: number, ...loggers: Logger[]) {
    this.loggers.push(...loggers);
  }

  add(logger: Logger): this {
    this.loggers.push(logger);
    return this;
  }

  setLevel(level: number): this {
    this.level = level;
    return this;
  }

  fatal = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    for (let l of this.loggers) {
      l.fatal(...values);
    }
  };
  error = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    for (let l of this.loggers) {
      l.error(...values);
    }
  };
  warn = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    for (let l of this.loggers) {
      l.warn(...values);
    }
  };
  info = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    for (let l of this.loggers) {
      l.info(...values);
    }
  };
  debug = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    for (let l of this.loggers) {
      l.debug(...values);
    }
  };
}
