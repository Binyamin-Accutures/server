const { errMessage } = require("../errController");
const projectData = require("./project.model");

async function create(data) {
  return await projectData.create(data);
}

async function read(filter) {
  
  return await projectData.find(filter);
}

async function readOne(filter) {
  const res =await projectData.findOne(filter)
  if(!res) throw errMessage.PROJECT_NOT_FOUND
  return res
}

async function update(id, newData) {
  return await projectData.updateOne({ _id: id}, newData);
}

async function updateAndReturn(_id, newData){
  let data = await projectData.findOneAndUpdate({ _id:_id}, newData,{new:true})
  if(!data) throw errMessage.PROJECT_NOT_FOUND
  return data
}

async function updateAndReturnByAnyFilter(filter, newData){
  let data = await projectData.findOneAndUpdate(filter, newData,{new:true})
  if(!data) throw errMessage.PROJECT_NOT_FOUND
  return data
}

async function del(id) {
  return await update(id, { isActive: false });
}

module.exports = { create, read, update, del, readOne, updateAndReturn,updateAndReturnByAnyFilter};
