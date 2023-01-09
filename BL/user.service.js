const userDL =require( '../DL/user.controller')
const auth =  require('../auth')
const bcrypt = require('bcrypt')

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

const createUser = async (data) => {
    let user = await getUser({email : data.email})
    if (user){
        throw {code : 400, message : "user exists"}
    }
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    data.password = bcrypt.hashSync(data.password, saltRounds);
    user = await userDL.create(data)
    console.log("user: " +user)
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    return await userDL.readOne({email : email})
}

const getFiles = async (email) => {
    let user = await getUser({email})
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    return user.projects
    
} 


module.exports = { createUser, getUser, login, getFiles}