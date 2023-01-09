const projDL = require ('../DL/project.controller')
const userDL = require ('../DL/user.controller')

const getFile = async (root) => {
    let proj = await projDL.readOne({root})
    if (!proj){
        throw {code: 400, message : "no project found"}
    }
    return proj
} 

const createProject = async (email, data) =>{
    console.log(`email: ${email} ,,, data: ${data}`);
    if (!data.root || !data.runIspSettings || !email){
        throw {code: 400, message : "missing data"}
    }
    let newProj = await projDL.create(data)
    //adding the mongo id to the projects array in the user
    let res = await userDL.addProject(email, newProj._id)
}

const updateProject = async (data) =>{
    if (!data.root || !data.runIspSettings){
        throw {code: 400, message : "missing data"}
    }
    let proj = await projDL.readOne(data)
    if (!proj){
        throw {code: 400, message : "no project found"}
    }
    let res = await projDL.update(proj._id, data)
    return res
}


module.exports = { getFile, createProject, updateProject}