const { checkData } = require('../checkController')
const projDL = require ('../DL/project.controller')
const { errMessage } = require('../errController')
const userService = require ('./user.service')

const getFile = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

const getProject = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

const createProject = async (user_id, data) =>{
    checkData({user_id,...data},["user_id", "runIspSettings","urlAfterRunIsp"])
    const newProject = await projDL.create(data)
    await userService.addProject(user_id, newProject)
    return newProject._id
}

const updateProject = async (root,saveSettings) =>{
    checkData({root:root,saveSettings:saveSettings},["root","saveSettings"])
    const project = await projDL.readOne({root})
    const res = await projDL.updateAndReturn(project._id, {saveSettings})
    return res
}


const updateProjectById = async (_id,newData) =>{
    checkData({_id,saveSettings},["_id","newData"])
    const res = await projDL.updateAndReturn(_id, newData)
    return res
}

const getDirName = (path)=>{
    return path.replace("./upload/","")
}

module.exports = { getFile, createProject, updateProject,getDirName,getProject,updateProjectById }