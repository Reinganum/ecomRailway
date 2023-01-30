const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const { sendCart, addToCart, getUserCart, emptyCart, removeFromCart } = require('../controller/cartController')

router.post('/',auth, addToCart) 
router.post('/remove',auth,removeFromCart)
router.get('/', auth, getUserCart)
router.delete('/',auth, emptyCart)
router.post('/buy',auth,sendCart)

module.exports=router;