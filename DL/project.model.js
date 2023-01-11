const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
 root:{ 
  type:String
},
  runIspSettings: {
      type: Object,
      required: true,
  },
  urlAfterRunIsp:[{type:String}],
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
