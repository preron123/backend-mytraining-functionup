const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');


const createBlog = async (req, res) => {
    try {
        let Blog = req.body
        if (Object.keys(Blog).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }
        if (!Blog.title) return res.status(400).send({ msg: " title is required " })
        if (!Blog.body) return res.status(400).send({ msg: "body is required " })
        if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " })
        if (!Blog.category) return res.status(400).send({ msg: " category is require" })


        let blogCreated = await blogModel.create(Blog)

        res.status(201).send({ status: true, data: blogCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


const getBlogsData = async (req, res) => {
    try {

        let input = req.query.authorId

        let isValid = mongoose.Types.ObjectId.isValid(input)
        if (!isValid) return res.status(400).send({ msg: "enter valid authorid" })

        let categorySelected = req.query.category
        if(!categorySelected ) return res.status(400).send({msg:"category not avalible"})

        if (input) {

            let blogs = await blogModel.find({ authorId: input, category: categorySelected, isDeleted: false }).populate("authorId") //ispublished =true not given because it not makes sense

            // if (!blogs) return res.status(404).send({ msg: "no blog found" })

            if (blogs.length == 0) {
                return res.status(404).send({ msg: "Sorry , No data found" });
        }
           else return res.status(200).send({ data: blogs })
        }
        else {
            let blogs = await blogModel.find({ isDeleted: false }).populate("authorId")
            return res.status(200).send({ data: blogs })
        }

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

const updateBlog = async (req, res) => {
    try {
        let inputId = req.params.blogId
        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })

        let author = req.body
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subCategory = req.body.subCategory

        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        let date = Date.now()

        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(400).send({ msg: "Blog already deleted" })

        let blogs = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { tags: tags, subCategory: subCategory } }, { new: true })


        if (!blogs) return res.status(404).send({ msg: "no blog found" })
        res.status(200).send({ msg: blogs })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


        


        

const deleteBlog = async (req, res) => {
    try {
        let inputId = req.params.blogId

        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })
        let date = Date.now()

        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(409).send({ msg: "Blog already deleted" })

        let data = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!data) return res.status(404).send({ msg: "no data found" })

        res.status(200).send({ status: true, msg: data })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const  deleteBlogQuery = async (req, res) => {
    try {
        const queryParams = req.query;
        if (Object.keys(queryParams).length == 0)
            return res.status(400).send({ status: false, msg: "Please enter some data in the body" });

        const blog = await blogModel.find({ $and: [queryParams, { isDeleted: false }, { isPublished: true }] });

        if (blog.isDeleted == true || blog.length == 0)
            return res.status(404).send({msg: "Document is already Deleted "})
        
        const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
         res.status(500).send({ error: err.message })
    }
}



module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery = deleteBlogQuery


// const blogModel = require("../models/blogModel")
// const authorModel = require("../models/authorModel")
// const moment = require('moment')
// const mongoose = require("mongoose")
// const ObjectId = mongoose.Types.ObjectId


// const isValid = function (value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true;
// }

// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId)
// }


// const createBlog = async function (req, res) {
//     try {
//         let data = req.body
//         const { title, body, authorId, tags, category, subCategory, isPublished } = data

//         if (Object.keys(data).length == 0) {
//             res.status(400).send({ status: false, msg: "BAD REQUEST" })
//             return
//         }
//         if (!isValid(title)) {
//             res.status(400).send({ status: false, msg: "title is required" })
//             return
//         }
//         if (!isValid(body)) {
//             res.status(400).send({ status: false, msg: "body is required" })
//             return
//         }
//         if (!isValid(authorId)) {
//             res.status(400).send({ status: false, msg: "authorId is required" })
//             return
//         }
//         if (!isValidObjectId(authorId)) {
//             res.status(400).send({ status: false, msg: "authorId is not a vlaid authorId" })
//             return
//         }
//         if (!isValid(tags)) {
//             res.status(400).send({ status: false, msg: "tags is required" })
//             return
//         }
//         if (!isValid(category)) {
//             res.status(400).send({ status: false, msg: "category is required" })
//             return
//         }
//         if (isValidObjectId(subCategory)) {
//             res.status(400).send({ status: false, msg: "subCategory is required"})
//             return
//         }

//         let authorDetails = await authorModel.findById(authorId)
//         if (!authorDetails) {
//             return res.status(404).send({ status: false, msg: "author id not exist" })
//         }
//         if (isPublished == true) {
//             let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
//             let blogData = { title, body, authorId, tags, category, subCategory, isPublished, publishedAt: Date };
//             let blogCreated = await blogModel.create(blogData)
//             res.status(201).send({ status: true, data: blogCreated })
//         } else {
//             let blogCreated = await blogModel.create(data)
//             res.status(201).send({ status: true, data: blogCreated })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ msg: error.message })
//     }

// }

    




// const updateBlog = async function (req, res) {
//     try {
        
//         let blogId = req.params.blogId
//         let data = req.body

//         let { title, body, tags, subCategory } = data

//         if (Object.keys(data).length == 0) {
//             res.status(400).send({ status: false, msg: "BAD REQUEST" })
//             return
//         }
//         if (!isValid(title)) {
//             res.status(400).send({ status: false, msg: "title need to be updated" })
//             return
//         }
//         if (!isValid(body)) {
//             res.status(400).send({ status: false, msg: "body need to be updated" })
//             return
//         }
//         if (!isValid(tags)) {
//             res.status(400).send({ status: false, msg: "tags need to be updated" })
//             return
//         }
//         if (!isValid(subCategory)) {
//             res.status(400).send({ status: false, msg: "subCategory need to be updated" })
//             return
//         }
//         if (!isValidObjectId(blogId)) {
//             res.status(400).send({ status: false, msg: "blogId is not a valid blogId" })
//             return
//         }

//         let blogDetails = await blogModel.findOne({ _id: blogId, isDeleted: false })
//         if (!blogDetails) {
//             res.status(404).send({ status: false, msg: "details not exist" })
//             return
//         } else {

//             let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

//             await blogModel.findOneAndUpdate({ _id: blogId }, { title: title, body: body, $addToSet: { tags: tags, subCategory: subCategory }, $set: { isPublished: true, publishedAt: Date }, new: true })
//             let updatedDetails = await blogModel.find({ _id: blogId })
//             res.status(201).send({ status: true, data: updatedDetails })
//         }

//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).send({ msg: error.message })
//     }
// }


// // 
// const deleteBlog = async (req, res) => {
//     try {
//         let inputId = req.params.blogId

//         let isValid = mongoose.Types.ObjectId.isValid(inputId)
//         if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })
//         let date = Date.now()

//         let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
//         if (alert) return res.status(409).send({ msg: "Blog already deleted" })

//         let data = await blogModel.findOneAndUpdate({ _id: inputId },
//             { $set: { isDeleted: true, deletedAt: date } }, { new: true })

//         if (!data) return res.status(404).send({ msg: "no data found" })

//         res.status(200).send({ status: true, msg: data })
//     }
//     catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }

// const deleteByQueryParam = async function (req, res) {
//     try {
       
//         let data = req.query
//         let { authorId, category, tags, subCategory, isPublished } = data

//         if (!(authorId && category && tags && subCategory && isPublished )) {
//             return res.status(400).send({ status: false, msg: "query params can't be empty" })
//         }
//         if (!isValid(authorId)) {
//            res.status(400).send({ status: false, msg: "authorId is required, BAD REQUEST" })
//            return
//         }
//         if(!isValidObjectId(authorId)) {
//             res.status(400).send({status: false, msg: "authorId is not a valid authorId"})
//         }
//         if (!isValid(category)) {
//          res.status(400).send({ status: false, msg: "category is required, BAD REQUEST" })
//          return
//         }
//         if (!isValid(tags)) {
//          res.status(400).send({ status: false, msg: "tag is required, BAD REQUEST" })
//          return
//         }
//         if (!isValid(subCategory)) {
//             res.status(400).send({ status: false, msg: "subCategory is required , BAD REQUEST" })
//             return
//         }
//         if (!isValid(isPublished)) {
//              res.status(400).send({ status: false, msg: "isPublished is required, BAD REQUEST" })
//          }

//         let authorDetails = await authorModel.find({ _id: authorId, isDeleted: false })
//         if (!authorDetails) {
//             res.status(404).send({ status: false, msg: "details not exist" })
//         } else 
//         // 
//         {
//             let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
//             let updatedDetails = await blogModel.updateMany({ authorId: authorId, category: category, tags: tags, subCategory: subCategory, isPublished: isPublished }, { $set: { isDeleted: true, deletedAt: Date ,isPublished: true, publishedAt: Date},new: true })
//              res.status(201).send({ status: true, data: updatedDetails, msg: "blogs deleted" })
//         }

//     }
//     catch (error) {
//         console.log(error)
//         res.staatus(500).send({ msg: error.message })
//     }
// }

// module.exports.createBlog = createBlog;
// //module.exports.getBlogsData = getBlogsData;
// module.exports.updateBlog = updateBlog;
// module.exports.deleteBlog = deleteBlog;
// module.exports.deleteByQueryParam = deleteByQueryParam;





















// const authorModel = require("../models/authorModel")
// const blogModel = require("../models/blogModel")
// const mongoose = require('mongoose');


 
// const createBlog = async (req, res) => {
//     try {
//         let Blog = req.body
//         if (Object.keys(Blog).length == 0) {
//             return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
//         }
//         if (!Blog.title) return res.status(400).send({ msg: " title is required " })
//         if (!Blog.body) return res.status(400).send({ msg: "body is required " })
//         if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " })
//         if (!Blog.category) return res.status(400).send({ msg: " category is require" })


//         let blogCreated = await blogModel.create(Blog)

//         res.status(201).send({ status: true, data: blogCreated })
//     } catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }




// const getBlogsData = async (req, res) => {
//     try {

//          let tags= req.query.params
// //         let input = req.query.authorId
// //         if(!input) return
// //         let isValid = mongoose.Types.ObjectId.isValid(input)
// //         if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })
// //         let categorySelected = req.query.category
       

// //             let blogs = await blogModel.find({ authorId: input}), category: categorySelected, isDeleted: false }).populate("authorId") //ispublished =true not given because it not makes sense
// // if(!blogs) return 
// //             // if (!blogs) return res.status(404).send({ msg: "no blog found" })

// //             if (blogs.length == 0) {
// //                 return res.status(404).send({ msg: "Sorry , No data found" });
// //         }
// //            else return res.status(200).send({ data: blogs })
// //         }

//         let obj={isDeleted:false}

//         if(tags) {
//             obj.tags=tags
//         }

//         // else {
//         //     let blogs = await blogModel.find({ isDeleted: false }).populate("authorId")
//         //     return res.status(200).send({ data: blogs })
//         // }
//         let getBlogsD= await blogModel.find(obj)

//         return res.status(200).send({msg:"Success", data:getBlogsD})

//     }
//     catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }





// const updateBlog = async (req, res) => {
//     try {
//         let inputId = req.params.blogId
//         let isValid = mongoose.Types.ObjectId.isValid(inputId)
//         if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })

//         let author = req.body
        
//         let title = req.body.title
//         let body = req.body.body
//         let tags = req.body.tags
//         let subCategory = req.body.subCategory

//         if (Object.keys(author).length == 0) {
//             return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
//         }

//         let date = Date.now()

//         let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
//         if (alert) return res.status(400).send({ msg: "Blog already deleted" })

//         let blogs = await blogModel.findOneAndUpdate({ _id: inputId },
//             { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { tags: tags, subCategory: subCategory } }, { new: true })


//         if (!blogs) return res.status(404).send({ msg: "no blog found" })
//         res.status(200).send({ msg: blogs })
//     }
//     catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }





// const deleteBlog = async (req, res) => {
//     try {
//         let inputId = req.params.blogId

//         let isValid = mongoose.Types.ObjectId.isValid(inputId)
//         if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })
//         let date = Date.now()

//         let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
//         if (alert) return res.status(409).send({ msg: "Blog already deleted" })

//         let data = await blogModel.findOneAndUpdate({ _id: inputId },
//             { $set: { isDeleted: true, deletedAt: date } }, { new: true })

//         if (!data) return res.status(404).send({ msg: "no data found" })

//         res.status(200).send()
//     }
//     catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }


// const  deleteBlogQuery = async (req, res) => {
//     try {
//         const queryParams = req.query;
//         if (Object.keys(queryParams).length == 0)
//             return res.status(400).send({ status: false, msg: "Please enter some data in the body" });

//         const blog = await blogModel.find({ $and: [queryParams, { isDeleted: false }, { isPublished: true }] });

//         if (blog.isDeleted == true || blog.length == 0)
//             return res.status(404).send()
        
//         const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
//         return res.status(200).send({ status: true, data: updatedBlog })
//     }
//     catch (err) {
//          res.status(500).send({ error: err.message })
//     }
// }




// module.exports.createBlog = createBlog
// module.exports.getBlogsData = getBlogsData
// module.exports.updateBlog = updateBlog
// module.exports.deleteBlog = deleteBlog
// module.exports.deleteBlogQuery = deleteBlogQuery