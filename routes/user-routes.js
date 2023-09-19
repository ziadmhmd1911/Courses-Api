const express = require("express");
const router = express.Router();
const multer = require("multer");
const appError = require("../utilis/apperror");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = `user-${Date.now()}.${file.mimetype.split("/")[1]}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const imgType = file.mimetype.split("/")[0];
  if (imgType === "image") {
    cb(null, true);
  } else {
    cb(apperror.create("This File Is Not Supporter", 400), false);
  }
};
const upload = multer({ storage: diskStorage, fileFilter });
const userscontroller = require("../controllers/users.controller");
const verifytoken = require("../middlewares/verifytoken");
const apperror = require("../utilis/apperror");

router.route("/").get(verifytoken, userscontroller.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), userscontroller.register);

router.route("/login").post(userscontroller.login);

module.exports = router;
