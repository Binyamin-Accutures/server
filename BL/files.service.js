const fs = require('fs');
const userService = require('../BL/user.service');
const { errMessage } = require('../errController');
const { createProject } = require("./project.service")
const projectController = require("../DL/project.controller");
const { checkData } = require('../checkController');
const AdmZip = require('adm-zip');
// const path = require("path");

const saveResults = (files, path, res) => {
  files.forEach((v, i) => {
    if (v.mimetype === `image/png`) {
      let name = v.originalname;
      if (!fs.existsSync(`${path}`)) fs.mkdirSync(`${path}`)
      if (!fs.existsSync(`${path}${v.fieldname}`)) fs.mkdirSync(`${path}${v.fieldname}`)
      fs.renameSync(`./upload/${v.filename}`, `${path}${v.fieldname}/${name}`)
      if (!fs.existsSync(`${path}${v.fieldname}/${name}`)) throw { code: 500, message: `can't create file` }
    }
  })
  //saving AS ZIP
  const zip = new AdmZip();
  zip.addLocalFolder(path)
  const downloadName = `processed_${path.split('/')[2]}.zip`;
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
  if (!fs.existsSync(`./upload/${data.email}`)) {
    fs.mkdirSync(`./upload/${data.email}`)
  }
  const baseDir = `upload/${data.email}/${date}`
  fs.mkdirSync(`./${baseDir}`)
  fs.mkdirSync(`./${baseDir}/original`)
  files.forEach((v, i) => {
    if (v.mimetype === `image/png`) {
      fs.renameSync(`./upload/${v.filename}`, `./${baseDir}/original/${i}.png`)
      if (!fs.existsSync(`./${baseDir}/original/${i}.png`)) throw { code: 999, message: `can't create file` }
    }
    else {
      fs.unlinkSync(`./upload/${v.filename}`)
    }
  })
  const project = await createProject(user._id, { root: `./${baseDir}`, createDate: date, })
  if (!project) throw errMessage.PROJECT_NOT_FOUND
  return project
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
