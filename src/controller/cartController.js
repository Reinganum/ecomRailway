const Product=require('../models/productModel')
const User=require('../models/userModel')
const Cart=require('../models/cartModel')
const asyncHandler=require('express-async-handler');
const validateMongoDBID = require('../utils/validateMongoDbID');

const cartUser=asyncHandler(async(req,res)=>{
    const {cart}=req.body;
    console.log(req.user)
    try{
        /*
        let products=[]
        const user=await User.findById(_id)
        const cartExists=await Cart.findOne({buyer:user._id})
        if(cartExists){
            cartExists.remove()
        }
        for (let i=0;i<cart.length;i++){
            let object={}
            object.product=cart[i]._id
            object.count=cart[i].count
            let getPrice=await Product.findById(cart[i]._id).select("price").exec()
            object.price=getPrice.price
            products.push(object)
        }
    res.send(products)*/
        res.send(req.user)
    } catch (error){
        throw new Error(error)
    }
})

module.exports={
    cartUser,
}