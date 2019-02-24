import { logger } from "./log";

process.on("unhandledRejection", function promiseRejectionHandler(
  reason,
  promise
) {
  logger.error({ reason, promise });
});

process.on("uncaughtException", function uncaughtExceptionHandler(error) {
  logger.error(error);
});
