const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phoneRegex=/^[6-9]{1}[0-9]{9}$/
const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const pincodeRegex=/^[1-9][0-9]{5}$/
const nameRegex =/^[a-zA-Z '.-]*$/
const mongoose = require("mongoose")


const isValidName=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && nameRegex.test(data.trim())) return true
    return false
}
const isValidPhone=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && phoneRegex.test(data.trim())) return true
    return false
}

const isValidEmail=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && emailRegex.test(data.trim())) return true
    return false
}

const isValidPassword=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && passwordRegex.test(data.trim())) return true
    return false
}

const isValidPincode=(data)=>{
    if(typeof data =="number"&& pincodeRegex.test(data)) return true
    return false
}


const isValidObjectId = (data) => {
    if (mongoose.Types.ObjectId.isValid(data))  return true
    return false
}


const isEmpty = (value) => {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  module.exports={
    isEmpty,isValidEmail,isValidPhone,isValidPassword,isValidPincode,isValidObjectId,isValidName
  }