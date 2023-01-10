const express = require('express');
const userRouter = express.Router()
const userService = require('../BL/user.service');
const { errController } = require('../errController');
const auth = require('../auth');

userRouter.post('/',async (req, res,next) => {
    try {
        const token = await userService.login(req.body);
        if(!token) throw {code: 500, message:"can't crearte token"};
        res.send({token})
    }
    catch (err) {
        res.send(errControler(err))
    }
})

userRouter.get('/',auth.validToken, async (req, res,next) => {
    try {
        if(!req.send) throw {code: 500, message:"token can't be valid"};
        const user = await userService.getUser(req.body.email);
        if(!user) throw {code: 500, message:"can't crearte token"};
        res.status(200).send({user})
    }
    catch (err) {
        req.errCode = err;
        next()
    }
},errController)

userRouter.post('/register',async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(200).send(user)
    }
    catch (err) {
        res.send(err)
    }
},errController)


module.exports = userRouter