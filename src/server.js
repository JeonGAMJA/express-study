const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const path = require('path');

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

app.get('/login', function (req, res, next) {
  res.render('login');
});

app.post('/login', (req, res, next) => {});

app.get('/signup', function (req, res, next) {
  res.render('signup');
});

app.post('/signup', (req, res, next) => {});

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
