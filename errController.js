const err = (c, m) => {
  return { code: c, message: m };
};

const errMessage = Object.freeze({
  MISSING_DATA: err(400, "missing data"),
  USER_NOT_FOUND: err(400, "user not found"),
  USER_ALREADY_REGISTERED: err(400, "user already registered"),
  USER_NOT_REGISTERED: err(400, "user not registered"),
  SUCCESS: err(200, "success"),
  UNAUTHORIZED: err(401, "you need to login first"),
  WORNG_PASSWORD: err(400, "password is not correct"),
  PASSWORDS_ARE_NOT_EQUAL: err(400, "passwords are not equal"),
  TOKEN_DID_NOT_CREATED: err(401, "token didn't created"),
  PROJECT_NOT_FOUND: err(400, "project not found"),
});

const sendError = (res, err) => {
  res.status(err.code).send(err.message);
};
module.exports = {
  errMessage,
  sendError,
};
