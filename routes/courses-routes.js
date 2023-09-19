const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");
const { validationScheme } = require("../middlewares/validationScheme");
const verifyToken = require("../middlewares/verifytoken");
const userRoles = require("../utilis/user-roles");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(verifyToken, allowedTo(userRoles.MANAGER) ,validationScheme(), coursesController.createCourse);

router
  .route("/:courseId")
  .get(coursesController.getSingleCourse)
  .patch(coursesController.updateCourse)
  .delete(verifyToken , allowedTo(userRoles.ADMIN, userRoles.MANAGER) ,coursesController.deleteCourse);

module.exports = router;
