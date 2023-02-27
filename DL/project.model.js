const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
 root:{ 
  type:String
},
  runIspSettings: {
      type: Object,
  },
  urlAfterRunIsp:[{type:String}],
  saveSettings: { 
      type: Object,
  },
  createDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const projectData = mongoose.model("project", projectSchema);

module.exports = projectData;