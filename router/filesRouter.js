const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const fs = require('fs');
const userService = require('../BL/user.service');
const projectService = require('../BL/project.service');
const { sendError } = require('../errController');
const {uploadFiles}= require("../BL/files.service")
const {uploadRewFiles} = require("../BL/files.service")
const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
"https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",
"https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691__340.png"]


filesRouter.get('/', async (req,res)=>{
    try{
        const dirPath = await userService.getUserDirectories(req.send)
            res.send(dirPath)
        }
        catch(err){
            sendError(res,err)
        }
})

filesRouter.get('/:dirDate/:dir', upload.array("files"), async (req,res)=>{
try{
    if(!fs.existsSync(`./upload/${req.params.dirDate}/${req.params.dir}`)) throw {code: 404, message: "path not found"}
    const dir =  fs.readdirSync(`./upload/${req.params.dirDate}/${req.params.dir}`)
    if(!dir)throw {code: 404, message: "path not found"}
    const files = dir.map((v)=>{
        return {name:v, path:`/api/files/upload/${req.params.dirDate}/${req.params.dir}/${v}`}
    })
    res.send({files})
}
catch(err){
    sendError(res,err)
}
})

filesRouter.post('/', upload.any("files"), async (req,res)=>{

    try{
       const src= await uploadRewFiles (req)
     
        res.send({src})  

    }
    catch(err){
        sendError(res,err)
    }
})

filesRouter.put('/',async (req, res)=>{
    try{
        const isUpdate = await projectService.updateProject(`./upload/${req.body.path}`,req.body.saveSettings)
        if(!isUpdate)throw {code:500,message:`can't update project`}
        res.send({success:true})
    }
    catch(err){
        sendError(res,err)
    }
    })

module.exports = filesRouter


