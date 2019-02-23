import { Router, Request, Response } from 'express';
import { ErrorResponse } from '../../response/error';
import * as Controller from './user.controller';

export const router = Router();

router.get('/self', async (req: any, res: any) => {
  console.log('req', req.user);
  const writer = await Controller.fetchUserById(req.user);
  writer.render(res);
});
