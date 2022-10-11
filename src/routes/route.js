const express=require('express');
const router=express.Router()
const userController=require('../controllers/userController')
const middleware=require('../middelwares/authrentication')
router.get('/test-me',(req,res)=>{
    res.send("running .......")
})
router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authenticationMid,userController.getUser)
router.put('/user/:userId/profile',middleware.authenticationMid,userController.updateUser)

module.exports=router