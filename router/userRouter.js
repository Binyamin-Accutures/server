const express = require('express');
const userRouter = express.Router()
const userService = require('../BL/user.service');
const auth = require('../auth');

userRouter.post('/login',async (req, res) => {
    try {
        const token = await userService.login(req.body);
        res.send(token)
    }
    catch (err) {
        sendError(res,err)
    }
})

userRouter.get('/',auth.validToken, async (req, res) => {
    console.log(req.headers);
    try {
        const user = await userService.getUser(req.email);
        res.status(200).send(user)
    }
    catch (err) {
        sendError(res,err)
    }
})


userRouter.post('/register',async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        console.log(user);
        res.status(200).send(user)
    }
    catch (err) {
        sendError(res,err)
    }
})


module.exports = userRouter