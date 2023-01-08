require("./db").connect();
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  s1: { 
    path:{
    type:String,
    required:true
    },
    runIspSettings:{
      type: Object,
      required: true,
    },
      type: Object,
      required: true,
  },
  s2: {
     path:{
     type: Object,
     required: true,
     },
    type: Object,
    required: true,
  },
  s3: { 
    path:{
    type:String,
    required:true
    },
    SaveResultSettings:{
      type: Object,
      required: true,
    },
      type: Object,
      required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const userData = mongoose.model("user", userSchema);

module.exports = userData;
