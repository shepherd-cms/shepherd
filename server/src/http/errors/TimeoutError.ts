import * as time from "../../time/time";

export interface TimeoutParams {
  message: string;
  /**
   * Timeout in milliseconds.
   */
  timeout: number;
}

export class TimeoutError extends Error {
  timeout: number;

  constructor({ message, timeout }: TimeoutParams) {
    super(`${message}: ${time.stringify(timeout)}`);
    this.name = this.constructor.name;
    this.timeout = timeout;
  }
}
