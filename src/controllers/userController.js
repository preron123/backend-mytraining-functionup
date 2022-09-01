const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  try{
    let data = req.body;
    if(Object.keys(data).length!=0){
      let savedData = await userModel.create(data);
      res.status(201).send({ msg: savedData });
    }else{
      res.status(400).send({msg: "Bad Request" });
    }
  }catch(error){
    console.log(error.message);
    res.status(500).send({msg: error.message});
  }
};

const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  try{

    let user = await userModel.findOne({ emailId: userName, password: password });
    // console.log(user)
    if (!user)
      return res.status(400).send({
        status: false,
        msg: "BAD REQUEST: username or the password is not corerct"
      });

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "plutonium",
        organisation: "FunctionUp",
      },
      "functionup-plutonium"
    );
    res.setHeader("x-auth-token", token);        //["x-auth-token"]= token
    res.status(201).send({ status: true, token: token });
  }catch(error){
    res.status(500).send({msg:"Server Error", err: error.message})
  }
};

const getUserData = async function (req, res) {

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
};

const updateUser = async function (req, res) {
  

  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if (!user) {
    return res.send("No such user exists");
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, {new:true});
  res.send({ status: updatedUser, data: updatedUser });
};

const deactivateUser= async function(req, res){

  let userId= req.params.userId
  let user= await userModel.findById(userId)
  if(!user){
     return res.send("This userId is invalid")
  }

  let userData= req.body
  let updatedUser= await userModel.findOneAndUpdate({_id:userId}, userData, {new:true})
  res.send({msg: updatedUser})
}

const postMessage = async function (req, res) {
    let message = req.body.message

    
    
    let userId= req.params.userId
    let user = await userModel.findById(userId)
    if(!user) return res.send({status: false, msg: 'No such user exists'})
    
    let updatedPosts = user.posts
    //add the message to user's posts
    updatedPosts.push(message)
    // console.log(updatedPosts)
    let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{posts: updatedPosts}, {new: true})

    //return the updated user document
    return res.send({status: true, data: updatedUser})
}

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deactivateUser= deactivateUser
module.exports.postMessage = postMessage