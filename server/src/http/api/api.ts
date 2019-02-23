import { Router } from 'express';
import * as Routes from './index';
import { verifyToken_MW } from '../helpers/middleware';

export interface CreateApiRouterParams {}

export function register(params: CreateApiRouterParams): Router {
  const api = Router();

  api.use('/auth', Routes.auth);

  // protected routes
  api.all('*', verifyToken_MW);
  api.use('/user', Routes.user);

  return api;
}
