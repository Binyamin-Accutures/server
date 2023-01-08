require("./db").connect();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: true,
  },
    createDate: {
    type: Date,
    default: Date.now,
  },
    projects:[{
        
    }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const userData = mongoose.model("user", userSchema);

module.exports = userData;
