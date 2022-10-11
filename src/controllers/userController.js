const userModel = require('../models/userModel');
const isValid = require('../utils/validation')
const bcrypt = require('bcrypt');
const aws = require("../utils/aws")
const jwt=require('jsonwebtoken')

const createUser = async (req, res) => {
    try {
        let { fname, lname, email, phone, password, profileImage, address } = req.body

        //validation for emptyBody
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }

        if (!isValid.isEmpty(fname)) {
            return res.status(400).send({ status: false, message: "fname Is Mandatory" });
        }
        if (!isValid.isEmpty(lname)) {
            return res.status(400).send({ status: false, message: "lname Is Mandatory" });
        }
        //validation for email
        if (!isValid.isEmpty(email)) {
            return res.status(400).send({ status: false, message: "email Is Mandatory" });
        }
        if (!isValid.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid Email" });
        }
        //validation for profileImage
        //creating AWS link
        let file = req.files;
        if (file && file.length > 0) {
            const url = await aws.uploadFile(file[0]);
            profileImage = url
        } else {
            return res.status(400).send({ status: false, message: "no profileImage added" });
        }
        //validation for phone 
        if (!isValid.isEmpty(phone)) {
            return res.status(400).send({ status: false, message: "phone Is Mandatory" });
        }
        if (!isValid.isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        }
        //validation for password
        if (!isValid.isEmpty(password)) {
            return res.status(400).send({ status: false, message: "password Is Mandatory" });
        }
        if (!isValid.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        address = JSON.parse(address)


        // //validation for address
        if (Object.prototype.toString.call(address) !== "[object Object]" || Object.keys(address).length == 0) {
            return res.status(400).send({ status: false, message: "Address  Is Mandatory / Object type only " })
        }
        let { shipping, billing } = address



        // //vlidation for shipping
        if (Object.prototype.toString.call(shipping) !== "[object Object]" || Object.keys(shipping).length == 0) {
            return res.status(400).send({ status: false, message: "shipping Is Mandatory / Object type only " })
        }

        if (!isValid.isEmpty(shipping.street)) {
            return res.status(400).send({ status: false, message: "street Is Mandatory" });
        }
        if (!isValid.isEmpty(shipping.city)) {
            return res.status(400).send({ status: false, message: "city Is Mandatory" });
        }
        if (!shipping.pincode) {
            return res.status(400).send({ status: false, message: "pincode Is Mandatory" });
        }
        if (!isValid.isValidPincode(shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "Invalid pincode / Numbers only" })
        }

        //validation for billing
        if (Object.prototype.toString.call(billing) !== "[object Object]" || Object.keys(billing).length == 0) {
            return res.status(400).send({ status: false, message: "billing Is Mandatory / Object type only " })
        }
        if (!isValid.isEmpty(billing.street)) {
            return res.status(400).send({ status: false, message: "street Is Mandatory" });
        }
        if (!isValid.isEmpty(billing.city)) {
            return res.status(400).send({ status: false, message: "city Is Mandatory" });
        }
        if (!billing.pincode) {
            return res.status(400).send({ status: false, message: "pincode Is Mandatory" });
        }
        if (!isValid.isValidPincode(billing.pincode)) {
            return res.status(400).send({ status: false, msg: "Invalid pincode / Numbers only" })
        }

        // Check for the uniqueness of email and phone
        let user = await userModel.find({ $or: [{ email }, { phone }] })
        for (let key of user) {
            if (key.email == email.trim().toLowerCase()) {
                return res.status(409).send({ status: false, message: "Given email is already taken" })
            }
            if (key.phone == phone) {
                return res.status(409).send({ status: false, message: "Given phone is already taken" })
            }
        }
        //requestBody.address=requestBody
        let dataCreted = { fname, lname, email, phone, profileImage, address }
        dataCreted.password = hashedPassword
        let data = await userModel.create(dataCreted)
        return res.status(201).send({ status: true, message: "User created successfully", date: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const login = async (req, res) => {
    try {
      let data = req.body;
      let {email,password}=data
      let userId = false;
      //validation for email
      if (!isValid.isEmpty(email)) {
        return res.status(400).send({ status: false, message: "email Is Mandatory" });
    }
    if (!isValid.isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "Invalid Email" });
    }
    //validation for password
      if (!isValid.isEmpty(password)) {
        return res.status(400).send({ status: false, message: "password Is Mandatory" });
    }
    if (!isValid.isValidPassword(password)) {
        return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
    }
    let user = await userModel.findOne({email});
  
      if (!user) {
        return res.status(404).send({ status: false, message: "there is no user with this email" });
      }
      await bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          userId = user._id;
        }
      });
      if (userId === false) {
        return res.status(401).send({ status: false, message: "password isn't correct" });
      }
      if (userId === false) {
        return res
          .status(401)
          .send({ status: false, message: "password isn't correct" });
      }
  
      const token = jwt.sign({ userId: userId }, "narshdnfjdfnfvnfn", { expiresIn: "1d" });
  
      res.status(200).send({
        status: true,
        message: "User logged in successfully",
        data: { userId, token },
      });
    } 
    catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };

module.exports = {
    createUser,login
}