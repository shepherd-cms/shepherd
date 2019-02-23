export interface Logger {
  fatal(...values: any[]): void;
  error(...values: any[]): void;
  warn(...values: any[]): void;
  info(...values: any[]): void;
  debug(...values: any[]): void;
  trace(...values: any[]): void;
}

export const enum LogLevel {
  None = 0,
  Fatal = 1 << 0,
  Error = 1 << 1,
  Warn = 1 << 2,
  Info = 1 << 3,
  Debug = 1 << 4,
  Trace = 1 << 5,

  All = LogLevel.Fatal |
    LogLevel.Error |
    LogLevel.Warn |
    LogLevel.Info |
    LogLevel.Debug |
    LogLevel.Trace,
}

export function levelSatisfies(level: number, target: number): boolean {
  return (level & target) === target;
}
