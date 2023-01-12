const { checkData } = require('../checkController')
const projDL = require ('../DL/project.controller')
// const { errMessage } = require('../errController')
const userService = require (`./user.service`)
const userDL = require("../DL/user.controller");


const getFile = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

const createProject = async (user_id, data) =>{
    checkData({user_id,...data},["root", "runIspSettings"])
    const newProject = await projDL.create(data)
    const updateRes = await userDL.updateAndReturn(user_id, {
        $push: { projects: newProject._id },
      });
      return updateRes;
}

const updateProject = async (root,saveSettings) =>{
    checkData({root:root,saveSettings:saveSettings},["root","saveSettings"])
    const project = await projDL.readOne({root})
    const res = await projDL.updateAndReturn(project._id, {saveSettings})
    return res
}

const getDirName = (path)=>{
    return path.replace("./upload/","")
}

module.exports = { getFile, createProject, updateProject,getDirName}