const { log } = require('console')
const projDL = require ('../DL/project.controller')
const userService = require ('./user.service')

const getFile = async (root) => {
    let proj = await projDL.readOne({root})
    if (!proj){
        throw {code: 400, message : "no project found"}
    }
    return proj
} 

const createProject = async (email, data) =>{
    if (!data.root || !data.runIspSettings || !email){
        throw {code: 400, message : "missing data"}
    }
    let newProj = await projDL.create(data)
    let res = await userService.addProject(email, newProj)
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
        throw {code: 500, message : e.message}
    }
}


module.exports = { getFile, createProject, updateProject}