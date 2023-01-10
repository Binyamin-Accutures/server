const jwt = require('jsonwebtoken');
const { errMessage } = require('./errController');
require('dotenv').config()
const secret = process.env.SECRET

async function createToken (data){
    const token = jwt.sign({data}, secret, {expiresIn : '1d'})
    if (!token) throw errMessage.TOKEN_DID_NOT_CREATED
    return token

}

async function validToken (req, res, next) {
    try{
        let result = jwt.verify(req.headers.authorization.replace('Bearer ', ''), secret, {expiresIn : '1d'})
        if(!result.data) throw errMessage.UNAUTHORIZED
        req.email = result.data
        next();
    } 
    catch(e){
        res.send({ code : 401, msg : e.msg})
    }  
}

module.exports = {createToken, validToken}