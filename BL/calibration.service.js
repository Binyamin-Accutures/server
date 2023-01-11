const { errMessage } = require("../errController")
const { getProject, createProject, updateProjectById } = require("./project.service")
const { getUser, updateUser } = require("./user.service")

const getFilesPathes = async (files)=>{
    //const urlFromGoodGuys = await axios.post('GoodGuys',{body: files})
    const urlFromGoodGuys = files.map(file=>file.path)
    if(!urlFromGoodGuys.length > 0) throw errMessage.CAN_NOT_GET_URL
    return urlFromGoodGuys
}

const openProject = async (files,urlAfterRunIsp,data) => {
   const user = await getUser(data.email)
   const projectId = await createProject(user._id,{runIspSettings:data.runIspSettings,urlAfterRunIsp})
   await uploadFiles(files,`${user._id}/${projectId}/original/`)
   await updateProjectById(projectId,{root:`${user._id}/${projectId}`}) 
   //delete files
   return errMessage.SUCCESS 

}

const saveSettings = async (folder,data) => {
    const project = await getProject(data.projectPath)
    const user = await getUser(data.email)
    await putFiles([folder.zipPath,folder.pdfPath],`${user._id}/${project._id}/process/${Date.now()}`) 
    await updateUser(user._id,{saveSettings:data.saveSettings})
    //delete files
    return errMessage.SUCCESS
}

// const getPathes = ()

module.exports={getFilesPathes,saveSettings,openProject}