const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({dest:"./upload"})
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const userService = require('../BL/user.service');
const projectService = require('../BL/project.service');
const { sendError } = require('../errController');

const {uploadRewFiles, saveIspObj,uploadFiles} = require("../BL/files.service")
const { uploadFile, getFileStream } = require('../s3')

const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
"https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
"https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",
"https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691__340.png"]

//f876eeb987f5babaa39d4649c4fdba20
/**
 * @swagger
 * /api/files/images/:key:
 *  get:
 *    description: get image from bucket
 *    parameters:
 *      - name: key
 *        in: params
 *        description: key of img
 *        required: true
 *        schema:
 *          type: string
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: In a successful response return src of the image
 *        content:
 *           application/octet-stream:
 *             schema: 
 *               type: string
 *               format: binary
 */
filesRouter.get('/images/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)

    readStream.pipe(res)
})

/**
 * @swagger
 * /api/files/images:
 *  post:
 *    description: upload image to bucket
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: formData
 *        name: image
 *        type: file
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: In a successful response return success message
 *        content:
 *           application/json:
 *             schema: 
 *               type: string 
 */
filesRouter.post('/images', upload.single('image'), async (req, res) => {
    const file = req.file
    console.log(file)
  
    // apply filter
    // resize 
  
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    const description = req.body.description
    res.send(`/images/${result.Key}`)
})
  
  
  


filesRouter.get('/upload/:Email/:dir/original/', upload.array("files"), async (req,res)=>{
    try{
        if(!fs.existsSync(`./upload/${req.params.Email}/${req.params.dir}/original/`)) throw {code: 404, message: "path not found"}
        const dir =  fs.readdirSync(`./upload/${req.params.Email}/${req.params.dir}`)
        if(!dir)throw {code: 404, message: "path not found"}
        const files = dir.map((v)=>{
            return {name:v, path:`/api/files/upload/${req.params.Email}/${req.params.dir}/original/${v}`}
        })
        res.send({files})
    }
    catch(err){
        sendError(res,err)
    }

})
filesRouter.get('/upload/:Email/:dir/process/', upload.array("files"), async (req,res)=>{
    try{
        if(!fs.existsSync(`./upload/${req.params.Email}/${req.params.dir}/process/`)) throw {code: 404, message: "path not found"}
        const dir =  fs.readdirSync(`./upload/${req.params.Email}/${req.params.dir}/process`)
        if(!dir)throw {code: 404, message: "path not found"}
        const files = dir.map((v)=>{
            return {name:v, path:`/api/files/upload/${req.params.Email}/${req.params.dir}/process/${v}`}
        })
        res.send({files})
    }
    catch(err){
        sendError(res,err)
    }

})



filesRouter.get('/', async (req,res)=>{
    try{
        const dirPath = await userService.getUserDirectories(req.send)
            res.send(dirPath)
        }
        catch(err){
            sendError(res,err)
        }
})

filesRouter.post('/test',upload.any("files"), async (req,res)=>{

    try{
        const dirPath = req.files.map(v=>v.path)
            res.send(dirPath)
        }
        catch(err){
            sendError(res,err)
        }
})


// filesRouter.get('/:dirDate/:dir', upload.array("files"), async (req,res)=>{
// try{
//     if(!fs.existsSync(`./upload/${req.params.dirDate}/${req.params.dir}`)) throw {code: 404, message: "path not found"}
//     const dir =  fs.readdirSync(`./upload/${req.params.dirDate}/${req.params.dir}`)
//     if(!dir)throw {code: 404, message: "path not found"}
//     const files = dir.map((v)=>{
//         return {name:v, path:`/api/files/upload/${req.params.dirDate}/${req.params.dir}/${v}`}
//     })
//     res.send({files})
// }
// catch(err){
//     sendError(res,err)
// }
// })


filesRouter.post('/runisp', async (req,res)=>{

    try{
       const src= await saveIspObj (req.body)
       res.send({src})  
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
