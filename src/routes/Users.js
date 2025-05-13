const express = require("express");
const { userCreate, userLogin } = require("../controlls/Users");

const User_Route = express.Router();

User_Route.post("/createdUser", userCreate);
User_Route.post("/LoginUser", userLogin);

module.exports = { User_Route };