const {userCtrl}=require ("../DL/user.controller") 
const projectsCtrl = require ("../DL/project.controller") 
const userService = require ("./") 

const saveIspObj = async (root,email, obj)=>{
    const user = await userService.getUser(email)
    if (user){
const sentIspObj = await projectsCtrl.updateProject ({root:root, saveSettings:{runIspSettings:obj}})

    }
    (user._id,{ root:`./${baseDir}`,runIspSettings: {undefined },createDate: date})
}
const getFile = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

const updateProject = async (root,saveSettings) =>{//no error return. //
    checkData({root:root,saveSettings:saveSettings},["root","saveSettings"])
    const project = await projDL.readOne({root})
    const res = await projDL.updateAndReturn(project._id, {saveSettings})
    return res
}