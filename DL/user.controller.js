const userData = require("./user.model");

async function creat(data) {
  return await userData.create(data);
}

async function read(filter) {
  return await userData.find(filter);
}
async function findOne(filter) {
  return await userData.findOne(filter).populate('project');
}

async function readOne(filter) {
  return await read(filter)[0];
}
async function update(id, newData) {
  return await userData.updateOne({ _id: id, newData });
}

async function updateAndReturn(id, newData){
  let data = await userData.findOneAndUpdate({ _id: id, newData})
  return data.value
}

async function del(id) {
  return await update(id, { isActive: false });
}

module.exports = { creat, read, update, del, readOne, findOne, updateAndReturn};
