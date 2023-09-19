const asyncwrapper = require("../middlewares/asyncwrapper");
const User = require("../models/user.model");
const httpStatusText = require("../utilis/httpstatustext");
const appError = require("../utilis/apperror");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utilis/generateJWT");

const getAllUsers = asyncwrapper(async (req, res) => {
  const query = req.query;

  const limit = 10 || query.limit;
  const page = 1 || query.page;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncwrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "User Already Exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bycrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  });
  // Generate JWT Token
  const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  await newUser.save({}, { __v: false });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncwrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create("Please Provide Email And Password",400,httpStatusText.FAIL);
    return next(error);
  }

  const loggingUser = await User.findOne({ email: email });
  if (!loggingUser) {
    const error = appError.create("User Not Found", 400, httpStatusText.ERROR);
    return next(error);
  }

  //Compare Passwords
  const isMatch = await bycrypt.compare(password, loggingUser.password);
  if (loggingUser && isMatch) {
    const token = await generateJWT({
      email: loggingUser.email,
      id: loggingUser._id,
      role: loggingUser.role
    });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create(
      "Invalid Email Or Password",
      500,
      httpStatusText.ERROR
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};