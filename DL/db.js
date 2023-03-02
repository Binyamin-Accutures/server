const { exec } = require("child_process");
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

mongoose.set("strictQuery", false);

async function connect() {
  try {
    const packages = ["matplotlib", "numpy", "sys","scikit-image","opencv-python"];
    for (package in packages){
      exec(`pip install ${package}`, (error, stdout, stderr) => {
        if (error) {
          console.error(
            `Failed to install package ${package}. Error message: ${error}`
          );
          return;
        }
        console.log(`Package ${package} successfully installed.`);
      });
    }
    mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) throw "Error DB : " + err;

        console.log(`Connection Success`);
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { connect };
