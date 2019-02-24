import { Response, Request, NextFunction, Handler } from "express";
import { logger } from "../../log";
import { TimeoutError } from "../errors/TimeoutError";

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.info({
    method: req.method,
    uri: req.originalUrl,
  });
  next();
}

export function withTimeout(timeoutDuration: number): Handler {
  return function timeoutHandler(req, _res, next) {
    req.setTimeout(timeoutDuration, () => {
      logger.error(
        new TimeoutError({
          message: `request inactivity exceeded timeout`,
          timeout: timeoutDuration,
        })
      );
    });
    next();
  };
}
