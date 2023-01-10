const userDL =require( '../DL/user.controller')
const auth =  require('../auth')
const bcrypt = require('bcrypt')
const {ChechData} = require('../checkController')

const saltRounds = 10

const login = async (data) => {
    ChechData(data,['email', 'password'])
    let user = await getUser(data.email)
    const bcrypted =bcrypt.compareSync( data.password,user.password)
    if (!bcrypted) throw errMessage.WRONG_PASSWORD
    let token = await auth.createToken(data.email)
    return token
}

const createUser = async (data) => {
    ChechData(data,['email', 'firstPassword', 'secondPassword']);
    let user = await getUser( data.email)
    data.password = bcrypt.hashSync(data.password, saltRounds);
    user = await userDL.create(data)
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    const user =await userDL.readOne({email : email})
    if (!user) throw errMessage.USER_NOT_FOUND;
    return user
}

const getFiles = async (email) => {
    let user = await getUser(email)
    if (!user) throw errMessage.USER_NOT_FOUND;
    return user.projects
} 

const addProject = async(user_id, project)=>{
    const updateRes = await userDL.updateAndReturn(user_id,{$push:{projects:project._id}})
    return updateRes
  }


module.exports = { createUser, getUser, login, getFiles,addProject}