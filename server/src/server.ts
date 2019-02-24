import "./bootstrap";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as Api from "./http/api/api";
import { logger } from "./log";
import bodyParser from "body-parser";
import * as middleware from "./http/middleware/general";
import { Duration } from "./time/time";

// create postgres connection
createConnection();

const app = express();
const port = 3000;

app.use(middleware.withRequestId);
app.use(middleware.requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middleware.withTimeout(Duration.Second * 30));
app.get("/test", (_req: any, res: any) => {
  res.send("hello world");
});

app.use("/api", Api.register());

// TODO: implement a request timeout value
app.listen(port, function() {
  logger.info(`App Listening on port ${port}`);
});
