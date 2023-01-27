const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const { addToCart, getUserCart, emptyCart, removeFromCart } = require('../controller/userController')

router.post('/',auth, addToCart) 
router.post('/remove',auth,removeFromCart)
router.get('/', auth, getUserCart)
router.delete('/',auth, emptyCart)
module.exports=router;