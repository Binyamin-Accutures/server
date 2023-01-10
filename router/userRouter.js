const express = require('express');
const userRouter = express.Router()
const userService = require('../BL/user.service');
const auth = require('../auth');

userRouter.post('/',async (req, res) => {
    try {
        const token = await userService.login(req.body);
        res.send({token})
    }
    catch (err) {
        res.status(err.code).send(err.message);
    }
})

userRouter.get('/',auth.validToken, async (req, res) => {
    try {
        const user = await userService.getUser(req.email);
        res.status(200).send({user})
    }
    catch (err) {
        res.status(err.code).send(err.message);
    }
})

userRouter.post('/register',async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(200).send(user)
    }
    catch (err) {
        res.status(err.code).send(err.message);
    }
})


module.exports = userRouter