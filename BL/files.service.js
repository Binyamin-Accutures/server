const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { sendError } = require('../errController');
const {createProject} = require("./project.service")
const projectsCtrl = require ("../DL/project.controller"); 
const { default: axios } = require('axios');
// import {FormData, File} from "formdata-node" 
// import fetch from "node-fetch"

const uploadRewFiles = async (req,res)=>{

  const user = await userService.getUser(req.email)
  const date = new Date()
  const files = req.files
if (!files) sendError(res, {code: 401})
if(!fs.existsSync(`./upload/${req.email}`)) fs.mkdirSync(`./upload/${req.email}`)
const baseDir = `upload/${req.email}/${Number(date)}`
fs.mkdirSync(`./${baseDir}`)
fs.mkdirSync(`./${baseDir}/original`)
fs.mkdirSync(`./${baseDir}/process`)
files.forEach((v,i)=>{
    if(v.mimetype ===`image/png`){
    fs.renameSync(`./upload/${v.filename}`,`./${baseDir}/original/${i}.png`)
    if(!fs.existsSync(`./${baseDir}/original/${i}.png`))throw {code:500,message:`can't create file`}
  }
  else{
    fs.unlinkSync(`./upload/${req.email}/${v.filename}`)
  }
})

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
  const sentIspObj = await projectsCtrl.updateAndReturn (exict[0]._id,{ runIspSettings :props.runIspSettings})
return sentIspObj.runIspSettings
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

// sendToRemoteServer()


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



   //missing api from server
        // files.forEach((v,i)=>{
        //     if(v.mimetype ===`image/png`){
        //     fs.copyFileSync(`./${baseDir}/original/${i}.png`,`./${baseDir}/process/${i}.png`,)
        //     if(!fs.existsSync(`./${baseDir}/process/${i}.png`))throw {code:500,message:`can't create file`}
        //     }
        // })
        // const isCreated = await projectService.createProject(user._id,{ root:`./${baseDir}`,runIspSettings: {...req.body },createDate: date})
        // if(!isCreated)throw {code:500,message:`can't create project`}
        // const urlFiles = fs.readdirSync(`./${baseDir}/process`).map((v)=>{
        //     return `/api/files/upload/${req.email}/${req.params.dirDate}/${req.params.dir}/${v}`
        // })