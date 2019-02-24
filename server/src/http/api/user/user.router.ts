import { Router } from "express";
import * as Controller from "./user.controller";
import { logger } from "../../../log";
import { symbolKeys } from "../../constants";

export const router = Router();

router.get("/self", async (req: any, res: any) => {
  let userId = req[symbolKeys.userId];
  logger.debug({ userId });

  const sender = await Controller.fetchUserById(userId);
  sender.send(res);
});
