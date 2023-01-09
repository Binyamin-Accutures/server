const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const auth = require('../auth')
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userData = require('../DL/user.model');
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
                
            }})
            res.send(files)
        }
        catch(err){
            req.errCode = err.code
            next()
        }
},errController())


filesRouter.post('/', upload.array("files"), async (req,res, next)=>{
try{

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





