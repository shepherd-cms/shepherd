import { Router, Request, Response } from 'express';
import * as Controller from './auth.controller';
import { verifyToken_MW } from '../../helpers/middleware';

export const router = Router();

router.get('/', verifyToken_MW, async (req: any, res: any) => {
  res.send('not auth');
});

router.post('/signup', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  let writer = await Controller.createNewUser({
    firstName,
    lastName,
    email,
    password,
  });

  writer.render(res);
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let writer = await Controller.loginUser({
    email,
    password,
  });

  writer.render(res);
});
