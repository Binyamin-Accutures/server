const fs = require("fs");
const userService = require("../BL/user.service");
const { errMessage } = require("../errController");
const { createProject } = require("./project.service");
const projectController = require("../DL/project.controller");
const { checkData } = require("../checkController");
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");

const saveResults = async (files, path, res,host) => {
  if (!fs.existsSync(`${path}`)) fs.mkdirSync(`${path}`);
  await files.forEach(async (file) => {
    if (!fs.existsSync(`${path}/${file.fieldname}`))
      fs.mkdirSync(`${path}/${file.fieldname}`);
    await orderedFiles(`${path}/${file.fieldname}`, file);
  });
  const zip = new AdmZip();
  const downloadName = `processed_${path.split("/")[2]}.zip`;
  zip.addLocalFolder(path, downloadName);

  zip.writeZip(path + downloadName);
  res.send(host+path.split("./upload")[1]+downloadName);
};

const uploadRewFiles = async (data) => {
  checkData(data, ["email", "files"]);
  const user = await userService.getUser(data.email);
  const date = Date.now();
  const files = data.files;
  if (!fs.existsSync(`./upload/${data.email}`))
    fs.mkdirSync(`./upload/${data.email}`);
  const baseDir = `upload/${data.email}/${date}`;
  fs.mkdirSync(`./${baseDir}`);
  fs.mkdirSync(`./${baseDir}/original`);
  await files.forEach(
    async (file) => await orderedFiles(`./${baseDir}/original`, file)
  );
  const project = await createProject(user._id, {
    root: `./${baseDir}`,
    createDate: date,
  });
  if (!project) throw errMessage.PROJECT_NOT_FOUND;
  return project;
};
const orderedFiles = async (path, file) => {
  if (file.mimetype === `image/png`) {
    fs.renameSync(
      `./upload/${file.filename}`,
      `./${path}/${file.originalname}`
    );
    if (!fs.existsSync(`./${path}/${file.originalname}`))
      throw errMessage.CAN_NOT_CHANGE_FILE_NAME;
  } else {
    fs.unlinkSync(`./upload/${file.filename}`);
  }
};
const saveRunIspObj = async (data) => {
  checkData(data, ["root", "runIspSettings"]);
  return await projectController.updateAndReturnByAnyFilter(
    { root: data.root },
    { runIspSettings: data.runIspSettings }
  );
};

const sendToRemoteServer = async (root,res,host) => {
  const project = await projectController.readOne({ root: root });
  const inputRoot = `${project.root}/original`;
  const outputRoot = `${project.root}/output`;
  const end_frame = fs.readdirSync(inputRoot)
  if(!fs.existsSync(outputRoot)) fs.mkdirSync(outputRoot);
  const myJson = JSON.stringify({
    inputs: {input_folder:inputRoot,start_frame:0,end_frame:end_frame.length},
    "outputs": 
    {
        "hsv_rep": 
        {
            "hue_scale_factor": 1.5
        },
        "video": 
        {
            "video_frame_rate": 8
        }, 
        "save_outputs": 
        {
            "save_images": true, 
            "save_videos": true, 
            "dump_folder": outputRoot
        }
    },
    image_processing: project.runIspSettings,
  });
  const jsonRoot = `./acctur_json_${Date.now()}.json`;
  fs.writeFileSync(jsonRoot, myJson);
  const child = spawn("python", [`SimpleISP.py`,jsonRoot]);
  let result = "";

  child.stdout.on("data", (data) => {
    console.log(data.toString());
    result += data.toString();
  });
  
  child.stderr.on("data", (data) => {
  throw errMessage.IMG_CAN_NOT_BE_PROCESSED
  });

  child.on("exit", async (code) => {
    const files = await getAllFilesInFolder(outputRoot)
    res.send({ src: files.map(f => host + f.path) })
    fs.unlinkSync(jsonRoot)
  });
};

const getAllFilesInFolder = async (requestedFolder) => {
  if (!fs.existsSync(`./${requestedFolder}`))
    throw { code: 404, message: "path not found" };
  const dir = fs.readdirSync(`./${requestedFolder}`);
  if (!dir) throw { code: 404, message: "path not found" };
  const files = dir.map((v) => {
    requestedFolder = requestedFolder.replace("./upload", "");
    return { name: v, path: `${requestedFolder}/${v}` };
  });
  return files;
};
module.exports = {
  uploadRewFiles,
  sendToRemoteServer,
  saveRunIspObj,
  getAllFilesInFolder,
  saveResults,
};
