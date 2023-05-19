const express = require("express");
const mutli = require("connect-multiparty");
const dotenv = require("dotenv");
const morgan = require("morgan");
const Router = require("./Routes/SettignRoutes");
const RouterTask = require("./Routes/MissionRoutes");
const configration = require("./config/database");


module.exports = {
  express,
  mutli,
  dotenv,
  morgan,
  Router,
  RouterTask,
  configration,

};
