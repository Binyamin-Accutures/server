import userDL from '../DL/user.controller'
import auth from '../auth'
const bcrypt = require('bycrypt')

const saltRounds = 10

const login = async (data) => {
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    
    let user = await getUser({email : data.email})
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    if (!bcrypt.compareSync(user.password, data.password)){
        throw {code: 400, message : "worng password is incorrect"}
    }
    let token = await auth.createToken(data.email)
    return token
}

const register = async (data) => {
    let user = await getUser({email : data.email})
    if (user){
        throw {code : 400, message : "user exists"}
    }
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    bcrypt.hashSync(data.password, saltRounds, function(err, hash) {
        if (err){
                    throw {code: 500, message : "bad bcrypt"}}
        data.password = hash;
    });
    user = await userDL.create({data})
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    return await userDL.findOne({email : email})
}

const getFiles = async (email) => {
    let user = await getUser({email})
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    return user.projects
    
} 


module.exports = { register, getUser, login, getFiles}