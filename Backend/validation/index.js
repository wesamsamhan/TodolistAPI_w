const userValidation = require('./user')

module.exports = {
    userValidator: userValidation.userSchema,
    updateUserValidator: userValidation.updateUserSchema,
    signinSchema: userValidation.signinSchema,
    resetPasswordValidator: userValidation.resetPasswordSchema
}