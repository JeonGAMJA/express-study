const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const app = express();
const path = require('path');
const User = require('./models/users.model');
const cookieSession = require('cookie-session');

const cookieEncryptionKey = 'supersecret-key';

app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [cookieEncryptionKey],
  }),
);

app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);

mongoose
  .connect(
    `mongodb+srv://jeonsohee:qwer1234@express-cluster.3anltzp.mongodb.net/?retryWrites=true&w=majority&appName=express-cluster
`,
  )
  .then(() => {
    console.log(`mongodb connected`);
  })
  .catch((error) => {
    console.log(err);
  });

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', function (req, res, next) {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log('no user found');
      return res.json({ msg: info });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
});

app.get('/signup', function (req, res, next) {
  res.render('signup');
});

app.post('/signup', (req, res, next) => {
  async (req, res, next) => {
    const user = new User(req.body);
    console.log(req.body);
    try {
      await user.save();
      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
});

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
