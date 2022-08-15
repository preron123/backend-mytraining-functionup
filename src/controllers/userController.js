const bookModel= require("../models/userModel")

const createaddbook= async function (req, res) {
    let data= req.body
    let savedData= await bookModel.create(data)
    res.send({msg: savedData})
}

const getbookData= async function (req, res) {
    let allbooks= await bookModel.find()
    res.send({msg: allbooks})
}

    module.exports.createaddbook= createaddbook
     module.exports.getbookData= getbookData

// const createUser= async function (req, res) {
//     let data= req.body
//     let savedData= await UserModel.create(data)
//     res.send({msg: savedData})
// }

// const getUsersData= async function (req, res) {
//     let allUsers= await UserModel.find()
//     res.send({msg: allUsers})
// }

// module.exports.createUser= createUser
// module.exports.getUsersData= getUsersData