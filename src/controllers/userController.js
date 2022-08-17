const UserModel= require("../models/userModel")

const createBook = async function (req, res) {
    const book = req.body
    let savedBook = await BookModel.create(book)
    res.send({ msg: savedBook })
}

// const createUser= async function (req, res) {
//     let data= req.body
//     let savedData= await UserModel.create(data)
//     res.send({msg: savedData})
// }

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

module.exports.createBook= createBook
module.exports.getUsersData= getUsersData