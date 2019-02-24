import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as Api from "./http/api/api";
import { logger } from "./log";
import bodyParser from "body-parser";
import passport from "passport";
import { requestLogger } from "./http/middleware/general";

// create postgres connection
createConnection();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);
app.use(passport.initialize());
app.use(passport.session());
app.get("/test", (_req: any, res: any) => {
  res.send("hello world");
});

app.use("/api", Api.register());

// TODO: implement a request timeout value
app.listen(port, function() {
  logger.info(`App Listening on port ${port}`);
});
