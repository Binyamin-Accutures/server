const userDL =require( '../DL/user.controller')
const auth =  require('../auth')
const bcrypt = require('bcrypt')
const { log } = require('console')

const saltRounds = 10

const login = async (data) => {
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    
    let user = await getUser(data.email)
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    const bcrypted =bcrypt.compareSync( data.password,user.password)
    if (!bcrypted){
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
    data.password = bcrypt.hashSync(data.password, saltRounds);
    user = await userDL.create(data)
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    const check =await userDL.readOne({email : email})
    return check
}

const getFiles = async (email) => {
    let user = await getUser(email)
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    return user.projects
} 

const addProject = async(email, project)=>{
    let user = await getUser(email)
    if(!user) throw {code:400,message:"user not found"}
    const updateRes = await userDL.updateAndReturn(user._id,{$push:{projects:project._id}})
    return updateRes
  }


module.exports = { createUser, getUser, login, getFiles,addProject}