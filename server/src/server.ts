import express from 'express';
import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Routes from './http/api/index.js';
import passport from "passport";

// create postgres connection
createConnection();

const app = express();
const port = 3000;
app.get('/test', (req: any, res: any) => {
  res.send('hello world');
});

app.use('/user', Routes.user)
app.use('/auth', Routes.auth)

app.listen(port, function() {
  console.log(`App Listening on port ${port}`)
})