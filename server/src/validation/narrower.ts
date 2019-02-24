import { Option, Result } from "safe-types";
import { isString, isNumber, isBoolean } from "./guards";

/**
 * A `TypeNarrower` takes any value, and returns a result with the
 * type narrowed & asserted on success, or type error string on failure.
 */
export type TypeNarrower<Type> = (x: any) => Result<Type, string>;

/**
 * Converts any value to a non-nullable optional value.
 */
const from = Option.from;

/**
 * Narrow any type to a `string`.
 */
export const asString: TypeNarrower<string> = (x) =>
  from(x)
    .narrow(isString)
    .match({
      None: () => Result.Err(`value is not of type 'string'`),
      Some: Result.Ok,
    });

/**
 * A loose type narrower that **does not** check for `NaN` cases.
 */
export const asAnyNumber: TypeNarrower<number> = (x) =>
  from(x)
    .narrow(isNumber)
    .match({
      None: () => Result.Err(`value is not of type 'number'`),
      Some: Result.Ok,
    });

/**
 * A strict type narrower that fails on `NaN` values.
 */
export const asNumber: TypeNarrower<number> = (x) =>
  asAnyNumber(x).and_then((x) => {
    if (Number.isNaN(x)) {
      return Result.Err(`number is NaN`);
    }

    return Result.Ok(x);
  });

/**
 * Narrow any type to a `number` that is an integer.
 */
export const asInt: TypeNarrower<number> = (x) =>
  asNumber(x).and_then((n) => {
    if (!Number.isInteger(n)) {
      return Result.Err(`value is not an integer`);
    }

    return Result.Ok(n);
  });

/**
 * Narrow any type to a `boolean`.
 */
export const asBool: TypeNarrower<boolean> = (x) =>
  from(x)
    .narrow(isBoolean)
    .match({
      None: () => Result.Err(`value is not of type 'boolean'`),
      Some: Result.Ok,
    });

/**
 * Narrow any type to a `Array<any>`.
 */
export const asArray: TypeNarrower<any[]> = (x) =>
  from(x)
    .narrow(Array.isArray)
    .match({
      None: () => Result.Err(`value is not an Array`),
      Some: Result.Ok,
    });

/**
 * Narrow any type to an instance of a custom class/constructor.
 */
export const asInstanceOf: <Constructor extends new (...args: any[]) => any>(
  ctor: Constructor
) => TypeNarrower<InstanceType<Constructor>> = (ctor) => (x) =>
  from(x)
    .filter((x) => x instanceof ctor)
    .match({
      None: () => Result.Err(`value is not an instance of ${ctor.name}`),
      Some: Result.Ok,
    });

export function expectNever(_: never, message = `Invariant violation`): never {
  throw new TypeError(message);
}
