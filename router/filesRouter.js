const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({ dest: "./upload" })
const fs = require('fs');
const userService = require('../BL/user.service');
const projectService = require('../BL/project.service');
const { sendError } = require('../errController');
const { getFilesPathes, openProject } = require('../BL/calibration.service');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFiles, getFileStream } = require('../s3')
const {uploadRewFiles} = require("../BL/files.service");
const { log } = require('console');

const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
    "https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
    "https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
    "https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",
    "https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691__340.png"]

/**
 * @swagger
 * /api/files/images/{key}:
 *  get:
 *    description: get image from bucket
 *    parameters:
 *      - name: key
 *        in: path
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
    try{

        console.log(req.params);
        const key = req.params.key
        const readStream = getFileStream(key).on('error', (err) => {
            console.log(err);
            res.send(err)}) 
        readStream.pipe(res)
    }
    catch(err){
        res.statusCode(err.statusCode)
    }
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
filesRouter.post('/images', upload.any('image'), async (req, res) => {
    const files = req.files
    console.log(files)
    // apply filter
    // resize 
  
    const result = await uploadFiles(files);
    // await unlinkFile(file.path);
    console.log(result);
    const description = req.body.description
    res.send(`/images/${result.Key}`)
})

/**
 * @swagger
 * /api/files/:
 *  get:
 *    description: Use to login need to send email and password
 *    parameters:
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '400':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: array
 */

filesRouter.get('/', async (req, res) => {
    try {
        const dirPath = await userService.getUserDirectories(req.send)
        res.send(dirPath)
    }
    catch (err) {
        sendError(res, err)
    }
})

/**
 * @swagger
 * /api//:dirDate/:dir:
 *  get:
 *    description: Use to login need to send email and password
 *    parameters:
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *      - name: dirDate
 *        in: params
 *        required: true
 *      - name: dir
 *        in: params
 *        required: true
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '400':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 */

filesRouter.get('/:dirDate/:dir', upload.array("files"), async (req, res) => {
    try {
        if (!fs.existsSync(`./upload/${req.params.dirDate}/${req.params.dir}`)) throw { code: 404, message: "path not found" }
        const dir = fs.readdirSync(`./upload/${req.params.dirDate}/${req.params.dir}`)
        if (!dir) throw { code: 404, message: "path not found" }
        const files = dir.map((v) => {
            return { name: v, path: `/api/files/upload/${req.params.dirDate}/${req.params.dir}/${v}` }
        })
        res.send({ files })
    }
    catch (err) {
        sendError(res, err)
    }
})

filesRouter.post('/', upload.any("files"), async (req,res)=>{

    try{
       const src= await uploadRewFiles (req)
     
        res.send({src})

    }
    catch (err) {
        sendError(res, err)
    }
})

filesRouter.put('/', async (req, res) => {
    try {
        const isUpdate = await projectService.updateProject(`./upload/${req.body.path}`, req.body.saveSettings)
        if (!isUpdate) throw { code: 500, message: `can't update project` }
        res.send({ success: true })
    }
    catch (err) {
        sendError(res, err)
    }
})

module.exports = filesRouter
