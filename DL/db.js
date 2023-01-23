const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

mongoose.set('strictQuery', false);

async function connect() {
  try {
    mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) throw 'Error DB : ' + err;

        console.log(`Connection Success`);
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { connect };
