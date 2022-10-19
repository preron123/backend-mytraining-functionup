const express=require('express');
const router=express.Router()
const userController=require('../controllers/userController')
const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require("../controllers/productController")
const { createCart, getCart ,updateCart,deleteCartById} = require("../controllers/cartController")
const {createOrder,updateOrder}=require('../controllers/orderController')
const middleware=require('../middelwares/authrentication')


//Users Api's
router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authenticationMid,userController.getUser)
router.put('/user/:userId/profile',middleware.authenticationMid,userController.updateUser)

// //Products Api's
// router.post('/products',productController.createProduct)
// router.get('/products/:productId',productController.getProduct)
// router.get('/products',productController.getProductsWithFilter)
// router.put('/products/:productId',productController.updateProduct)
// router.delete('/products/:productId',productController.deleteProduct)


//================================== product apis ============================================

router.post("/products",createProduct)
router.get("/products",getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete("/products/:productId", deleteProduct)


// cart apis 

router.post("/users/:userId/cart", middleware.authenticationMid, createCart)
router.get("/users/:userId/cart",middleware.authenticationMid, getCart)
router.put('/users/:userId/cart',middleware.authenticationMid, updateCart)
router.delete('/users/:userId/cart',middleware.authenticationMid, deleteCartById)



// order apis 

router.post("/users/:userId/orders", createOrder)
router.put("/users/:userId/orders", updateOrder)


//errorHandling for wrong address
router.all("/**",(_, res) =>{
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports=router