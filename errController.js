const err = (c, m) => {
  return { code: c, message: m };
};

const errMessage = Object.freeze({
  MISSING_DATA: err(400, "missing data"),
  USER_NOT_FOUND: err(400, "user not found"),
  USER_NOT_AQCTIVE: err(400, "user not active"),
  USER_ALREADY_REGISTERED: err(400, "user already registered"),
  USER_NOT_REGISTERED: err(400, "user not registered"),
  SUCCESS: err(200, "success"),
  UNAUTHORIZED: err(401, "you need to login first"),
  WORNG_PASSWORD: err(400, "password is not correct"),
  PASSWORDS_ARE_NOT_EQUAL: err(400, "passwords are not equal"),
  TOKEN_DID_NOT_CREATED: err(401, "token didn't created"),
  PROJECT_NOT_FOUND: err(400, "project not found"),
  CAN_NOT_GET_URL: err(999, "can't get url"),
  CAN_NOT_CREATE_FOLDER: err(999, "can't create folder"),
});

const sendError = (res, err) => {
  console.log(err);
  res.status(err.code || 500).send(err.message || "try agien later");
};
module.exports = {
  errMessage,
  sendError,
};
