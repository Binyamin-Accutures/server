const userDL =require( '../DL/user.controller')
const auth =  require('../auth')
const bcrypt = require('bcrypt')
const {checkData} = require('../checkController')
const { errMessage } = require('../errController')


const saltRounds = 10

const login = async (data) => {
    checkData(data,['email', 'password'])
    let user = await getUser(data.email)
    const bcrypted =bcrypt.compareSync( data.password,user.password)
    if (!bcrypted) throw errMessage.WRONG_PASSWORD
    let token = await auth.createToken(data.email)
    return token
}

const createUser = async (data) => {
    checkData(data,['email', 'firstPassword', 'secondPassword']);
    if(data.firstPassword!==data.secondPassword) throw errMessage.PASSWORDS_ARE_NOT_EQUAL
    let user = await getUser( data.email)
    data.password = bcrypt.hashSync(data.firsrPassword, saltRounds);
    user = await userDL.create(data)
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    const user =await userDL.findUser({email : email})
    if (!user) throw errMessage.USER_NOT_FOUND;
    return user
}

const getUserDirectories = async (email) => {
    let user = await getUser(email)
    const directories = user.projects.map((v)=>{
        let dirName = projectService.getDirName(v.root)
        return {
            name:dirName                          
        }})
        return directories
} 

const addProject = async(user_id, project)=>{
    const updateRes = await userDL.updateAndReturn(user_id,{$push:{projects:project._id}})
    return updateRes
  }


module.exports = { createUser, getUser, login, getUserDirectories,addProject}