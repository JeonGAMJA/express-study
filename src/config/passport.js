const passport = require('passport');
const LocalStrategy = require('passport-local');

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
