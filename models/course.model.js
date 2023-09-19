const mongoose = require("mongoose");

const courseScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model('Course', courseScheme);
