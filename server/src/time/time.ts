/**
 * A duration is just a time unit in milliseconds.
 */
export const enum Duration {
  Millisecond = 1,
  Microsecond = Duration.Millisecond / 1000,
  Second = Duration.Millisecond * 1000,
  Minute = Duration.Second * 60,
  Hour = Duration.Minute * 60,
  Day = Duration.Hour * 24,
  Week = Duration.Day * 7,
}

function createConverter(targetTimeUnit: number): (duration: number) => number {
  return (duration) => duration / targetTimeUnit;
}

/**
 * A collection of unit converters for a Duration.
 */
export const durationTo = {
  microsecond: createConverter(Duration.Microsecond),
  millisecond: createConverter(Duration.Millisecond),
  second: createConverter(Duration.Second),
  minute: createConverter(Duration.Minute),
  hour: createConverter(Duration.Hour),
  day: createConverter(Duration.Day),
  week: createConverter(Duration.Week),
  /* Years no implemented because of leap years */
};

export function stringify(duration: number): string {
  switch (true) {
    default:
      return `${durationTo.week(duration).toFixed(2)}wk`;
    case duration < Duration.Millisecond:
      return `${durationTo.microsecond(duration).toFixed(2)}µs`;
    case duration < Duration.Second:
      return `${duration.toFixed(2)}ms`;
    case duration < Duration.Minute:
      return `${durationTo.second(duration).toFixed(2)}sec`;
    case duration < Duration.Hour:
      return `${durationTo.minute(duration).toFixed(2)}min`;
    case duration < Duration.Day:
      return `${durationTo.hour(duration).toFixed(2)}hr`;
    case duration < Duration.Week:
      return `${durationTo.day(duration).toFixed(2)}day`;
  }
}

/**
 * Resolves the given Promise, but throws a TimeoutError if the timeout is
 * reached before the Promise is resolved. Uses the optional message for the
 * error, or else a default message.
 *
 * @param {*} p The promise to resolve
 * @param {*} duration Time in milliseconds
 * @param {*} message Optional message for the TimeoutError
 */
export function resolveWithTimeout<T>(
  p: Promise<T>,
  duration: number,
  message?: string
): Promise<T> {
  return Promise.race([
    p,
    timeAfter(duration).then(() => {
      throw new RangeError(message || `timeout exceeded (${duration}ms)`);
    }),
  ]);
}

/**
 * Like a `sleep` function in some languages,
 * `timeAfter` returns a promise that resolves once the given
 * duration has passed. Uses `setTimeout` internally.
 */
export function timeAfter(duration: number): Promise<void> {
  return new Promise((r) => setTimeout(r, duration));
}

interface SemanticEpoch {
  matches(unixMs: number, now?: Date): boolean;
  label: string;
}

export const Today: SemanticEpoch = {
  label: "Today",
  matches(unix, now = new Date()) {
    let elapsed = 0;
    elapsed += Duration.Millisecond * now.getMilliseconds();
    elapsed += Duration.Second * now.getSeconds();
    elapsed += Duration.Minute * now.getMinutes();
    elapsed += Duration.Hour * now.getHours();

    return unix >= now.getTime() - elapsed;
  },
};

export const Yesterday: SemanticEpoch = {
  label: "Yesterday",
  matches(unix, now = new Date()) {
    let elapsed = 0;
    elapsed += Duration.Millisecond * now.getMilliseconds();
    elapsed += Duration.Second * now.getSeconds();
    elapsed += Duration.Minute * now.getMinutes();
    elapsed += Duration.Hour * now.getHours();
    // Ensure not today
    if (unix >= now.getTime() - elapsed) {
      return false;
    }

    elapsed += Duration.Day;

    return unix >= now.getTime() - elapsed;
  },
};

export const ThisWeek: SemanticEpoch = {
  label: "This Week",
  matches(unix, now = new Date()) {
    let elapsed = 0;
    elapsed += Duration.Millisecond * now.getMilliseconds();
    elapsed += Duration.Second * now.getSeconds();
    elapsed += Duration.Minute * now.getMinutes();
    elapsed += Duration.Hour * now.getHours();
    elapsed += Duration.Day * now.getDay();

    return unix >= now.getTime() - elapsed;
  },
};

export const ThisMonth: SemanticEpoch = {
  label: "This Month",
  matches(unix, now = new Date()) {
    let elapsed = 0;
    elapsed += Duration.Millisecond * now.getMilliseconds();
    elapsed += Duration.Second * now.getSeconds();
    elapsed += Duration.Minute * now.getMinutes();
    elapsed += Duration.Hour * now.getHours();
    elapsed += Duration.Day * now.getDate() - 1;

    return unix >= now.getTime() - elapsed;
  },
};

export const Older: SemanticEpoch = {
  label: "Older",
  matches(unix, now = new Date()) {
    return unix > now.getTime();
  },
};

export const Epochs = {
  [Today.label]: Today,
  [Yesterday.label]: Yesterday,
  [ThisWeek.label]: ThisWeek,
  [ThisMonth.label]: ThisMonth,
  [Older.label]: Older,
};

export function whichEpoch(unixMs: number, now: Date = new Date()): string {
  switch (true) {
    default:
      return Older.label;
    case unixMs > now.getTime():
      throw new RangeError("cannot match SemanticEpoch from the future");
    case Today.matches(unixMs, now):
      return Today.label;
    case Yesterday.matches(unixMs, now):
      return Yesterday.label;
    case ThisWeek.matches(unixMs, now):
      return ThisWeek.label;
    case ThisMonth.matches(unixMs, now):
      return ThisMonth.label;
  }
}
