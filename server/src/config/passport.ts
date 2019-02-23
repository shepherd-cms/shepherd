import passport from "passport";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({ usernameField: "email" }, (email: string, password: string, done: any) => {

  const user = { name : 'mike'};
  return done(undefined, user);

  // User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
  //   if (err) { return done(err); }
  //   if (!user) {
  //     return done(undefined, false, { message: `Email ${email} not found.` });
  //   }
  //   user.comparePassword(password, (err: Error, isMatch: boolean) => {
  //     if (err) { return done(err); }
  //     if (isMatch) {
  //       return done(undefined, user);
  //     }
  //     return done(undefined, false, { message: "Invalid email or password." });
  //   });
  // });
}));
