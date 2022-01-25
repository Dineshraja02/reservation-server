const route=require('express').Router();
const mongo = require("../mongo");
const service=require("../services/api.sevices");

route.post('/register',service.register);
route.post('/login',service.login)

module.exports = route;