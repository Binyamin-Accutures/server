const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const userService = require('../BL/user.service');
const AdmZip = require('adm-zip');
const fs = require('fs')
const uploadDir = fs.readdirSync(__dirname+"/upload");

const app = express()
const port = 6700 
const cors = require('cors');
const { log } = require('console');

app.use(express.json());
app.use(cors());  
 
 app.all('/api/createZIP', upload.any("files"), (req, res) => {
    const files = req.files
    log(req.body.path)
        files.forEach((v,i)=>{
            if(v.mimetype ===`image/png`){
                if(!fs.existsSync(`./upload/${v.fieldname}`))  fs.mkdirSync(`./upload/${v.fieldname}`)
                fs.renameSync(`./upload/${v.filename}`,`./upload/${v.fieldname}/${v.originalname}`)
                if(!fs.existsSync(`./upload/${v.fieldname}/${v.originalname}`))throw {code:500,message:`can't create file`}
            }})

    //saving AS ZIP
    const zip = new AdmZip();
    let currentDirPath = __dirname+"/upload/" 
    zip.addLocalFolder(currentDirPath)
    const downloadName = `Accutures ${Date.now()}.zip`;
 
    const data = zip.toBuffer();
    
    // save file zip in root directory
    zip.writeZip(__dirname+"/upload"+downloadName);
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${downloadName}`);
    res.set('Content-Length',data.length);
    res.send({downloadName});

 })
const { sendError } = require('../errController');
const {createProject} = require("./project.service")
const projectsCtrl = require ("../DL/project.controller"); 
const { default: axios } = require('axios');
// import {FormData, File} from "formdata-node" 
// import fetch from "node-fetch"

const uploadRewFiles = async (req,res)=>{

// const test = async (path) =>
//  fs.readdirSync(path).map(v=>{
//     if(v===dir) test(v)
//     fs.renameSync(v,v.replace)

// })
 



const uploadRewFiles = async (req)=>{ 
  const user = await userService.getUser(req.email)
  const date = new Date()
  const files = req.files
  if (!files) sendError(res, {code: 401})
  if(!fs.existsSync(`./upload/${req.email}`)) fs.mkdirSync(`./upload/${req.email}`)
  const baseDir = `upload/${req.email}/${Number(date)}`
  fs.mkdirSync(`./${baseDir}`)
  fs.mkdirSync(`./${baseDir}/original`)
  fs.mkdirSync(`./${baseDir}/process`)
  files.forEach((v,i)=>{if(v.mimetype ===`image/png`){
    fs.renameSync(`./upload/${v.filename}`,`./${baseDir}/original/${i}.png`)
    if(!fs.existsSync(`./${baseDir}/original/${i}.png`))throw {code:500,message:`can't create file`}
}
else{
fs.unlinkSync(`./upload/${req.email}/${v.filename}`)
}})
      }
    


// const src = fs.readdirSync(`./${baseDir}/original`).map((v)=>{
//     return `/api/files/${baseDir}/original/${v}`
// })

// const createProj = await createProject(user._id,{ root:`./${baseDir}`,runIspSettings: {undefined },createDate: date})
// if (!createProj) return ////error
// return src
// }

//module.exports ={uploadRewFiles}
 const src = fs.readdirSync(`./${baseDir}/original`).map((v)=>{
    return `/api/files/${baseDir}/original/${v}`
})
const projProps= {
   root:`./${baseDir}`,
   runIspSettings: { },
   createDate: date,
   user:req.email,
   projName:date
  }
const createProj = await createProject(user._id, projProps)
if (!createProj) return ////error

return [{src},{projProps}]
}

const saveIspObj = async (props)=>{
  const exict = await  projectsCtrl.readOne({root:props.root}) 
  const sentIspObj = await projectsCtrl.updateAndReturn (exict._id,{ runIspSettings :props.runIspSettings})
  if(sentIspObj) return sentIspObj.runIspSettings
}

const sendToRemoteServer = async (root)=>{
  try{

    const project  =  await projectsCtrl.readOne({root:root}); 
    const runIsp= project.runIspSettings
    theRoot = `${project.root.slice(2)}/original`
    const originalFiles =  await getAllFilesInFolder (theRoot)
    
    const res = await axios.post(serverUrl,originalFiles)
    const processedFiles =res.data
      if (processedFiles){
      saveToProj= await  projectsCtrl.updateAndReturn (project._id,{ urlafterRunIsp :processedFiles})
      if (saveToProj) return {processedFiles,root:project.root }
      }
      else throw error("no files")
  }catch(err){


  }
return processedFiles 
}




const getAllFilesInFolder = async(requestedFolder)=>{

  if(!fs.existsSync(`./${requestedFolder}`)) throw {code: 404, message: "path not found"}
  const dir =  fs.readdirSync(`./${requestedFolder}`)
  if(!dir)throw {code: 404, message: "path not found"}
  const files = dir.map((v)=>{
    return {name:v, path:`/api/files/${requestedFolder}/${v}`}
  })
return files
}
module.exports ={uploadRewFiles, saveIspObj, sendToRemoteServer, getAllFilesInFolder}



app.listen(port, () => console.log(`Server started on port ${port}`))