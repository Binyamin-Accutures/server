const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
 user:{
  type:String,
  required:true
 },
  root:{ 
  type:String,
  required:true
},
  runIspSettings: {
      type: Object,
      required: true,
  },
  saveSettings: { 
      type: Object,
  },
  createDate: {
    type: Date,
    required:true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const projectData = mongoose.model("project", projectSchema);

module.exports = projectData;
