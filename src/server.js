const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.use('/static', express.static(path.join(__dirname, 'public')));
