const asyncHandler = require("express-async-handler")
const {User,Cart,Order}=require('../repository/repository');
const uniqid=require('uniqid')
const sendEmail=require('../controller/emailController')
const config=require('../config/index')

const createOrder=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    const {userCart}=req.body
    try{
        const user = await User.getById(_id)
        let newOrder=await Order.save({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"debit card",
                amount:userCart.cartTotal,
                created:Date.now(),
                currency:"clp",
            },
            orderBy:user._id,
            deliveryAddress:user.address,
            orderStatus:"Processing payment"
        });
        let orderString=JSON.stringify(newOrder)
        const data={
            from: config.NOTIFICATIONS.email.EMAIL_NAME,
            to: user.email,
            text:"Processing new order",
            subject:'New Order',
            html:orderString
        }
        sendEmail(data)
        await Cart.deleteById(userCart._id)
        console.log(newOrder)
        res.send(newOrder)
    }
    catch(error){
        throw new Error(`error in create order: ${error}`)
    }
})

const getOrders=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const user = await User.getById(_id)
        const orderList=await Order.find({orderBy:user._id})
        return res.json(orderList)
    }catch(error){
        throw new Error(`could not get orders: ${error}`)
    }
})

const updateOrder=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const {status}=req.body
    try{
        const userOrder=await Order.findOneAndUpdate(id,
            {
                orderStatus:status,
                paymentIntent:{
                    status:status,
                }
            }
            ,
            {
                new:true,
            }
            )
            res.json(userOrder);
    }catch(error){
        throw new Error(`could not update orders: ${error}`)
    }
})

module.exports={
    createOrder,
    getOrders,
    updateOrder,
}