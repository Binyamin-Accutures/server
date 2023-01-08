require("./db").connect();
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

 root:{ 
  type:String,
  required:true
  ,
},
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

const projectData = mongoose.model("project", projectSchema);

module.exports = projectData;
