const jwt = require("jsonwebtoken")
const secreteKey = "narshdnfjdfnfvnfn"

const authenticationMid = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "Token not present" })
        }

        jwt.verify(token, secreteKey, (err, result) => {
            if (err) return res.status(401).send({ status: false, msg: err.message })
            req.userId = result.userId
            console.log(result)
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