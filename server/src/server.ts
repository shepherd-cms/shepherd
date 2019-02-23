import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as Api from './http/api/api';
import { logger } from './log';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as passportConfig from './config/passport';

// create postgres connection
createConnection();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/test', (req: any, res: any) => {
  res.send('hello world');
});

app.use('/api', Api.register({}));

app.listen(port, function() {
  logger.info(`App Listening on port ${port}`);
});
