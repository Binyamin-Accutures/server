const {userCtrl}=require ("../DL/user.controller") 
const projectsCtrl = require ("../DL/project.controller") 
const userService = require ("./") 

const saveIspObj = async (root,email, obj)=>{
   const exict = await  projectsCtrl.read({root,email}) 
   console.log(exict);
const sentIspObj = await projectsCtrl.update ({user:email, saveSettings:{runIspSettings:obj}})
return sentIspObj
}
const getFile = async (root) => {
    const project = await projDL.readOne({root})
    return project
} 

// const updateProject = async (root,saveSettings) =>{//no error return. //
//     checkData({root:root,saveSettings:saveSettings},["root","saveSettings"])
//     const project = await projDL.readOne({root})
//     const res = await projDL.updateAndReturn(project._id, {saveSettings})
//     return res
// }