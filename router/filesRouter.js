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
        const filesPath = await userService.getFiles(req.body.email)
        console.log(filesPath)
        const files = filesPath.map((v)=>{
            const fileName = v.root.replace("uploads/","")
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
    console.log(req.params)
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
        console.log(files)
        files.forEach((v,i)=>{
            if(v.mimetype ===`image/png`){
            fs.renameSync(`./uploads/${v.filename}`,`./uploads/${Number(date)}/original/${i}.png`)
            if(!fs.existsSync(`./uploads/${Number(date)}/original/${i}.png`))throw {code:500,message:`can't create file`}
          }
          else{
            fs.unlinkSync(`./uploads/${v.filename}`)
          }
        })
        //const processFiles = req.files//api from server
        files.forEach((v,i)=>{
            fs.copyFileSync(`./uploads/${Number(date)}/original/${i}.png`,`./uploads/${Number(date)}/process/${i}.png`,)
            if(!fs.existsSync(`./uploads/${Number(date)}/process/${i}.png`))throw {code:500,message:`can't create file`}
        })
        const isCreated = projectService.createProject({email: req.body.email,data:{ root:`./uploads/${Number(date)}`,runIspSettings: req.body,createDate:date}})
        console.log(isCreated);
        if(!isCreated)throw {code:500,message:`can't create project`}
        // const urlFiles = fs.readdirSync(`./uploads/${Number(date)}/process`)  
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





