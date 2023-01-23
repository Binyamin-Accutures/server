const express = require("express");
const userRouter = express.Router();
const userService = require("../BL/user.service");
const auth = require("../auth");
const { sendError } = require("../errController");

/**
 * @swagger
 * tags:
 *  name: user
 * /api/user/login:
 *  post:
 *    tags: [user]
 *    description: Use to login need to send email and password
 *    parameters:
 *      - name: user
 *        in: body
 *        description: The user object
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              format: email
 *            password:
 *              type: string
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '400':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 */
userRouter.post("/login", async (req, res) => {
  try {
    const token = await userService.login(req.body);
    res.send(token);
  } catch (err) {
    sendError(res, err);
  }
});

/**
 * @swagger
 * tags:
 *  name: user
 * /api/user/register:
 *  post:
 *    tags: [user]
 *    description: Use to create a new user
 *    parameters:
 *      - name: user
 *        in: body
 *        description: The user object
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              format: email
 *            firstPassword:
 *              type: string
 *            secondPassword:
 *              type: string
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '400':
 *        description: missing data
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 */
userRouter.post("/register", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});

/**
 * @swagger
 * tags:
 *  name: user
 * /api/user/:
 *  get:
 *    tags: [user]
 *    description: Use to get user information
 *    parameters:
 *      - name: Authorization
 *        in: header
 *        description: JWT token for authentication
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: In a successful response return user information
 *      '401':
 *        description: token isn't exists
 *      '400':
 *        description: user not authorized
 */
userRouter.get("/", auth.validToken, async (req, res) => {
  try {
    const user = await userService.getUser(req.email);
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});

/**
 * @swagger
 * tags:
 *  name: user
 * /api/user/forgot:
 *  get:
 *    tags: [user]
 *    description: Use to create a new password
 *    parameters:
 *      - name: email
 *        in: query
 *        description: The user email
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: In a successful response return token
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 *      '400':
 *        description: missing data
 *        content:
 *           application/json:
 *             schema:
 *               type: string
 */

userRouter.get("/forgot", async (req, res) => {
  try {
    const response = await userService.getUserForResetPass(req.query.email);
    res.status(200).send(response);
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/changepassword", async (req, res) => {
  try {
    const user = await userService.updatePass(req.body);
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.get("/checktoken", async (req, res) => {
  try {
    const user = await userService.checkRestePassToken(req.query.token);
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = userRouter;
