const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //data.name = !isEmpty(data.name) ? data.name : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";


  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title Field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company Field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date Field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
