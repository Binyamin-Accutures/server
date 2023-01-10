const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { errController } = require('../errController');
const projectService = require('../BL/project.service');
const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
"https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",
"https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691__340.png"]

filesRouter.use('/',express.static('upload'))


filesRouter.get('/', async (req,res, next)=>{
    try{
        const filesPath = await userService.getFiles(req.send)
        const files = filesPath.map((v)=>{
            const fileName = v.root.replace("./upload/","")
            return {
                name:fileName                          
            }})
            res.send(files)
        }
        catch(err){
            req.errCode = err
            next()
        }
},errController)

filesRouter.get('/:dirDate/:dir', async (req,res, next)=>{
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
    req.errCode = err
    next()
}
},errController)

filesRouter.post('/', upload.any("files"), async (req,res, next)=>{
    try{
        const user = await userService.getUser(req.body.email)
        if(!user) throw {code:400,message: "user not found"}
        const date = new Date()
        fs.mkdirSync(`./upload/${Number(date)}`)
        fs.mkdirSync(`./upload/${Number(date)}/original`)
        fs.mkdirSync(`./upload/${Number(date)}/process`)
        const files = req.files
        files.forEach((v,i)=>{
            if(v.mimetype ===`image/png`){
            fs.renameSync(`./upload/${v.filename}`,`./upload/${Number(date)}/original/${i}.png`)
            if(!fs.existsSync(`./upload/${Number(date)}/original/${i}.png`))throw {code:500,message:`can't create file`}
          }
          else{
            fs.unlinkSync(`./upload/${v.filename}`)
          }
        })
        //missing api from server
        files.forEach((v,i)=>{
            if(v.mimetype ===`image/png`){
            fs.copyFileSync(`./upload/${Number(date)}/original/${i}.png`,`./upload/${Number(date)}/process/${i}.png`,)
            if(!fs.existsSync(`./upload/${Number(date)}/process/${i}.png`))throw {code:500,message:`can't create file`}
            }
        })
        const isCreated = await projectService.createProject(user._id,{ root:`./upload/${Number(date)}`,runIspSettings: {...req.body },createDate: date})
        if(!isCreated)throw {code:500,message:`can't create project`}
        const urlFiles = fs.readdirSync(`./upload/${Number(date)}/process`).map((v)=>{
            return `/api/files/upload/${req.params.dirDate}/${req.params.dir}/${v}`
        })
        res.send({urlFiles})  
    }
    catch(err){
        req.errCode = err
        next()
    }
},errController)

filesRouter.put('/',async (req, res, next)=>{
    try{
        const isUpdate = await projectService.updateProject(`./upload/${req.body.path}`,req.body.saveSettings)
        if(!isUpdate)throw {code:500,message:`can't update project`}
        res.send({success:true})
    }
    catch(err){
        req.errCode = err
        next()
    }
    },errController)

module.exports = filesRouter





