const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { errController } = require('../errController');
const projectService = require('../BL/project.service');
const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
"https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",
"https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691__340.png"]

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
},errController)

filesRouter.get('/:dirDate/:dir', async (req,res, next)=>{
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
},errController)

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
        // const urlFiles = fs.readdirSync(`./upload/${Number(date)}/process`)  
        res.send({success:true})  
    }
    catch(err){
        req.errCode = err.code
        next()
    }
},errController)

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
    },errController)

module.exports = filesRouter





