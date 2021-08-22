const User = require("../models/user");
const passport = require("passport");
const { compare } = require("bcryptjs");

exports.getCurrentUser = function(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.sendStatus(422);
  }

  return res.json(user);
};

exports.register = function(req, res) {
  const registerData = req.body;

  if (!registerData.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
        message: "Email is required"
      }
    });
  }

  if (!registerData.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
        message: "Password is required"
      }
    });
  }

  if (registerData.password !== registerData.passwordConfirmation) {
    return res.status(422).json({
      errors: {
        password: "is not the same as confirmation password",
        message: "Password is not the same as confirmation password"
      }
    });
  }

  const user = new User(registerData);

  return user.save((errors, savedUser) => {
    if (errors) {
      return res.status(422).json({ errors });
    }

    return res.json(savedUser);
  });
};

exports.login = function(req, res, next) {
  const { email, password } = req.body;
  // console.log(req.body)
  // debugger;
  if (!email) {
    return res.status(422).json({
      errors: {
        email: "is required",
        message: "Email is required"
      }
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: "is required",
        message: "Password is required"
      }
    });
  }

  return passport.authenticate("local", (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      // debugger;
      req.login(passportUser, function(err) {
        if (err) {
          next(err);
        }
        // debugger;
        return res.json(passportUser);
      });
    } else {
      return res.status(422).send({
        errors: {
          message: "Invalid password or email"
        }
      });
    }
  })(req, res, next);
};

exports.resetPassword = function(req, res, next) {
  // debugger;
  const { email, oldPassword, newPassword } = req.body;
  // console.log(req.body)

  User.findOne({ email })
    .populate("author -_id -password -email -role")
    .exec((errors, user) => {
      if (errors) {
        return res.status(422).send(errors);
      } else {
        compare(oldPassword, user.password, function(err, isMatch) {
          if (err) {
            return err;
          } else {
            if (isMatch) {
              user.set({ password: newPassword });
              user.save((err, savedUser) => {
                if (err) {
                  return res.status(422).send(err);
                }
                return res.json({
                  status: "OK",
                  message: "Password has been reseted successfully..."
                });
              });
            } else {
              return res.json({
                status: "NOk",
                message: "Old Password doesn't match with provided Password..."
              });
            }
          }
        });
      }
    });
};

exports.logout = function(req, res) {
  req.logout();
  return res.json({ status: "Session destroyed!" });
};
