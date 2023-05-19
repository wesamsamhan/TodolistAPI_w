const express = require("express");
const imports = require("../import");
const passport = require("passport");
const cors = require("cors");

module.exports = (app) => {
  app.use(cors()); // تكوين CORS بالسماح بجميع الأصول والطرق

  app.use((req, res, next) => {
    next();
  });

  app.use(express.json());
  app.use(imports.mutli());
  app.use(passport.initialize());
};
