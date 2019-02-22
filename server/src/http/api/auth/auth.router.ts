import { Router } from "express";
import * as Controller from './auth.controller';
import passport from "passport";


export const router = Router();

router.get('/', async (req: any, res: any) => {
  res.send('not auth');
})

router.post('/signup',
  passport.authenticate('signup', { session: false}),
  async (req: any, res: any, next: any) => {
  res.json(
    {
      message: 'signup successful',
      user: req.user
    }
  )
})