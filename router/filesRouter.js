const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { errController } = require('../errController');
const projectService = require('../BL/project.service');

filesRouter.use('/',express.static('uploads'))


filesRouter.get('/', async (req,res, next)=>{
    try{
        const filesPath = await userService.getFiles(req.send.email)
        const files = filesPath.map((v)=>{
            const filename = v.root.replace("uploads/","")
            return {
                name:filename                          
            }})
            res.send(files)
        }
        catch(err){
            req.errCode = err.code
            next()
        }
},errController)

filesRouter.get('/:dirDate/:dir', upload.any("files"), async (req,res, next)=>{
try{
    const fileExists =  fs.readdirSync(`./uploads/${req.params.dirDate}/${req.params.dir}`)
    if(!fileExists)throw {code: 404, message: "path not found"}
    const files = fileExists.map((v)=>{
        return {name:v, path:`./${req.params.path}/${req.params.dir}/${v}`}
    })
    res.send({files})
}
catch(err){
    req.errCode = err.code
    next()
}
},errController)

filesRouter.post('/', upload.any("files"), async (req,res, next)=>{
    try{
        const date = new Date()
        fs.mkdirSync(`./uploads/${Number(date)}`)
        fs.mkdirSync(`./uploads/${Number(date)}/original`)
        fs.mkdirSync(`./uploads/${Number(date)}/process`)
        const files = req.files
        files.forEach((v)=>{

            fs.renameSync(`./uploads/${v.filename}`,`./uploads/${Number(date)}/original/${v.filename}`)//missing files ends
            if(!fs.existsSync(`./uploads/original/${v.filename}`))throw {code:500,message:`can't create file`}
        })
        const processFiles = req.files//api from server
        processFiles.forEach((v)=>{
            fs.renameSync(`./uploads/${v.filename}`,`./uploads/${Number(date)}/process/${v.filename}`)//missing files ends
            if(!fs.existsSync(`./uploads/process/${v.filename}`))throw {code:500,message:`can't create file`}
        })
        const isCreated = projectService.createProject({email: req.body.email, root:`./uploads/${Number(date)}`,runIspSettings: req.body.runIspSettings,createDate:date})
        if(!isCreated)throw {code:500,message:`can't create project`}  
        res.send({success:true})  
    }
    catch(err){
        req.errCode = err.code
        next()
    }
},errController)

filesRouter.put('/',async (req, res, next)=>{
    try{
        const isUpdate = await projectService.updateProject(`./uploads/${req.body.folder}`,req.body.saveSettings)
        if(!isUpdate)throw {code:500,message:`can't update project`}
        res.send({success:true})
    }
    catch(err){
        req.errCode = err.code
        next()
    }
    },errController)

module.exports = filesRouter





