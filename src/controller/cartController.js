const Product=require('../models/productModel')
const User=require('../models/userModel')
const Cart=require('../models/cartModel')
const asyncHandler=require('express-async-handler');
const validateMongoDBID = require('../utils/validateMongoDbID');
const sendMsg = require('./twilioController');
const config = require('../config/twilio');
const sendEmail = require('./emailController');

const sendCart=asyncHandler(async(req,res)=>{
    const {cartId}=req.body;
    try{
        const cart=await Cart.findById(cartId)
        const body=`¡Hola ${req.user.firstname}, te notificamos que la compra de ${cart.products} por un total de ${cart.cartTotal} fue aprobada y ya va en camino!`
        const msg={
            from: 'whatsapp:+14155238886',
            body: body,
            to:'whatsapp:+56939056445'
          }
        const emailBody={
            to:req.user.email,
            text:`Hello ${req.user.firstname},you have placed an order for ${cart.products} for a total of ${cart.cartTotal}!`,
            subject:"Welcome to the eCommerce",
        }
        sendEmail(emailBody)
        sendMsg(msg)
        res.send({success:true})
    } catch (error){
        throw new Error(error)
    }
})

module.exports={
    sendCart,
}