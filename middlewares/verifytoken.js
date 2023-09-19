const jwt = require("jsonwebtoken");
const appError = require("../utilis/apperror");
const httpStatusText = require("../utilis/httpstatustext");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    const error = appError.create(
      "Token Is Required",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  try {
    let currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, httpStatusText.FAIL);
    return next(error);
  }
};

module.exports = verifyToken;
