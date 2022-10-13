const express=require('express');
const router=express.Router()
const userController=require('../controllers/userController')
const productController=require('../controllers/productController')
const middleware=require('../middelwares/authrentication')


//Users Api's
router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authenticationMid,userController.getUser)
router.put('/user/:userId/profile',middleware.authenticationMid,userController.updateUser)

//Products Api's
router.post('/products',productController.createProduct)
// router.post('/login',userController.login)
// router.get('/user/:userId/profile',middleware.authenticationMid,userController.getUser)
// router.put('/user/:userId/profile',middleware.authenticationMid,userController.updateUser)
//errorHandling for wrong address
router.all("/**", function (_, res) {
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports=router