import { Result } from "safe-types";

export function parseIntStrict(numLike: string): Result<number, string> {
  let n = parseInt(numLike, 10);
  if (Number.isNaN(n)) {
    return Result.Err(`NaN: ${numLike}`);
  }

  return Result.Ok(n);
}

export function padZero(n: number, padLength = 2): string {
  return n.toString().padStart(padLength, "0");
}
