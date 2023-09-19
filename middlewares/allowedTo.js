const appError = require("../utilis/apperror");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.create(
          "This User Is Not Allowed To Perform This Action",
          403,
          "fail"
        )
      );
    }
    next();
  };
};
