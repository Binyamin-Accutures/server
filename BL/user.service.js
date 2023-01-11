const userDL = require("../DL/user.controller");
const auth = require("../auth");
const bcrypt = require("bcrypt");
const { checkData } = require("../checkController");
const { errMessage } = require("../errController");
const projectService = require ("./project.service")
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const login = async (data) => {
  checkData(data, ["email", "password"]);
  let user = await userDL.findUserWithPass({email:data.email});
  const bcrypted = bcrypt.compareSync(data.password, user.password);
  if (!bcrypted) throw errMessage.WORNG_PASSWORD;
  let token = await auth.createToken(data.email);
  return token;
};

const createUser = async (data) => {
  checkData(data, ["email", "firstPassword", "secondPassword"]);
  if (data.firstPassword !== data.secondPassword)
    throw errMessage.PASSWORDS_ARE_NOT_EQUAL;
  let user = await userDL.findUser({ email: data.email });
  if (user) throw errMessage.USER_ALREADY_REGISTERED;
  data.firstPassword = bcrypt.hashSync(data.firstPassword, saltRounds);
  user = await userDL.create(data);
  let token = await auth.createToken(data.email);
  return token;
};

const getUser = async (email) => {
  const user = await userDL.findUser({ email: email });
  if (!user) throw errMessage.USER_NOT_FOUND;
  return user;
};

const getUserAndUpdateTokenForResetPass = async (email) => {
 const user =  await getUser(email);
  const token = bcrypt.hashSync(Date.now.toString(), saltRounds);
  await userDL.updateProj(user._id, {
    resetPass: token,
  });
};

const getUserDirectories = async (email) => {
  let user = await getUser(email);
  const directories = user.projects.map((v) => {return {dirName: projectService.getDirName(v.root)}})
  return directories;
};

const addProject = async (user_id, project) => {
  const updateRes = await userDL.updateAndReturn(user_id, {
    $push: { projects: project._id },
  });
  return updateRes;
};

const updateUser = async (user_id,newData) => {
  const updateRes = await userDL.updateAndReturn(user_id,newData);
  return updateRes;
}

const getUserAndPopulate = async (email) => {
  const user = await userDL.findUser({email : email})
    if (!user) throw errMessage.USER_NOT_FOUND;
    return user
}
module.exports = {updateUser, createUser, getUser, login, getUserDirectories, addProject, getUserAndPopulate, getUserAndUpdateTokenForResetPass };

