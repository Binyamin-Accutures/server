const jwt = require('jsonwebtoken');
require('dotenv').config()
const secret = process.env.SECRET

async function createToken (data){

    return jwt.sign({data}, secret, {expiresIn : '1d'})

}

async function validToken (req, res, next) {
    try{
        let data = req.headers.authorization.replace('Bearer ', '');
        let result = jwt.verify(data, secret)
        req.send = result.data
        next();
    } 
    catch(e){
        throw { code : 401, msg : e.msg}
    }  
}

module.exports = {createToken, validToken}