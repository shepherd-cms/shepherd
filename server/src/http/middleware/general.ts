import { Handler } from "express";
import { RequestLog } from "./RequestLogger";
import { RequestId } from "../RequestId";

export const withRequestId = RequestId.injectMiddleware;

export const requestLogger = RequestLog.middleware({
  withColors: true,
});

export function withTimeout(timeoutDuration: number): Handler {
  return function timeoutHandler(req, _res, next) {
    /**
     * @link https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_socket_settimeout_timeout_callback
     */
    // @ts-ignore TS expects 2 args, but with 1, node automatically times out requests. With 2, we have to do that manually.
    req.setTimeout(timeoutDuration);
    next();
  };
}
