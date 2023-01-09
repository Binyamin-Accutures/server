const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { errController } = require('../errController');
const projectService = require('../project.service');
errController = require('../errController')

filesRouter.use('/',express.static('uploads'))


filesRouter.get('/', async (req,res, next)=>{
    try{
        const filesPath = await userService.getFiles(req.send.email)
        const files = filesPath.map((v)=>{
            const fileName = v.root.replace("upload/","")
            return {
                name:fileName                          
            }})
            res.send(files)
        }
        catch(err){
            req.errCode = err.code
            next()
        }
},errController())

filesRouter.get('/:dirDate/:dir', upload.array("files"), async (req,res, next)=>{
try{
    const fileExists =  fs.readdirSync(`./upload/${req.params.dirDate}/${req.params.dir}`)
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
},errController())

filesRouter.post('/', upload.array("files"), async (req,res, next)=>{
    try{
        const date = new Date()
        fs.mkdirSync(`./upload/${Number(date)}`)
        fs.mkdirSync(`./upload/${Number(date)}/original`)
        fs.mkdirSync(`./upload/${Number(date)}/process`)
        const files = req.files
        files.forEach((v)=>{
            fs.renameSync(`./upload/${v.fileName}`,`./upload/${Number(date)}/original/${v.fileName}`)//missing files ends
            if(!fs.existsSync(`./upload/original/${v.fileName}`))throw {code:500,message:`can't create file`}
        })
        const processFiles = req.files//api from server
        processFiles.forEach((v)=>{
            fs.renameSync(`./upload/${v.fileName}`,`./upload/${Number(date)}/process/${v.fileName}`)//missing files ends
            if(!fs.existsSync(`./upload/process/${v.fileName}`))throw {code:500,message:`can't create file`}
        })
        const isCreated = projectService.createProject({email: req.body.email, root:`./upload/${Number(date)}`,runIspSettings: req.body.runIspSettings,createDate:date})
        if(!isCreated)throw {code:500,message:`can't create project`}  
        res.send({success:true})  
    }
    catch(err){
        req.errCode = err.code
        next()
    }
},errController())

filesRouter.put('/',async (req, res, next)=>{
    try{
        const isUpdate = await projectService.updateProject(`./upload/${req.body.folder}`,req.body.saveSettings)
        if(!isUpdate)throw {code:500,message:`can't update project`}
        res.send({success:true})
    }
    catch(err){
        req.errCode = err.code
        next()
    }
    },errController())

module.exports = filesRouter





