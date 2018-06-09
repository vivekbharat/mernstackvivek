const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function vaidatePostInput(data) {
  let errors = {};

  //data.name = !isEmpty(data.name) ? data.name : "";
  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 Characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "text Field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
