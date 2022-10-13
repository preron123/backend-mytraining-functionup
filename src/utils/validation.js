const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phoneRegex = /^[6-9]{1}[0-9]{9}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const pincodeRegex = /^[1-9][0-9]{5}$/
const nameRegex = /^[a-z A-Z]*$/
const priceRegex = /^\d{1,8}(?:\.\d{1,4})?$/
const mongoose = require("mongoose")


const isValidName = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && nameRegex.test(data.trim())) return true
    return false
}
const isValidPhone = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && phoneRegex.test(data.trim())) return true
    return false
}

const isValidEmail = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && emailRegex.test(data.trim())) return true
    return false
}

const isValidPassword = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && passwordRegex.test(data.trim())) return true
    return false
}

const isValidPincode = (data) => {
    if (typeof data == "number" && pincodeRegex.test(data)) return true
    return false
}


const isValidObjectId = (data) => {
    if (mongoose.Types.ObjectId.isValid(data)) return true
    return false
}


const isEmpty = (data) => {
    if (typeof data == "string" && data.trim().length !== 0) return true
    return false;
};

const isValidPrice = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && priceRegex.test(data.trim())) return true
    return false
}
const isValidSize = (data) => {
    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    if (typeof data == "string" && data.trim().length !== 0 && arr.includes(data.trim())) return true
    return false
}



module.exports = {
    isEmpty, isValidEmail, isValidPhone, isValidPassword, isValidPincode, isValidObjectId, isValidName, isValidPrice, isValidSize
}