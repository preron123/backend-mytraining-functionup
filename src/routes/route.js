const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const middleWear= require("../middleware/auth.js") 


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser  )

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId", middleWear.authentication,middleWear.authorization, userController.getUserData)

router.put("/users/:userId", middleWear.authentication,middleWear.authorization, userController.updateUser)

router.delete("/users/:userId", middleWear.authentication,middleWear.authorization, userController.deactivateUser)

router.post("/users/:userId/posts", middleWear.authentication, middleWear.authorization, userController.postMessage)



module.exports = router;
