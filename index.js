require('dotenv').config();
require('./DL/db').connect();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3625;
const mainRouter = require('./Routes');

app.use('/api', mainRouter);

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log('connection succsess');
});
