exports.getErrors = function (err, type = "others") {
  let error = [];
  /*
    errors: [{ message: ''}, {message: ''}]
  */
  if(err.name && err.name == "SequelizeUniqueConstraintError") {
    err.errors.forEach( err_ => {
      error.push({ message: err_.message});
    })
    return error;

  } else if(err.errors && err.name == "SequelizeValidationError") {
    err.errors.forEach( err_ => {
      error.push({ message: err_.message});
    })
    return error;

  } else if(type=="default") {
    err.forEach( err_ => {
      error.push({ message: err_.msg })
    })
    return error;

  } else {
    error.push({ message: "There is a problem, please contact the administrator" })
    return error;
  }

}
