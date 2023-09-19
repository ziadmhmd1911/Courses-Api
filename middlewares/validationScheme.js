const { body } = require("express-validator");

const validationScheme = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title Is Required")
      .isLength({ min: 2 })
      .withMessage("Title Length Should be at least 2 chars"),
    body("price").notEmpty().withMessage("Price Is Required"),
  ];
};

module.exports = {
  validationScheme,
};
