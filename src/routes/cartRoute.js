const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const { sendCart, addToCart, getUserCart, emptyCart, removeFromCart, getAllCarts } = require('../controller/cartController')
const {getOrders,createOrder}= require('../controller/orderController')
const { checkAuthenticated } = require('../middlewares/passport')

router.post('/', auth, addToCart) 
router.post('/remove',auth,removeFromCart)
router.get('/', auth, getUserCart)
router.get('/all',auth,getAllCarts)
router.delete('/',auth, emptyCart)
router.post('/buy',auth,sendCart)

module.exports=router;