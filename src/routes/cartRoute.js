const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const { addToCart, getUserCart, emptyCart, removeFromCart } = require('../controller/userController')
const { sendCart } = require('../controller/cartController')

router.post('/',auth, addToCart) 
router.post('/remove',auth,removeFromCart)
router.get('/', auth, getUserCart)
router.delete('/',auth, emptyCart)
router.post('/buy',auth,sendCart)
module.exports=router;