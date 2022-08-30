const express = require('express');
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const createUser = async function (req, res) {
  //You can name the req, res objects anything.
  //but the first parameter is always the request 
  //the second parameter is always the response
  let data = req.body;
  let savedData = await userModel.create(data);
  console.log(req.newAtribute);
  res.send({ msg: savedData });
};

const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret
  // The same secret will be used to decode tokens
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "plutonium",
      organisation: "FunctionUp",
    },
    "functionup-plutonium"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
};

const getUserData = async function (req, res) {
  let userId = req.params.userId;
  

  let userData = await userModel.findById(userId);
  if (!userData){
    return res.send({ status: false, msg: "No such user exists" });
  }

  res.send({ status: true, data: userData });
};





const updateUser = async function(req,res){
  let userid1 = req.params.userId;
  let user = await userModel.findById(userid1);
  if (!user) {
    return res.send("user is not present");
  }
  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userid1 }, userData,{new:true});
  res.send({ status:"updated", data: updatedUser });

}
// const updateUser = async function (req, res) {
//   let userId = req.params.userId;
//   let user = await user.findById(userId);
  
//   if (!user) {
//     return res.send("No such user exists");
//   }

//   let userData = req.body;
//   let updatedUser = await User.findOneAndUpdate(
//     { _id: userId }, 
//     { $set: userData},
//     { new: true},
//     );
//   res.send({ status: true, data: updatedUser });
// }



const deleteUser = async function(req,res){
  let userid2 = req.params.userId;
  let user1 = await userModel.findById(userid2);
  if (!user1) {
    return res.send("user is not present");
  }
  let deletedUser = await userModel.findOneAndUpdate({_id: userid2},{ isDeleted : true },{new:true});
  res.send({ status:"deleted", data: deletedUser });

}
// const deleteUser = async function(req, res){
//   let userId = req.params.userId;
//   let user = await User.findOneAndUpdate(
//     {_id: userId},
//     { $set: {isDeleted: true}},
//     { new: true}
//   )

//   res.send({status: true, data: user});
// }

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;