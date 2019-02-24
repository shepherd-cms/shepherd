export class WrappedError<T = any> extends Error {
  previous: T | null = null;

  constructor(message: string, previous?: T) {
    super(message);
    // We update the error's name to distinguish it from the base Error.
    this.name = this.constructor.name;
    // We add our reference to the original error value (if provided).
    if (previous !== undefined) {
      this.previous = previous;
    }
  }

  get root(): WrappedError<null> | T {
    // Base case, no child === this instance is root
    if (this.previous == null) {
      return this as any;
    }
    // When the child is another node, compute recursively
    if (this.previous instanceof WrappedError) {
      return this.previous.root;
    }
    // This instance wraps the original error
    return this.previous;
  }

  get spans(): string[] {
    let spans = [];
    let err: any = this;

    while (err instanceof WrappedError) {
      spans.push(err.message);
      err = err.previous;
    }

    if (err == null) {
      return spans;
    }

    if (err instanceof Error) {
      spans.push(err.message);
    } else {
      spans.push(String(err));
    }

    return spans;
  }

  static mapWrap(message: string) {
    return function mapErrorToWrappedError(error: any): WrappedError<any> {
      return new WrappedError(message, error);
    };
  }
}
