const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");

const UserModel = require("../../models/Auth/UserModel");

const {
  userValidator,
  updateUserValidator,
  signinSchema,
  resetPasswordValidator,
} = require("../../validation");

// @docs Registers
// @access public
// @router public  localhost:5000/api/v1/auth/Register
const Register = async (req, res) => {
  try {
    const { error, value } = userValidator.validate(req.body);

    if (error) {
      //bad req
      return res.status(400).send({ error: error.details[0].message });

    }

    const userExist = await UserModel.findOne({ username: value.username });
    if (userExist) {
      return res.status(400).send("Username or email is already taken!");
    }

    const newUser = new UserModel(value);
    await newUser.save();
//jsonwebtoken.sign(payload, secretOrPrivateKey)
    const token = jsonwebtoken.sign(
      { id: newUser._id },
      process.env.SECRET_KEY
    );

    return res.status(200).json({
      data: newUser,
      token: token,
    });
  } catch {
    return res.status(500).send("Internal server error!");
  }
};

// @access public
// @router public  localhost:5000/api/v1/auth/SignIn
const SignIn = async (req, res, next) => {
  try {
    const { error, value } = signinSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).send({ error: error.details[0].message });
    }

    passport.authenticate("local", (error, user) => {
      if (error) {
        return res.status(500).send({ error });
      }
      if (!user) {
        return res.status(404).json({ message: "Wrong username or password" });
      }

      const token = jsonwebtoken.sign({ id: user._id }, process.env.SECRET_KEY);

      return res.json({
        message: `Success SignIn User`,
        data: user,
        token: token,
      });
    })(req, res, next);
  } catch {
    return res.status(500).send("Internal server error!");
  }
};

// @docs getAllUsers
// @access public
// @router public  localhost:5000/api/v1/auth/GetAllUsers
const getAllUsers = async (req, res) => {
  try {
    await UserModel.find({})
      .then((users) => {
        res.status(200).json({
          result: users.length,
          statusCode: res.statusCode,
          data: users,
        });
      })
      .catch((err) => {
        res
          .status(200)
          .json({ message: err.message, statusCode: res.statusCode });
      });
  } catch {
    res.status(500).send("Internal server error!");
  }
};

// @docs deleteUsers
// @access admin
// @router public  localhost:5000/api/v1/auth/DeleteUsersById/:id
const deleteUsersById = async (req, res) => {
  try {
    const { id } = req.params;

    await UserModel.findByIdAndDelete(id)
      .then((docs) => {
        res
          .status(200)
          .json({ data: docs, message: `Success Deleted User By ${id}` });
      })
      .catch((err) => {
        res.status(404).json({ message: `User not found by id : ${id}` });
      });
  } catch {
    res.status(500).send("Internal server error!");
  }
};

// @docs UpdateUserById
// @access public
// @router public  localhost:5000/api/v1/auth/UpdateUserById/:id
const UpdateUserById = async (req, res) => {
  try {
    const { error, value } = updateUserValidator.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).send({ error: error.details[0].message });
    }

    const { id } = req.params;

    const result = await UserModel.findOneAndUpdate({ _id: id }, value, {
      new: true,
    });

    if (!result) {
      res.status(404).json({ message: `User not found By id : ${id}` });
    } else {
      res .status(200)
        .json({ message: `Success Users Update By id : ${id}`, data: result });
    }
  } catch {
    res.status(500).send("Internal server error!");
  }
};

// @docs UpdateUserById
// @access public
// @router public  localhost:5000/api/v1/auth/ResetUserPassword/:id
const ResetUserPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordValidator.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).send({ error: error.details[0].message });
    }

    const { id } = req.params;

    const result = await UserModel.findOneAndUpdate(
      { _id: id, password: value.oldPassword },
      {
        password: value.newPassword,
      },
      {
        new: true,
      }
    );

    if (!result) {
      res
        .status(404)
        .json({ message: `User not found, check entered password` });
    } else {
      res
        .status(200)
        .json({ message: `Password updated successfully`, data: result });
    }
  } catch {
    res.status(500).send("Internal server error!");
  }
};

module.exports = {
  register: Register,
  SignIn: SignIn,
  getAllUsers: getAllUsers,
  deleteUsersById: deleteUsersById,
  UpdateUserById: UpdateUserById,
  ResetUserPassword: ResetUserPassword,
};
