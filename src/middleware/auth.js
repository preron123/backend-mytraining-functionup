const jwt = require("jsonwebtoken");

const authUser = function(req, res, next){
  let token = req.headers["x-Auth-token"];
  if (!token) {
    token = req.headers["x-auth-token"];
  }

  if (!token) {
    return res.send({ status: false, msg: "Token must be present" });
  }

  let verifyUser = jwt.verify(token, "functionup-plutonium");

  if (!verifyUser){
    return res.send({ status: false, msg: "Token is incorrect" });
  }
  next();
}

module.exports.authUser = authUser;