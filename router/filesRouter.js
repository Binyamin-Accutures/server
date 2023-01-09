const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const auth = require('../auth')
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userService = require('../BL/user.service');
const { errController } = require('../errController');
errController = require('../errController')

filesRouter.use('/',express.static('uploads'))


filesRouter.get('/', async (req,res, next)=>{
    try{
        const filesPath = await userService.getFiles(req.send.email)
        const files = filesPath.map((v)=>{
            const file = v.root.replace("upload/","").split(".")
            return {
                date:file.pop(),
                name:file.join("."),
                path:file.v.root                            
            }})
            res.send(files)
        }
        catch(err){
            req.errCode = err.code
            next()
        }
},errController())


filesRouter.get('/:path', upload.array("files"), async (req,res, next)=>{
try{
    const dirExists = await fs.readdirSync(`./${req.params.path}`)
    if(!dirExists)throw {code: 404, message: "path not found"}
    res.send({path: req.params.path})
}
catch(err){
    req.errCode = err.code
    next()
}
},errController())

filesRouter.get('/:path/:dir', upload.array("files"), async (req,res, next)=>{
try{
    const fileExists =  fs.readdirSync(`./${req.params.path}/${req.params.dir}`)
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
        fs.
        const files = req.files.map
        projectService.createProject({fileName,s1:{leftBar},})    
    }
    catch(err){

    }
},errController())


filesRouter.put('/:filename',auth.verifyToken,(req, res, next)=>{
    try{

    }
    
    catch(err){
    
    }
    
    
    },errController())

module.exports = filesRouter





