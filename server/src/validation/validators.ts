import { Result } from "safe-types";

/**
 * A validator is a function that accepts a value of a known type,
 * and asserts conditions on that value returning an `Ok<Type>` on success,
 * or an `Err<string>` on failure.
 */
export type Validator<Type> = (x: Type) => Result<Type, string>;

/**
 * Validates that a string contains no characters that require URL encoding.
 */
export const asURLSafe: Validator<string> = (s) => {
  if (encodeURIComponent(s) !== s) {
    return Result.Err(`text contains invalid characters: '${s}'`);
  }

  return Result.Ok(s);
};

/**
 * Validates that a string is trimmed of whitespace.
 */
export const asTrimmed: Validator<string> = (s) => {
  if (s.trim() !== s) {
    return Result.Err(`text contains untrimmed whitespace: '${s}'`);
  }

  return Result.Ok(s);
};

/**
 * Validates that a string is lower-cased.
 */
export const asLowerCased: Validator<string> = (s) => {
  if (s.toLowerCase() !== s) {
    return Result.Err(`text is not lowercase: '${s}'`);
  }

  return Result.Ok(s);
};

/**
 * Validates that a string contains only hexadecimal characters.
 * Case insensitive.
 */
export const asHex: Validator<string> = (s) => {
  for (let i = 0, len = s.length, code: number; i < len; i++) {
    code = s.charCodeAt(i);
    // 0-9 are code points 48-57
    // A-F are code points 65-70
    // a-f are code points 97-102
    if (
      (code < 48 || code > 57) &&
      (code < 65 || code > 70) &&
      (code < 97 || code > 102)
    ) {
      return Result.Err(`text contains invalid hexadecimal characters: '${s}'`);
    }
  }

  return Result.Ok(s);
};

/**
 * Validates that a string contains only hexadecimal characters.
 * Case sensitive.
 */
export const asHexLowerCased: Validator<string> = (s) => {
  return asHex(s).and_then(asLowerCased);
};

/**
 * Validates that a string contains no non-printable characters.
 * Non-printable characters are those in ASCII range 0-31.
 */
export const asPrintableChars: Validator<string> = (s) => {
  // Non-printable chars are code points 0-31
  for (let i = 0, len = s.length; i < len; i++) {
    if (s.charCodeAt(i) <= 31) {
      return Result.Err(`text contains non-printable characters: '${s}'`);
    }
  }

  return Result.Ok(s);
};

/**
 * Validates that a string contains only digit characters 0-9.
 */
export const asDigit: Validator<string> = (s) => {
  for (let i = 0, len = s.length; i < len; i++) {
    // 0-9 are code points 48-57
    if (s.charCodeAt(i) < 48 || s.charCodeAt(i) > 57) {
      return Result.Err(`text contains non-numeric characters: '${s}'`);
    }
  }

  return Result.Ok(s);
};

/**
 * Validates that a number is not greater than the maximum.
 */
export const withMax: (max: number) => Validator<number> = (max) => (x) => {
  if (x > max) {
    return Result.Err(`the value cannot exceed ${max}`);
  }

  return Result.Ok(x);
};

/**
 * Validates that a number is not less than the minimum.
 */
export const withMin: (min: number) => Validator<number> = (min) => (x) => {
  if (x < min) {
    return Result.Err(`the value cannot be less than ${min}`);
  }

  return Result.Ok(x);
};

/**
 * Validates that a number is between the maximum and minimum (inclusive).
 */
export const betweenRange: (min: number, max: number) => Validator<number> = (
  min,
  max
) => (x) =>
  Result.Ok(x)
    .and_then(withMin(min))
    .and_then(withMax(max));

/**
 * Validates that the length property is of a given size.
 */
export const withLength: <T>(length: number) => Validator<ArrayLike<T>> = (
  len
) => (x) => {
  if (x.length !== len) {
    return Result.Err(`the length must be ${len}: found ${x.length}`);
  }

  return Result.Ok(x);
};

/**
 * Validates that the length property is not less than the minimum.
 */
export const withMinLength: <T>(min: number) => Validator<ArrayLike<T>> = (
  min
) => (x) => {
  if (x.length < min) {
    return Result.Err(`the length must be at least ${min}: found ${x.length}`);
  }

  return Result.Ok(x);
};

/**
 * Validates that the length property is not greater than the maximum.
 */
export const withMaxLength: <T>(max: number) => Validator<ArrayLike<T>> = (
  max
) => (x) => {
  if (x.length > max) {
    return Result.Err(`the length cannot exceed ${max}: found ${x.length}`);
  }

  return Result.Ok(x);
};

/**
 * Validates that the length property
 * is between the maximum and minimum (inclusive).
 */
export const withLengthBetweenRange: <T>(
  min: number,
  max: number
) => Validator<ArrayLike<T>> = (min, max) => (x) => {
  if (x.length < min || x.length > max) {
    return Result.Err(
      `the length must be between ${min}-${max}: found ${x.length}`
    );
  }

  return Result.Ok(x);
};

/**
 * Validates that the byte length is of a given size.
 */
export const withByteLength: (length: number) => Validator<string> = (len) => (
  s
) => {
  let byteLength = Buffer.from(s, "utf8").byteLength;

  if (byteLength !== len) {
    return Result.Err(`the byte length must be ${len}: found ${byteLength}`);
  }

  return Result.Ok(s);
};

/**
 * Validates that the byte length is not less than the minimum.
 */
export const withMinByteLength: (min: number) => Validator<string> = (min) => (
  s
) => {
  let byteLength = Buffer.from(s, "utf8").byteLength;

  if (byteLength < min) {
    return Result.Err(
      `the byte length must be at least ${min}: found ${byteLength}`
    );
  }

  return Result.Ok(s);
};

/**
 * Validates that the byte length is not greater than the maximum.
 */
export const withMaxByteLength: (max: number) => Validator<string> = (max) => (
  s
) => {
  let byteLength = Buffer.from(s, "utf8").byteLength;

  if (byteLength > max) {
    return Result.Err(
      `the byte length cannot exceed ${max}: found ${byteLength}`
    );
  }

  return Result.Ok(s);
};

/**
 * Validates that the byte length is between the maximum and minimum (inclusive).
 */
export const withByteLengthBetweenRange: (
  min: number,
  max: number
) => Validator<string> = (min, max) => (s) => {
  // Implemented without composition to avoid allocating two buffers.
  let byteLength = Buffer.from(s, "utf8").byteLength;

  if (byteLength < min || byteLength > max) {
    return Result.Err(
      `the byte length must be between ${min}-${max}: found ${byteLength}`
    );
  }

  return Result.Ok(s);
};

/**
 * Validates that an item is in a given Set.
 */
export const oneOfSet: <T>(set: Set<T>, msg?: string) => Validator<T> = (
  set,
  msg = `the given value is not one of the expected set of values`
) => (x) => {
  if (!set.has(x)) {
    return Result.Err(msg);
  }

  return Result.Ok(x);
};
