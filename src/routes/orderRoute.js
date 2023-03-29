const express=require('express')
const router=express.Router()
const {getOrders,createOrder,updateOrder}= require('../controller/orderController')
const {auth, isAdmin} = require('../middlewares/auth')

router.post('/',auth,createOrder)
router.get('/',auth, getOrders)
router.put('/:orderId',auth, updateOrder)

module.exports=router