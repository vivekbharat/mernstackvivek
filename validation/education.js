const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  //data.name = !isEmpty(data.name) ? data.name : "";
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.major = !isEmpty(data.major) ? data.major : "";
  data.from = !isEmpty(data.from) ? data.from : "";


  if (Validator.isEmpty(data.school)) {
    errors.school =  "School Field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree Field is required";
  }

  if (Validator.isEmpty(data.major)) {
    errors.major = "Major Field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date Field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
