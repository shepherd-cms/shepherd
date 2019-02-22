import { getConnection } from 'typeorm'
import passport from "passport";
import { Strategy as localStrategy } from 'passport-local';
import User from "../../../models/user";

// create passport middleware to handle registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email: string, password: string, done: any) => {

  try {
  //Save the information provided by the user to the the database
  const newuser = getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values([{
    firstName: 'Test',
    lastName: 'User',
    email,
    password
  }])
  return done(null, newuser);
  } catch(error) {
    return done(error);
  }
}))
