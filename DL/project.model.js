const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
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
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const projectData = mongoose.model("project", projectSchema);

module.exports = projectData;
