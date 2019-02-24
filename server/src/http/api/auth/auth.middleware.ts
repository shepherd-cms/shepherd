import { Response, Request, NextFunction } from "express";
import * as Auth from "./auth.controller";
import { ErrorResponse } from "../../response/error";
import { logger } from "../../../log";
import { isNotString } from "../../../validation/guards";
import { symbolKeys } from "../../constants";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    let error = ErrorResponse.NewUnauthorizedError(req);
    error.send(res);
    return;
  }

  // ignore the `Bearer` and pluck a potential `<token>`
  const [, token] = authHeader.split(" ");
  if (token == null || token.length === 0) {
    let error = ErrorResponse.NewUnauthorizedError(req);
    error.send(res);
    return;
  }

  Auth.verifyToken(token)
    .then((decodedToken: any) => {
      // @ts-ignore because apparently we can't index symbols yet
      req[symbolKeys.userId] = decodedToken.id;
      next();
    })
    .catch((err: any) => {
      logger.error(err);

      let error = new ErrorResponse({
        error: "invalid_token",
        status: ErrorResponse.Forbidden,
      });
      error.send(res);
    });
}

/**
 * Verifies the payload signature for a create user operation.
 */
export function verifyCreateUserParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { email, firstName, lastName, password } = req.body;

  if (isNotString(email)) {
    let error = new ErrorResponse({
      error: `Email is required`,
      status: ErrorResponse.BadRequest,
    });
    error.send(res);
    return;
  }

  if (isNotString(firstName)) {
    let error = new ErrorResponse({
      error: `FirstName is required`,
      status: ErrorResponse.BadRequest,
    });
    error.send(res);
    return;
  }

  if (isNotString(lastName)) {
    let error = new ErrorResponse({
      error: `LastName is required`,
      status: ErrorResponse.BadRequest,
    });
    error.send(res);
    return;
  }

  if (isNotString(password)) {
    let error = new ErrorResponse({
      error: `Password is required`,
      status: ErrorResponse.BadRequest,
    });
    error.send(res);
    return;
  }

  next();
}
