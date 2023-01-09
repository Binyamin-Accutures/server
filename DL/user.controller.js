const userData = require("./user.model");

async function create(data) {
  return await userData.create({email: data.email,password: data.password});
}

async function read(filter) {
  return await userData.find(filter);
}
async function findUser(filter) {
  return await userData.findOne(filter).populate('project');
}

async function readOne(filter) {
  const check= await read(filter);
  return check[0]
}
async function update(id, newData) {
  return await userData.updateOne({ _id: id, newData });
}

async function updateAndReturn(id, newData){
  let data = await userData.findOneAndUpdate({ _id: id, newData})
  return data.value
}

async function addProject(email, data){
  let user = await findUser(email)
  user.project.unshift(data);
}

async function del(id) {
  return await update(id, { isActive: false });
}

module.exports = { create, read, update, del, readOne, findUser, updateAndReturn, addProject};
