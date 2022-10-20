const express=require('express');
const router=express.Router()
const {createUser,login,getUser,updateUser}=require('../controllers/userController')
const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require("../controllers/productController")
const { createCart, getCart ,updateCart,deleteCartById} = require("../controllers/cartController")
const {createOrder,updateOrder}=require('../controllers/orderController')
const {authenticationMid}=require('../middelwares/authrentication')


//Users Api's
router.post('/register',createUser)
router.post('/login',login)
router.get('/user/:userId/profile',authenticationMid,getUser)
router.put('/user/:userId/profile',authenticationMid,updateUser)

//product apis
router.post("/products",createProduct)
router.get("/products",getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete("/products/:productId", deleteProduct)

// cart apis 
router.post("/users/:userId/cart", authenticationMid, createCart)
router.get("/users/:userId/cart",authenticationMid, getCart)
router.put('/users/:userId/cart',authenticationMid, updateCart)
router.delete('/users/:userId/cart',authenticationMid, deleteCartById)

// order apis 
router.post("/users/:userId/orders",authenticationMid, createOrder)
router.put("/users/:userId/orders", authenticationMid,updateOrder)


//errorHandling for wrong address
router.all("/**",(_, res) =>{
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})

module.exports=router