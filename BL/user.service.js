const userDL =require( '../DL/user.controller')
const auth =  require('../auth')
const bcrypt = require('bcrypt')

const saltRounds = 10

const login = async (data) => {
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    
    let user = await getUser(data.email)
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    if (!bcrypt.compareSync(user.password, data.password)){
        throw {code: 400, message : "worng password is incorrect"}
    }
    let token = await auth.createToken(data.email)
    return token
}

const createUser = async (data) => {
    let user = await getUser( data.email)
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
    console.log({data});
    user = await userDL.create(data)
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    const check =await userDL.readOne({email : email})
    if (check.length==0) return null
    return check
}

const getFiles = async (email) => {
    let user = await getUser(email)
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    return user.projects
    
} 


module.exports = { createUser, getUser, login, getFiles}