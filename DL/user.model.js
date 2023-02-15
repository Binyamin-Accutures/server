const mongoose = require("mongoose");
require("./project.model");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  ],
  resetPass: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const userData = mongoose.model("user", userSchema);

module.exports = userData;