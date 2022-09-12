const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');
const passValidator = require('password-validator');
const emailValidator = require('email-validator')



const createAuthor = async function (req, res) {
    try {
        let author = req.body
        //<------Checking Whether Request Body is empty or not----------->//
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

            //<-------Validation of author Body----------->//

        if (!author.fname) return res.status(400).send({ msg: " First name is required " })
        if (!author.lname) return res.status(400).send({ msg: " Last name is required " })
        if (!author.email) return res.status(400).send({ msg: " email is required " })
        if (!author.password) return res.status(400).send({ msg: " password is required " })
        let titleEnum = ['Mr', 'Mrs', 'Miss']

          //<-------Validation of Title----------->//
        if (!titleEnum.includes(author.title)) {
            res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
        }

         //<-------Validation of email--formate----------->//

        if (!emailValidator.validate(author.email)) {
            return res.status(400).send({ status: false, msg: "Check the format of the given email" })
        }

        //<-------Validation of email--already-present-or-not----------->//

        let emailValidation = await authorModel.findOne({ email: author.email })
        if (emailValidation) {
            return res.status(409).send({ status: false, msg: "This  email  already exists " })
        }
             //<-------Validation of password--minimum-length----------->//
        const schema = new passValidator();
        schema.is().min(6)
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "minimum length of password should be 6 characters" })
        }

        //<-------Validation of password--maximum-length----------->//
        schema.is().max(12)
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "max length of password should be 12 characters" })
        }
          //<-------Validation of password--space-not-allow---------->//
        schema.has().not().spaces()
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "space not allowed in password" })
        }

        let authorCreated = await authorModel.create(author)


        res.status(201).send({ data: authorCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const login = async function (req, res) {
    try {
        let author = req.body
        let email = req.body.email
        let password = req.body.password
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        if (email.trim().length == 0 || password.trim().length == 0) {
            return res.status(400).send({
                status: false,
                msg: "please provide login details",
            });
        }

        if (!email) return res.status(400).send({ msg: " email is required " })
        if (!password) return res.status(400).send({ msg: "  password is required " })


        let loggedAuthor = await authorModel.findOne({ email: email, password: password })
        if (!loggedAuthor) return res.status(404).send({ msg: "Email or Password is Incorrect!" })
            
        
        
        //<------token creation----------->//

        let token = jwt.sign(
            {
                authorId: loggedAuthor._id.toString(),
                batch: "plutonium",
                project: "Blog-Project"
            },
            "Secret-Key" ,{ expiresIn: '12h'}
        )

        res.status(200).send({ msg: "User logged in successfully!", loggedAuthor, token })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}






module.exports.createAuthor = createAuthor;
module.exports.login = login






























// team member navdeep code



// const isValid = function (value) {
//      if (typeof value === 'undefined' || value === null) return false
//      if (typeof value === 'string' && value.trim().length === 0) return false
//      return true;
//  }

// const isValidTitle = function (title) {
//     return ['Mr', 'Mrs', "Miss"].indexOf(title) !== -1
// }

// const createAuthor = async function (req, res) {
//     try {
//         let data = req.body

//         let { fname, lname, title, email, password } = data // Destructuring

//         if (Object.keys(data).length == 0) {
//             res.status(400).send({ status: false, msg: "BAD REQUEST" })
//             return
//         }
//         if (!isValid(fname)) {
//             res.status(400).send({ status: false, msg: "fname is required" })
//             return
//         }
//         if (!isValid(lname)) {
//             res.status(400).send({ status: false, msg: "lname is required" })
//             return
//         }
//         if (!isValid(title)) {
//             res.status(400).send({ status })
//             return
//         }
//         if (!isValidTitle(title)) {
//             res.status(400).send({ status: false, msg: "title should be amoung Mr,Mrs,Miss" })
//             return
//         }
//         if (!isValid(email)) {
//             res.status(400).send({ status: false, msg: "email is required" })
//             return
//         }
//         if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
//             res.status(400).send({ status: false, msg: "email should be valid email address" })
//             return
//         }
//         if (!isValid(password)) {
//             res.status(400).send({ status: false, msg: "password is required" })
//             return
//         }
//         let isEmailAlreadyUsed = await authorModel.findOne({ email })
//         if (isEmailAlreadyUsed) {
//             res.status(400).send({ status: false, msg: "email already used" })
//         }

//         else {
//             let createdAuthor = await authorModel.create(data)
//             res.status(201).send({ data: createdAuthor })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ msg: error.message })
//     }

// }

// const loginAuthor = async function (req, res) {
//     try {
//         let body = req.body
//         let { email, password } = body

//         if (!isValid(email)) {
//             res.status(400).send({ status: false, msg: "email is required" })
//             return
//         }
//         if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
//             res.status(400).send({ status: false, msg: "email should be valid email address" })
//             return
//         }
//         if (!isValid(password)) {
//             res.status(400).send({ status: false, msg: "password is required" })
//             return
//         }

//         let authorDetails = await authorModel.findOne({ email: email, password: password })
//         if (!authorDetails)
//             res.status(404).send({ status: false, msg: "email & password not matched" })
//         else {
//             let token = jwt.sign({ authorId: authorDetails._id }, "Room No-38")
//             res.setHeader("x-api-key", token);
//             res.status(201).send({ status: true, data: token })
//         }
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).send({ msg: error.message })
//     }
// }


