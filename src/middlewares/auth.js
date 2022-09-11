const jwt = require("jsonwebtoken");


//<-----------This function is used for Authenticate an Author------------->//
const authenticate= function ( req, res, next) {
  try{
     let token = req.headers["x-api-key"];        
if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

 let decodedToken = jwt.verify(token, "Secret-Key-preronagorai");
 
if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

if (req.body.authorId  == decodedToken.userId ) return next();
else return res.status(401).send({ status: false, msg: "you are not authorised !" });

//  if ( req.tokenId = decodedToken.userId);
next();
  }
  catch(error){
    res.status(500).send({msg: error.message})
  }
}
  

  // <-----------------This function is used Authorisation of an Author------------->//
  const authorize= function ( req, res, next) {
    try{
      let token = req.headers["x-api-key"];
      
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
  
  let decodedToken = jwt.verify(token, "Secret-Key");

  if (!decodedToken)
  return res.status(401).send({ status: false, msg: "token is invalid" });

   //<-------Passing LoggedIn UserId into Route Handler------>//
  // let userTobeModified =req.body.authorId  
  // let userLoggedIn = decodedToken.userId  
  
    if (req.body.authorId  == decodedToken.userId ) return next();
      else return res.status(401).send({ status: false, msg: "you are not authorised !" });

    }catch(error){
      res.status(500).send({msg: error.message})
    }
  }


module.exports.authenticate = authenticate
module.exports.authorize = authorize