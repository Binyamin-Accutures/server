const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const auth = require('../auth')
const upload = multer({dest:"./uploads"})
const fs = require('fs');
const userData = require('../DL/user.model');
const userService = require('../BL/user.service');

filesRouter.use('/',express.static('uploads'))


filesRouter.get('/', async (req,res)=>{
// const files = await userService.

    const response = fs.readdirSync(req.params.path)
    const files = response.map(v=>{
        if(fs.lstatSync(v).isDirectory()){
                
        }
    })
}) 

filesRouter.post('/', upload.array("files"), async (req,res)=>{

})


filesRouter.put('/:filename',auth.verifyToken,(req, res)=>{
})

module.exports = filesRouter





