const Joi = require("@hapi/joi");

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().required().min(3).max(10),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$"))
    .message(
      "Password must be >= 8 digits and contains lower, upper and number digits"
    )
    .required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().required().min(3).max(10),
});

const signinSchema = Joi.object({
  username: Joi.string().alphanum().required().min(3).max(10),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$"))
    .message(
      "Password must be >= 8 digits and contains lower, upper and number digits"
    )
    .required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("newPassword"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

module.exports = {
  userSchema,
  updateUserSchema,
  signinSchema,
  resetPasswordSchema,
};
