import { Router, Request, Response } from "express";
import * as Controller from "./auth.controller";
import * as Auth from "./auth.middleware";

export const router = Router();

router.post(
  "/signup",
  Auth.verifyCreateUserParams,
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    let sender = await Controller.createNewUser({
      firstName,
      lastName,
      email,
      password,
    });

    sender.send(res);
  }
);

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let sender = await Controller.loginUser({
    email,
    password,
  });

  sender.send(res);
});
