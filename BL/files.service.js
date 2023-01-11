const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { sendError } = require('../errController');
const {createProject} = require("./project.service")


const uploadRewFiles = async (req)=>{
  const user = await userService.getUser(req.email)
  console.log(user)
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

const createProj = await createProject(user._id,{ root:`./${baseDir}`,runIspSettings: {undefined },createDate: date})
if (!createProj) return ////error
return src
}

module.exports ={uploadRewFiles}



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