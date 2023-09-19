require("dotenv").config();
const express = require("express");
const coursesRouter = require("./routes/courses-routes");
const usersRouter = require("./routes/user-routes");
const httpStatusText = require("./utilis/httpstatustext");
const path = require("node:path");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const url = "mongodb+srv://ziadmhmd:500100022**@learn-mongodb.hyfysm9.mongodb.net/CoursesSystem?retryWrites=true&w=majority";

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(url).then(() => {
  console.log("MongoDB Connected Successfully");
});
app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This Resource Is Not Availabe",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
