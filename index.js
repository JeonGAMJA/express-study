const express = require('express');
const jwt = require('jwt');

const app = express();
const secretText = 'superSecret';
const refreshScretText = 'supersuperSecret';
let refreshTokens = [];

const posts = [
  {
    username: 'john',
    title: 'Post 1',
  },
  {
    username: 'Han',
    title: 'Post 2',
  },
];

app.use(express.json());

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, secretText, { expiresIn: '30s' });

  const refreshToken = jwt.sign(user, refreshScretText, { expiresIn: '1d' });

  refreshTokens.push(refreshToken);

  res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

  res.json({ accessToken: accessToken });
});

app.get('/posts', authMiddleware, (req, res) => {
  res.json(posts);
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authrizations'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretText, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const port = 4000;
app.listen(port, () => {
  console.log('listening on port' + port);
});
