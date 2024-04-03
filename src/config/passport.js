const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({ email: email.toLocaleLowerCase() });
        if (!existingUser) {
          return done(null, false, { msg: `Email ${email} not found` });
        }

        existingUser.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);

          if (isMatch) return done(null, existingUser);

          return done(null, false, { msg: 'Invalid email or password.' });
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLINET_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }, (err, existingUser) => {
      if (err) done(err);
      if (existingUser) {
        done(null, existingUser);
      } else {
        const user = new User();
        user.email = profile.emails[0].value;
        user.googleId = profile.id;
        user.save((err) => {
          if (err) done(err, user);
          done(null, user);
        });
      }
    });
  },
);

passport.use('google', googleStrategyConfig);
