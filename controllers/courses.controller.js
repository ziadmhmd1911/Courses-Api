const { validationResult } = require("express-validator");
const Course = require("../models/course.model");
const httpStatusText = require("../utilis/httpstatustext");
const asyncwrapper = require("../middlewares/asyncwrapper");
const appError = require("../utilis/apperror");
const getAllCourses = asyncwrapper(async (req, res) => {
  const { query } = req.query;
  const limit = 10 || query.limit;
  const page = 1 || query.page;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses: courses } });
});

const getSingleCourse = asyncwrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { course: course } });
});

const createCourse = asyncwrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const Error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(Error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncwrapper(async (req, res) => {
  const updatedCourse = await Course.updateOne({_id:req.params.courseId},{$set:{...req.body}});
  return res.status(200).json({status: httpStatusText.SUCCESS,data: { course: updatedCourse }});
});

const deleteCourse = asyncwrapper(async (req, res) => {
    const deletedCourse = await Course.deleteOne({ _id: req.params.courseId });
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
