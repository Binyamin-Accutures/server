const jwt = require('jsonwebtoken');
require('dotenv').config()
const secret = process.env.SECRET

async function createToken (data){

    return jwt.sign({data}, secret, {expiresIn : '1d'})

}

async function validToken (req, res, next) {
    try{
        let result = jwt.verify(req.headers.authorization.replace('Bearer ', ''), secret, {expiresIn : '1d'})
        req.send = result.data
        next();
    } 
    catch(e){
        throw { code : 401, msg : e.msg}
    }  
}

module.exports = {createToken, validToken}