require('dotenv').config();
require('./DL/db').connect();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3625;
const mainRouter = require('./router');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api', mainRouter);
app.use('/',express.static('upload'))

app.listen(PORT, () => {
  console.log('server listen to ' +PORT);
});
