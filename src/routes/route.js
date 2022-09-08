const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const {authenticate, authorize}= require("../middlewares/auth")


router.post("/authors", authorController.createAuthor)

router.post("/Blogs", blogController.createBlog)

router.get("/getBlogs",authenticate,blogController.getBlogsData)

router.put("/updateBlog/:blogId",authorize,blogController.updateBlog)

router.delete("/deleteBlog/:blogId",authorize,blogController.deleteBlog)

router.delete("/blogs?queryParams",authenticate,blogController.deleteBlogQuery)

router.post("/login", authorController.login)



router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;