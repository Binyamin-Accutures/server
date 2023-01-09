const projectData = require("./project.controller");

async function create(data) {
  return await projectData.create(data);
}

async function read(filter) {
  return await projectData.find(filter);
}
async function readOne(filter) {
  return await projectData.findOne(filter)
}

async function update(id, newData) {
  return await projectData.updateOne({ _id: id, newData });
}

async function updateAndReturn(id, newData){
  let data = await projectData.findOneAndUpdate({ _id: id, newData})
  return data.value
}

async function del(id) {
  return await update(id, { isActive: false });
}

module.exports = { create, read, update, del, readOne, updateAndReturn};
