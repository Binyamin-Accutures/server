const {userCtrl}=require ("../DL/user.controller") 
const projectsCtrl = require ("../DL/project.controller") 
const userService = require ("./") 

const saveIspObj = async (email, obj)=>{
    const user = await userService.getUser(req.email)
    if (user){
const sentIspObj = await createProject(user.)

    }

}

const createProject = async (user_id, data) =>{
    checkData({user_id,...data},["root", "runIspSettings"])
    const newProject = await projDL.create(data)
    const res = await userService.addProject(user_id, newProject)
    return errMessage.SUCCESS
}