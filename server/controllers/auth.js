const passport = require("passport");

exports.onlyAuthUser = function(req, res, next) {
  // console.log(req)
  // debugger;
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({ errors: { auth: "Not Authenticated!" } });
};

exports.onlyAdmin = function(req, res, next) {
  const user = req.user;
  // debugger
  if (user && user["role"] === "admin") {
    return next();
  }

  return res.status(401).send({ errors: { auth: "Not Authorized!" } });
};
