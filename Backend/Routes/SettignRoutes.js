const express = require("express");
const service_auth = require("../services/Auth/AuthControllar");
const router = express.Router();
const { checkAuthentication } = require("../passport-options");

//Auth Controllar Api Service
router.post("/Register", service_auth.register);
router.post("/SignIn", service_auth.SignIn);
router.get("/GetAllUsers", checkAuthentication, service_auth.getAllUsers);
router.delete(
  "/DeleteUsersById/:id",
  checkAuthentication,
  service_auth.deleteUsersById
);
router.post(
  "/UpdateUserById/:id",
  checkAuthentication,
  service_auth.UpdateUserById
);
router.post(
  "/ResetUserPassword/:id",
  checkAuthentication,
  service_auth.ResetUserPassword
);

//Tasks Controllar Api Service

module.exports = router;
