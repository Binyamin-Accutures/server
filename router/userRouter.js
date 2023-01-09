const express = require('express');
const userRouter = express.Router()
const userService = require('../Bl/user.service');
const { errController } = require('../errController');

userRouter.post('/',async (req, res,next) => {
    try {
        const token = await userService.login(req.body);
        if(!token) throw {code: 500, message:"can't crearte token"};
        res.status(200).send({token})
    }
    catch (err) {
        req.errCode = err;
        next()
    }
},errController)



module.exports = userRouter