const fs = require('fs');
const userService = require('../BL/user.service');
const { errMessage } = require('../errController');
const { createProject } = require("./project.service")
const projectController = require("../DL/project.controller");
const { checkData } = require('../checkController');
const AdmZip = require('adm-zip');

const saveResults = async (files, path, res) => {
  if (!fs.existsSync(`${path}`)) fs.mkdirSync(`${path}`)
  await files.forEach(async file => {
    if (!fs.existsSync(`${path}/${file.fieldname}`)) fs.mkdirSync(`${path}/${file.fieldname}`)
    await orderedFiles(`${path}/${file.fieldname}`,v)
  })
  //saving AS ZIP
  const zip = new AdmZip();
  const downloadName = `processed_${path.split('/')[2]}.zip`;
  zip.addLocalFolder(path,downloadName)
  console.log(downloadName);
  const data = zip.toBuffer();

  // save file zip in root directory

  console.log(path + downloadName);
  zip.writeZip(path + downloadName);
  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', `attachment; filename=${downloadName}`);
  res.set('Content-Length', data.length);
  res.send({  downloadName });
}

const uploadRewFiles = async (data) => {
  checkData(data, ["email", "files"])
  const user = await userService.getUser(data.email)
  const date = Date.now()
  const files = data.files
  if (!fs.existsSync(`./upload/${data.email}`)) fs.mkdirSync(`./upload/${data.email}`)
  const baseDir = `upload/${data.email}/${date}`
  fs.mkdirSync(`./${baseDir}`)
  fs.mkdirSync(`./${baseDir}/original`)
  await files.forEach(async file => await orderedFiles(`./${baseDir}/original`,file))
  const project = await createProject(user._id, { root: `./${baseDir}`, createDate: date, })
  if (!project) throw errMessage.PROJECT_NOT_FOUND
  return project
}
const orderedFiles = async(path,file)=>{
    if (file.mimetype === `image/png`) {
      fs.renameSync(`./upload/${file.filename}`, `./${path}/${file.originalname}.png`)
      if (!fs.existsSync(`./${path}/${file.originalname}.png`)) throw errMessage.CAN_NOT_CHANGE_FILE_NAME
    }
    else {
      fs.unlinkSync(`./upload/${v.filename}`)
    }
}
const saveRunIspObj = async (data) => {
  checkData(data, ["root", "runIspSettings"])
  return await projectController.updateAndReturnByAnyFilter({ root: data.root }, { runIspSettings: data.runIspSettings })
}

// const sendToRemoteServer = async (root) => {
//   try {

//     const project = await projectsCtrl.readOne({ root: root });
//     const runIsp = project.runIspSettings
//     theRoot = `${project.root.slice(2)}/original`
//     const originalFiles = await getAllFilesInFolder(theRoot)

//     const res = await axios.post(serverUrl, originalFiles)
//     const processedFiles = res.data
//     if (processedFiles) {
//       saveToProj = await projectsCtrl.updateAndReturn(project._id, { urlafterRunIsp: processedFiles })
//       if (saveToProj) return { processedFiles, root: project.root }
//     }
//     else throw error("no files")
//   } catch (err) {


//   }
//   return processedFiles
// }

const getAllFilesInFolder = async (requestedFolder) => {
  if (!fs.existsSync(`./${requestedFolder}`)) throw { code: 404, message: "path not found" }
  const dir = fs.readdirSync(`./${requestedFolder}`)
  if (!dir) throw { code: 404, message: "path not found" }
  const files = dir.map((v) => {
    requestedFolder=requestedFolder.replace('./upload','')
    return { name: v, path: `${requestedFolder}/${v}` }
  })
  return files
}
module.exports = { uploadRewFiles, saveRunIspObj, getAllFilesInFolder, saveResults }
