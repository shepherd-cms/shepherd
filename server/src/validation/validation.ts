export function isString(x: any): x is string {
  return typeof x == "string";
}

export function isNotString<T>(x: T): x is Exclude<T, string> {
  return !isString(x);
}

export function isNumber(x: any): x is number {
  return typeof x == "number";
}

export function isNotNumber<T>(x: T): x is Exclude<T, number> {
  return !isNumber(x);
}

export function isObject(x: any): x is object {
  return typeof x == "object";
}

export function isNotObject<T>(x: T): x is Exclude<T, object> {
  return !isObject(x);
}

export function isBoolean(x: any): x is boolean {
  return typeof x == "boolean";
}

export function isNotBoolean<T>(x: T): x is Exclude<T, boolean> {
  return !isBoolean(x);
}

export function isFunction(x: any): x is Function {
  return typeof x == "function";
}

export function isNotFunction<T>(x: T): x is Exclude<T, Function> {
  return !isFunction(x);
}

export function isSymbol(x: any): x is Symbol {
  return typeof x == "symbol";
}

export function isNotSymbol<T>(x: T): x is Exclude<T, Symbol> {
  return !isSymbol(x);
}

export function isUndefined(x: any): x is undefined {
  return typeof x == "undefined";
}

export function isNotUndefined<T>(x: T): x is Exclude<T, undefined> {
  return !isUndefined(x);
}
