const express = require('express');
const mainRouter = express.Router()
const userRouter = require('./userRouter')
//const filesRouter = require('./filesRouter')
const auth = require('../auth')

mainRouter.use("/user",userRouter)
//mainRouter.use("/files",auth.validToken,filesRouter)


module.exports = mainRouter