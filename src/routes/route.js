const express=require('express');
const router=express.Router()
const userController=require('../controllers/userController')
const productController=require('../controllers/productController')

// const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require("../controllers/productController")

const { createCart, getCart ,updateCart,deleteCart} = require("../controllers/cartController")
const middleware=require('../middelwares/authrentication')


//Users Api's
router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authenticationMid,userController.getUser)
router.put('/user/:userId/profile',middleware.authenticationMid,userController.updateUser)

//Products Api's
router.post('/products',productController.createProduct)
router.get('/products/:productId',productController.getProduct)
router.get('/products',productController.getProductsWithFilter)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)


//================================== product apis ============================================

// router.post("/products",createProduct)
// router.get("/products",getProductsWithFilter)
// router.get('/products/:productId', getProductById)
// router.put('/products/:productId', updateProduct)
// router.delete("/products/:productId", deleteProduct)


// cart apis 

router.post("/users/:userId/cart", Authentication, authorization, createCart)
router.get("/users/:userId/cart", Authentication, authorization, getCart)
router.put('/users/:userId/cart', Authentication, authorization, updateCart)
router.delete('/users/:userId/cart', Authentication, authorization, deleteCart)



// order apis 

// router.post("/users/:userId/orders", Authentication, authorization, createOrder)
// router.put("/users/:userId/orders", Authentication,authorization, updateOrder)


//errorHandling for wrong address
router.all("/**",(_, res) =>{
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports=router