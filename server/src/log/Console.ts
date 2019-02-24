import { LogLevel, Logger, levelSatisfies } from "./log.interface";

const padZero = (n: number) => n.toString().padStart(2, "0");

/**
 * ConsoleLogger is an implementation of the Logger interface that just
 * delegates to various `console` methods. It uses methods as arrow function
 * properties so that all callers need not concern themselves with gotchas
 * around managing context for `this`.
 */
export class ConsoleLogger implements Logger {
  constructor(private level: number) {}

  private prefix(name: string): string {
    let d = new Date();

    let YYYY = d.getFullYear();
    let MM = padZero(d.getMonth() + 1);
    let DD = padZero(d.getDate());

    let hh = padZero(d.getHours());
    let mm = padZero(d.getMinutes());
    let ss = padZero(d.getSeconds());

    return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss} [${name}]`;
  }

  fatal = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Fatal)) {
      return;
    }
    console.error(this.prefix("fatal"), ...values);
  };

  error = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Error)) {
      return;
    }
    console.error(this.prefix("error"), ...values);
  };

  warn = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Warn)) {
      return;
    }
    console.warn(this.prefix("warn"), ...values);
  };

  info = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Info)) {
      return;
    }
    console.info(this.prefix("info"), ...values);
  };

  debug = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Debug)) {
      return;
    }
    console.debug(this.prefix("debug"), ...values);
  };

  trace = (...values: any[]) => {
    if (!levelSatisfies(this.level, LogLevel.Trace)) {
      return;
    }
    console.trace(this.prefix("trace"), ...values);
  };
}
