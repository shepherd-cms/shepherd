import { Response, Request, NextFunction } from "express";
import { logger } from "../../log";

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
