import { Router } from "express";
import * as Routes from "./index";
import * as AuthMW from "./auth/auth.middleware";

export interface CreateApiRouterParams {}

export function register(_params?: CreateApiRouterParams): Router {
  const api = Router();

  api.use("/auth", Routes.auth);

  // protected routes
  api.use(AuthMW.verifyToken);
  api.use("/user", Routes.user);

  return api;
}
