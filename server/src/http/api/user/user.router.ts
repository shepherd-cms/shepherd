import { Router } from 'express';
import * as Controller from './user.controller';

export const router = Router();

router.get('/', async (req: any, res: any) => {

  const allUsers = await Controller.fetchAllUsers();
  console.log('ere', allUsers);
  res.send(allUsers)
})