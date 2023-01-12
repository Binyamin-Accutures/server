const userDL = require("../DL/user.controller");
const auth = require("../auth");
const bcrypt = require("bcrypt");
const { checkData } = require("../checkController");
const { errMessage } = require("../errController");
const sendEmail = require("../BL/hellpers/email");
const projectService = require ("./project.service")
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

///////////////////////////////////////////////////////////////
const login = async (data) => {
  checkData(data, ["email", "password"]);
  let user = await userDL.findUserWithPass({ email: data.email });
  const bcrypted = bcrypt.compareSync(data.password, user.password);
  if (!bcrypted) throw errMessage.WORNG_PASSWORD;
  let token = await auth.createToken(data.email);
  return token;
};
///////////////////////////////////////////////////////////////
const createUser = async (data) => {
  checkData(data, ["email", "firstPassword", "secondPassword"]);
  if (data.firstPassword !== data.secondPassword)
    throw errMessage.PASSWORDS_ARE_NOT_EQUAL;
  let user = await userDL.findUser({email:data.email});
  if (user) throw errMessage.USER_ALREADY_REGISTERED;
  data.firstPassword = bcrypt.hashSync(data.firstPassword, saltRounds);
  user = await userDL.create(data);
  let token = await auth.createToken(data.email);
  return token;
};
///////////////////////////////////////////////////////////////
const getUser = async (email) => {
  const user = await userDL.findUser({ email: email });
  if (!user) throw errMessage.USER_NOT_FOUND;
  return user;
};


const getUserAndUpdateTokenAndSendEmailForResetPass = async (email) => {
  let user = await getUser(email);
  const token = bcrypt.hashSync(String(Date.now()), saltRounds);
  const done = await userDL.update(user._id, {
    resetPass: token,
  });
  if (!done) throw "create token for change pass failed";
  const url = `${process.env.BASE_URL}/renew/?token=${token}`;
  const msg = {
    email: email,
    text: "Verify Email",
    subject:"Accutres Verify Email" ,
    html: `<p>Please <a href="${url}">click here</a> to verify your email.</p>`,
  };
  await sendEmail(msg);
  return "email send to verify";
};

const checkRestePassToken = async (token) => {
  const user = await userDL.findUser({ resetPass: token });
  if (!user) throw errMessage.USER_NOT_FOUND;
  userDL.update(user._id, {
    resetPass: "",
  });
  return user;
};

const updatePass = async (data) => {
  checkData(data, ["email", "firstPassword", "secondPassword"]);
  if (data.firstPassword !== data.secondPassword)
    throw errMessage.PASSWORDS_ARE_NOT_EQUAL;
  let user = await getUser(data.email);
  if (!user) throw errMessage.USER_NOT_FOUND;
  data.firstPassword = bcrypt.hashSync(data.firstPassword, saltRounds);
  await userDL.update(user._id,{password:data.firstPassword});
  let token = await auth.createToken(data.email);
  return token;
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
  const user = await userDL.findUser({ email: email });
  if (!user) throw errMessage.USER_NOT_FOUND;
  return user;
};
module.exports = {
  createUser,
  getUser,
  login,
  getUserDirectories,
  addProject,
  getUserAndPopulate,
  getUserAndUpdateTokenAndSendEmailForResetPass,
  checkRestePassToken,
  updatePass,
};
