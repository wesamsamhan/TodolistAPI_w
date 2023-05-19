const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const UserModel = require("./models/Auth/UserModel");

const startOptions = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ username });
          if (!user) {
            return done(null, false);
          }
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.id);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const checkAuthentication = passport.authenticate("jwt", { session: false });

module.exports = { startOptions, checkAuthentication };
