import { Task, Result } from "safe-types";
import * as bcrypt from "bcrypt";
import { Secret } from "./Secret";
import { expectNever } from "../validation/narrower";
import * as V from "../validation/validators";
import { logger } from "../log";
import { WrappedError } from "../errors/WrappedError";

export enum ScrubMode {
  // export const enum ScrubMode {
  /**
   * For all cases where we don't explicitly need one mode,
   * use the application's default scrubbing mode.
   */
  Default,
  /**
   * Remove the password entirely, and leave nothing in its place.
   */
  Delete,
  /**
   * Replace the password with a masked version.
   */
  Mask,
}

export class Password extends Secret<string> {
  label = "Password";

  hashTask() {
    return Password.hash(this.value).tap_err(logger.error);
  }

  /**
   * Hashes the password,
   * and throws if hashing fails.
   */
  mustHash(): Promise<string> {
    return this.hashTask()
      .run()
      .then((result) =>
        result.match({
          Ok: (encrypted) => encrypted,
          Err: (error) => {
            throw new WrappedError(`failed to hash password`, error);
          },
        })
      );
  }

  compareTask(encrypted: string) {
    return Password.compare(this.value, encrypted).tap_err(logger.error);
  }

  /**
   * Compares the given encrypted password with this plaintext password.
   * Throws is hash compare fails.
   */
  mustCompare(encrypted: string): Promise<boolean> {
    return this.compareTask(encrypted)
      .run()
      .then((result) =>
        result.match({
          Ok: (doesMatch) => doesMatch,
          Err: (error) => {
            throw new WrappedError(`failed to compare password`, error);
          },
        })
      );
  }

  /**
   * Scrubs the password out of the given text.
   * All occurrences of the password are replaced with the mask.
   */
  scrub(text: string, mode: ScrubMode = ScrubMode.Default): string {
    let replacement: string;
    switch (mode) {
      default:
        // Lets the compiler verify we've handled ScrubMode exhaustively.
        return expectNever(mode);
      case ScrubMode.Delete:
        replacement = "";
        break;
      // We'll use masking as our default
      case ScrubMode.Default:
      case ScrubMode.Mask:
        replacement = this.mask;
        break;
    }

    return text.replace(this.secretAsRegExp("g"), replacement);
  }

  /**
   * Checks if this password is contained in the given text.
   */
  isContainedIn(text: string): boolean {
    return text.indexOf(this.value) > -1;
  }

  get isValid(): boolean {
    return this.audit().is_ok();
  }

  audit(): Result<void, string> {
    return V.asTrimmed(this.value)
      .and_then(V.asPrintableChars)
      .and_then(V.withMinLength(Password.minLength))
      .and(V.withMaxByteLength(72)(this.value)) /* bcrypt specific */
      .match({
        Ok: () => Result.Ok(undefined),
        Err: (errorMsg) => {
          if (this.isContainedIn(errorMsg)) {
            // Validators use a colon to separate the message from the problem text.
            // We'll slice that off, then scrub to be safe.
            errorMsg = errorMsg.slice(0, errorMsg.indexOf(":"));
            errorMsg = this.scrub(errorMsg);
          }
          return Result.Err(errorMsg);
        },
      });
  }

  /**
   * Converts the literal password value to a regular expression
   * so we can use it in string scrubbing.
   */
  protected secretAsRegExp(flags?: string | undefined) {
    return new RegExp(
      this.secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      flags
    );
  }

  static get minLength(): number {
    return 8;
  }

  static get saltOrRounds(): number {
    return 10;
  }

  static hash(plaintext: string): Task<string, Error> {
    return new Task(({ Ok, Err }) => {
      bcrypt.hash(plaintext, Password.saltOrRounds, (error, encrypted) => {
        if (error) {
          return Err(error);
        }
        Ok(encrypted);
      });
    });
  }

  static compare(plaintext: string, encrypted: string): Task<boolean, Error> {
    return new Task(({ Ok, Err }) => {
      bcrypt.compare(plaintext, encrypted, (error, doesMatch) => {
        if (error) {
          return Err(error);
        }
        Ok(doesMatch);
      });
    });
  }
}
