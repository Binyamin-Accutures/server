const { checkData } = require('../checkController')
const projDL = require ('../DL/project.controller')
const userDL = require('../DL/user.controller')
const { errMessage } = require('../errController')

const getProject = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

const createProject = async (user_id, data) =>{
    checkData({user_id,...data},["user_id","root","createDate"])
    const newProject = await projDL.create(data)
    await userDL.updateAndReturn(user_id, {
        $push: { projects: newProject._id },
      });
    return newProject
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

module.exports = {createProject, updateProject,getDirName,getProject,updateProjectById }