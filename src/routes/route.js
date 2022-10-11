const express=require('express');
const router=express.Router()
const userController=require('../controllers/userController')

router.get('/test-me',(req,res)=>{
    res.send("running .......")
})
router.post('/register',userController.createUser)
router.post('/login',userController.login)



module.exports=router