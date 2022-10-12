const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const aws = require("../utils/aws")
const jwt = require('jsonwebtoken')
const { isEmpty, isValidEmail, isValidPhone, isValidPassword, isValidPincode, isValidObjectId,isValidName } = require('../utils/validation')


const createUser = async (req, res) => {
    try {
        let { fname, lname, email, phone, password, profileImage, address } = req.body

        //validation for emptyBody
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }

        if (!isEmpty(fname)) {
            return res.status(400).send({ status: false, message: "fname Is Mandatory/String only" });
        }
        if (!isValidName(fname)) {
            return res.status(400).send({ status: false, message: "fname Is Mandatory/String only" });
        }
        
        if (!isEmpty(lname)) {
            return res.status(400).send({ status: false, message: "lname Is Mandatory/String only" });
        }
        if (!isValidName(lname)) {
            return res.status(400).send({ status: false, message: "lname Is Mandatory/String only" });
        }
        //validation for email
        if (!isEmpty(email)) {
            return res.status(400).send({ status: false, message: "email Is Mandatory/String only" });
        }
        if (!isValidEmail(email)) {
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
        if (!isEmpty(phone)) {
            return res.status(400).send({ status: false, message: "phone Is Mandatory/String only" });
        }
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        }
        //validation for password
        if (!isEmpty(password)) {
            return res.status(400).send({ status: false, message: "password Is Mandatory/String only" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }
        //bcrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // //validation for address
        address = JSON.parse(address)    //simple obj me converte karliye  
        if (Object.prototype.toString.call(address) !== "[object Object]" || Object.keys(address).length == 0) {
            return res.status(400).send({ status: false, message: "Address  Is Mandatory / Object type only " })
        }

        let { shipping, billing } = address
        // //vlidation for shipping
        if (Object.prototype.toString.call(shipping) !== "[object Object]" || Object.keys(shipping).length == 0) {
            return res.status(400).send({ status: false, message: "shipping Is Mandatory / Object type only " })
        }

        if (!isEmpty(shipping.street)) {
            return res.status(400).send({ status: false, message: "street Is Mandatory/String only" });
        }
        if (!isEmpty(shipping.city)) {
            return res.status(400).send({ status: false, message: "city Is Mandatory/String only" });
        }
        if (!shipping.pincode) {
            return res.status(400).send({ status: false, message: "pincode Is Mandatory" });
        }
        if (!isValidPincode(shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "Invalid pincode / Numbers only" })
        }

        //validation for billing
        if (Object.prototype.toString.call(billing) !== "[object Object]" || Object.keys(billing).length == 0) {
            return res.status(400).send({ status: false, message: "billing Is Mandatory / Object type only " })
        }
        if (!isEmpty(billing.street)) {
            return res.status(400).send({ status: false, message: "street Is Mandatory/String only" });
        }
        if (!isEmpty(billing.city)) {
            return res.status(400).send({ status: false, message: "city Is Mandatory/String only" });
        }
        if (!billing.pincode) {
            return res.status(400).send({ status: false, message: "pincode Is Mandatory" });
        }
        if (!isValidPincode(billing.pincode)) {
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
//===============================================================login====================================//
const login = async (req, res) => {
    try {
        let data = req.body;
        let { email, password } = data

        //validation for email
        if (!isEmpty(email)) {
            return res.status(400).send({ status: false, message: "email Is Mandatory/String only" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid Email" });
        }
        //validation for password
        if (!isEmpty(password)) {
            return res.status(400).send({ status: false, message: "password Is Mandatory/String only" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" });
        }
        let correctPass = await bcrypt.compare(password, user.password)

        if (!correctPass) {
            return res.status(400).send({ status: false, message: "Invalid Password" });
        }
        let userId = user._id;
        const token = jwt.sign({ userId: userId }, "narshdnfjdfnfvnfn", { expiresIn: "1d" });
        res.status(200).send({ status: true, message: "User logged in successfully", data: { userId: userId, token } });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


const getUser = async (req, res) => {
    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        let findUser = await userModel.findById(userId)
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not Found" })
        }

        return res.status(200).send({ status: true, message: "User profile details", data: findUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        let findUser = await userModel.findById(userId)
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not Found" })
        }
        let { fname, lname, email, phone, password, profileImage, address } = req.body

        //authrentication
        if (req.userId !== userId) {
            return res.status(403).send({ status: false, message: "Authorization failed" });
        }
        //validation for emptyBody
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }

        if (fname) {
            if (!isEmpty(fname)) {
                return res.status(400).send({ status: false, message: "fname Is Invalid/String only" });
            }
        }
        if (lname) {
            if (!isEmpty(lname)) {
                return res.status(400).send({ status: false, message: "lname Is Invalid/String only" });
            }
        }
        //validation for email
        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "Invalid Email" });
            }
        }
        //validation for profileImage
        //creating AWS link
        let file = req.files;
        if (profileImage) {
            if (file && file.length > 0) {
                const url = await aws.uploadFile(file[0]);
                profileImage = url
            } else {
                return res.status(400).send({ status: false, message: "no profileImage added" });
            }
        }
        //validation for phone 
        if (phone) {
            if (!isValidPhone(phone)) {
                return res.status(400).send({ status: false, message: "Invalid phone" });
            }
        }
        //validation for password
        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
            }
            const salt = await bcrypt.genSalt(10)
            var hashedPassword = await bcrypt.hash(password, salt)
        }

        //validation for address
        if (address) {
            address = JSON.parse(address)
            if (Object.prototype.toString.call(address) !== "[object Object]" || Object.keys(address).length == 0) {
                return res.status(400).send({ status: false, message: "Address  is Object type only/not empty" })
            }
            let { shipping, billing } = address

            // //vlidation for shipping
            if (shipping) {
                if (Object.prototype.toString.call(shipping) !== "[object Object]" || Object.keys(shipping).length == 0) {
                    return res.status(400).send({ status: false, message: "shipping is Object type only/not empty " })
                }
                if (!isEmpty(shipping.street)) {
                    return res.status(400).send({ status: false, message: "street Is Invalid/String only" });
                }
                if (!isEmpty(shipping.city)) {
                    return res.status(400).send({ status: false, message: "city Is Invalid/String only" });
                }
                if (!isValidPincode(shipping.pincode)) {
                    return res.status(400).send({ status: false, msg: "Invalid pincode / Numbers only" })
                }
            }
            //validation for billing
            if (billing) {
                if (Object.prototype.toString.call(billing) !== "[object Object]" || Object.keys(billing).length == 0) {
                    return res.status(400).send({ status: false, message: "billing is Object type only/not empty" })
                }
                if (!isEmpty(billing.street)) {
                    return res.status(400).send({ status: false, message: "street Is Invalid/String only" });
                }
                if (!isEmpty(billing.city)) {
                    return res.status(400).send({ status: false, message: "city Is Invalid/String only" });
                }
                if (!isValidPincode(billing.pincode)) {
                    return res.status(400).send({ status: false, msg: "Invalid pincode / Numbers only" })
                }
            }
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
        let dataUpdated = { fname, lname, email, phone, profileImage, address }
        dataUpdated.password = hashedPassword
        let data = await userModel.findOneAndUpdate({ _id: userId }, { $set: dataUpdated }, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated", date: data });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = {
    createUser,
    login,
    getUser,
    updateUser
}