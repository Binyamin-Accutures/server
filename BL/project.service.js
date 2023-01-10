
const projDL = require ('../DL/project.controller')
const userService = require ('./user.service')

const getFile = async (root) => {
    let proj = await projDL.readOne({root})
    if (!proj){
        throw {code: 400, message : "no project found"}
    }
    return proj
} 

const createProject = async (user_id, data) =>{
    if (!data.root || !data.runIspSettings || !user_id){
        throw {code: 400, message : "missing data"}
    }
    let newProj = await projDL.create(data)
    let res = await userService.addProject(user_id, newProj)
    return true
}

const updateProject = async (root,saveSettings) =>{
    try{

        if (!root || !saveSettings){
            throw {code: 400, message : "missing data"}
        }
        let proj = await projDL.readOne({root})
        if (!proj){
            throw {code: 400, message : "no project found"}
        }
        let res = await projDL.updateAndReturn(proj._id, {saveSettings})
        return res
    }
    catch(e){
        throw e
    }
}

const getDirName = (path)=>{
    return path.replace("./upload/","")
}

module.exports = { getFile, createProject, updateProject,getDirName}