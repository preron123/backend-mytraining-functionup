const { count } = require("console")
const BookModel= require("../models/bookModel")
const UserModel= require("../models/authorModel")


const createBook= async function (req, res) {
    let data= req.body

    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}



const listBooks= async function (req, res) {
      let findauthor = await UserModel.find({author_name : "Chetan Bhagat"});
      let findbook = await BookModel.find({author_id : {$eq : findauthor[0].author_id}});
    res.send({ msg : findbook});
}


const updatebook = async function (req,res) {
    let bookprice = await BookModel.findOneAndUpdate({ name : "Two states"},{$set : { price : 100} }, {new : true});
    let updateprice = bookprice.price;
    let authorupdate = await UserModel.find({author_id : {$eq : bookprice.author_id}}).select({author_name:1,_id:0});
    res.send({authorupdate ,updateprice});
}


const bookrange = async function(req,res) {
    let range = await BookModel.find({price : {$gte:50,$lte:100}});
     let a = range.map(function(x){return x.author_id;});
     let newrange = await UserModel.find({author_id : a}).select({author_name:1, _id:0});
    res.send(newrange);
}


module.exports.createBook= createBook;
module.exports.listBooks=listBooks;
module.exports.updatebook=updatebook;
module.exports.bookrange=bookrange;