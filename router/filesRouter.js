const express = require('express');
const filesRouter = express.Router()
const multer = require(`multer`);
const upload = multer({ dest: "./upload" })
const fs = require('fs');
const userService = require('../BL/user.service');
const projectService = require('../BL/project.service');
const { sendError, errMessage } = require('../errController');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFiles, getFileStream, showInFolder, uploadSavegFiles } = require('../s3')
const {uploadRewFiles ,getAllFilesInFolder, saveRunIspObj} = require("../BL/files.service");
const { openProject, setImagesToAccutur } = require('../BL/calibration.service');

const urlImags = ["https://cdn.pixabay.com/photo/2023/01/05/22/36/ai-generated-7700016__340.png",
    "https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__340.png",
    "https://cdn.pixabay.com/photo/2017/02/04/22/37/panther-2038656__340.png",
    "https://cdn.pixabay.com/photo/2015/10/01/19/05/car-967470__340.png",]

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/images/project/{key}:
 *  get:
 *    tags: [files]
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
filesRouter.get('/images/project/:key', (req, res) => {
    try{
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
 * tags:
 *  name: files
 * /api/files/images/{allprojects}:
 *  get:
 *    tags: [files]
 *    description: get project from bucket
 *    parameters:
 *      - name: allprojects
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
filesRouter.get('/images/:allprojects',async (req, res) => {
    try{
        console.log("inside");
        const readStream = await showInFolder(req.params.allprojects)
        console.log(readStream)
        const pathes = readStream.Contents.map(v =>{
            return v.Key.split("/")[1]
        })
        console.log(pathes);
        res.send(pathes)
    }
    catch(err){
        res.send(err)
    }
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/images/uploadimages:
 *  post:
 *    tags: [files]
 *    description: upload image to bucket
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: formData
 *        name: images
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
filesRouter.post('/images/uploadimages', upload.any('images'), async (req, res) => {
    res.send(`we get images`)
    const result = await uploadFiles(files,`${req.email}/${Date.now()}}`);
    files.forEach(async file =>{
        await unlinkFile(file.path);
    })
    console.log(result);
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/images/runisp:
 *  put:
 *    tags: [files]
 *    description: upload run isp settings
 *    parameters:
 *      - name: user
 *        in: body
 *        description: The user object
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            root:
 *              type: string
 *              description: the path of project folder
 *            runIspSettings:
 *              type: object
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
filesRouter.put('/images/runisp', async (req,res)=>{
    try{
       const project = await saveRunIspObj({root:req.body.root,runIspSettings:req.body.runIspSettings})
       const urlResults = await setImagesToAccutur({project})
       res.send({src:urlImags})  
    }
    catch(err){
        sendError(res,err)
    }
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/images/saveImagess:
 *  post:
 *    tags: [files]
 *    description: upload image to bucket
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: formData
 *        name: images
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

filesRouter.put("/images/saveImages",upload.any(), async (req, res) => {
    //update the db
    //set to the claod
    try{
        const project = await projectService.updateProject(req.body.root,{saveSettings:req.body.saveSettings})
        res.send(project)
        const files = req.body.files
        await uploadSavegFiles(files,`${project.root}/process/${Date.now()}}}`);
        files.forEach(async file =>{
            await unlinkFile(file.path);
         })
        
    }
    catch(err) {
        sendError(res,err)
    }
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/:
 *  post:
 *    tags: [files]
 *    description: upload image 
 *    consumes:
 *      - multiple/form-data
 *    parameters:
 *      - in: formData
 *        name: files
 *        type: file
 *      - in: formData
 *        name: files
 *        type: file
 *      - in: formData
 *        name: files
 *        type: file
 *      - in: formData
 *        name: files
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
filesRouter.post('/', upload.any(), async (req,res)=>{
    try{
       const project= await uploadRewFiles({email:req.email,files:req.files})
       res.send(project)  
    }
    catch (err) {
        sendError(res, err)
    }
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/projects:
 *  get:
 *    tags: [files]
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
filesRouter.get('/projects', async (req, res) => {
    try {
        const dirPath = await userService.getUserDirectories(req.email)
        res.send(dirPath)
    }
    catch (err) {
        sendError(res, err)
    }
})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/{projectName}/{folder}:
 *  get:
 *    tags: [files]
 *    description: Use to login need to send email and password
 *    parameters:
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *      - name: projectName
 *        in: path
 *        required: true
 *      - name: folder
 *        in: path
 *        required: true
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '404':
 *        description: not found
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 */
filesRouter.get('/:projectName/:folder', async (req,res)=>{
    try{
    const requestedFolder = `upload/${req.email}/${req.params.projectName}/${req.params.folder}`
    
        const files =await getAllFilesInFolder(requestedFolder)
        res.send(files)
    }
    catch(err){
        sendError(res,err)
    }

})

/**
 * @swagger
 * tags:
 *  name: files
 * /api/files/runisp:
 *  put:
 *    tags: [files]
 *    description: upload run isp settings
 *    parameters:
 *      - name: user
 *        in: body
 *        description: The user object
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            root:
 *              type: string
 *              description: the path of project folder
 *            runIspSettings:
 *              type: object
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
filesRouter.put('/runisp', async (req,res)=>{
    try{
       const src= await saveRunIspObj({root:req.body.root,runIspSettings:req.body.runIspSettings})
       //requset from accutur
       //update the urlAfterRunIsp in project's DB
       res.send({src:urlImags})  
    }
    catch(err){
        sendError(res,err)
    }
})

/**
 * @swagger
 * tags:
 *   name: files
 * /api/files/saveSettings:
 *  put:
 *    tags: [files]
 *    description: Use to save the settings of the right bar
 *    parameters:
 *      - name: rightBar
 *        in: body
 *        description: the right bar object
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            root:
 *              type: string
 *              description: the path of project folder
 *            saveSettings:
 *              type: object
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
 */
filesRouter.put('/saveSettings',async (req, res) => {
    try {
        await projectService.updateProject(req.body.root,req.body.saveSettings)
        res.send("success")
    }
    catch (err) {
        sendError(res, err)
    }
})

module.exports = filesRouter
