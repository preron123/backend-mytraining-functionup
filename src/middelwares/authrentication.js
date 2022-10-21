const jwt = require("jsonwebtoken")
const secreteKey = "narshdnfjdfnfvnfn"

const authenticationMid = (req, res, next) => {
    try {
        let bearerHeader = req.headers.authorization;
    if(typeof bearerHeader == "undefined") return res.status(400).send({ status: false, message: "Token is missing" });
    
    let bearerToken = bearerHeader.split(' ')
    let token = bearerToken[1];
        jwt.verify(token, secreteKey, (err, result) => {
            if (err) return res.status(401).send({ status: false, msg: err.message })
            req.userId = result.userId
            next()
        }
        )
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = {
    authenticationMid
}