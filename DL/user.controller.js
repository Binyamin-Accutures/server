const userData = require("./user.model");


async function create(data) {
  return await userData.create({email: data.email,password: data.firstPassword});
}

async function read(filter) {
  return await userData.find(filter).populate("projects");
}
async function findUser(filter) {
  return await userData.findOne(filter).populate('projects');
}


async function update(id, newData) {
  return await userData.updateOne({ _id: id}, newData,{new:true}).populate("projects")
}

async function updateAndReturn(id, newData){
  let data = await userData.findOneAndUpdate({ _id: id},newData,{new:true}).populate("projects")
  return data
}

async function del(id) {
  return await update(id, { isActive: false });
}

module.exports = { create, read, update, del, findUser, updateAndReturn};
