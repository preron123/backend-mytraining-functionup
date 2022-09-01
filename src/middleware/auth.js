const jwt = require("jsonwebtoken");

const authentication= function(req,res,next){
  try{
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];
  
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
  
    // console.log(token);
    
    let decodedToken = jwt.verify(token, "functionup-plutonium");
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });
    
    req["decodedToken"]= decodedToken;


    next();
  }catch(error){
    res.status(500).send({msg: error.message})
  }
};

const authorization= function(req,res,next){
  
    let decodedToken= req["decodedToken"]
    
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId

    if(userToBeModified != userLoggedIn) return res.status(403).send({status: false, msg: 'User logged is not allowed to modify the requested users data'})

    next();
}


module.exports.authentication= authentication
module.exports.authorization= authorization