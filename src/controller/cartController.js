const Product=require('../models/productModel')
const User=require('../models/userModel')
const Cart=require('../models/cartModel')
const asyncHandler=require('express-async-handler');
const sendMsg = require('./twilioController');
const config = require('../config/twilio');
const sendEmail = require('./emailController');
const logger = require('../config/logger');

/*
const userCart=asyncHandler(async(req,res)=>{
    const {cart}=req.body
    const {_id}=req.user
    try{
        let products=[]
        const user= await User.findById(_id)
        const cartAlreadyExists=await Cart.findOne({buyer:user._id})
        if (cartAlreadyExists){
            console.log(cartAlreadyExists)
            cartAlreadyExists.remove()
        }
        for(let i=0;i<cart.length;i++){
            let object={}
            object.product=cart[i]._id
            object.quantity=cart[i].quantity
            let getPrice=await Product.findById(cart[i]._id).select('price').exec()
            object.price=getPrice.price;
            products.push(object);
        }
        let cartTotal=0;
        for (let i=0;i<products.length;i++){
            cartTotal=cartTotal+products[i].price*products[i].quantity;
        }
        let newCart=await new Cart({
            products,
            cartTotal,
            buyer:user?._id
        }).save()

        res.json(newCart)
    } catch(error){
        throw new Error(error)
    }
})
*/
/*
let user=await User.findByIdAndUpdate(_id,
    {
        $push:{Wishlist:prodId}
    },
    {
        new:true,
    }
)
*/

// ADD TO CART 

const addToCart=asyncHandler(async(req,res)=>{
    const {cart}=req.body
    const {_id}=req.user
    const productId=(cart[0]._id)
    console.log(cart)
    try{
        const user= await User.findById(_id)
        const cartAlreadyExists=await Cart.findOne({buyer:user._id})
        if (cartAlreadyExists){
            console.log("yes cart already exists")
            const id=cartAlreadyExists._id
            const prod=await Product.findById(productId)
            if(prod){
                const prodPrice=Number(prod.price)
                /*for(let i=0;i<cartAlreadyExists.products.length;i++){
                    if(cartAlreadyExists.products[i]._id.equals(cart[0]._id)){
                        console.log(true)
                        // en este caso agregar 1 o cambiar funcionalidad para quitar
                    } else {
                        console.log(false)
                        // en este caso el producto no esta en el carrito
                    }
                }*/
                const updatedCart=await Cart.findByIdAndUpdate(id,
                    {
                        $push:{products:[{_id:cart[0]._id,quantity:1,price:prodPrice,title:prod.title}]},
                        cartTotal:(cartAlreadyExists.cartTotal+prodPrice)
                    },
                    {
                        new:true
                    }
                    )
                res.json(updatedCart)
            }
        } else {
            console.log("no such cart so we have to create one to add THE PRODUCT")
            console.log("")
            const prod=await Product.findById(productId)
            if(prod){
                const prodPrice=Number(prod.price)
                let products=[{_id:productId,quantity:1,price:prodPrice,title:prod.title}]
                let newCart=await new Cart({
                    products,
                    cartTotal:prodPrice,
                    buyer:user?._id,
                }).save()
                res.json(newCart)
            }
        } 
    }catch(error){
        logger.error(`Error in the add to cart functionality ${error}`)
    }
})


// GET USERS CART

const getUserCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const cart=await Cart.findOne({buyer:_id}).populate("products.product")
        if(cart){
            let cartTotal=0;
            for (let i=0;i<cart.products.length;i++){
                cartTotal=cartTotal+cart.products[i].price*cart.products[i].quantity;
            }
            newCart=await Cart.findByIdAndUpdate(cart._id,{cartTotal:cartTotal})
            logger.info("cart updated succesfully")
            res.json(newCart)
        } else {
            let products=[]
            let cartTotal=0;
            let newCart=await new Cart({
                products,
                cartTotal,
                buyer:_id
            }).save()
            logger.info('new cart created')
            res.json(newCart)
        }
    }catch(error){
        logger.error(`error in getting user cart funcionality ${error}`)
    }
})

// EMPTY AND REMOVE CART

const emptyCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    try{
        const user=await User.findById(_id)
        const cart=await Cart.findOneAndRemove({buyer:user._id})
        res.json(cart)
    }catch(error){
        logger.error(`error in removing cart ${error}`)
    }
})

// REMOVE PRODUCT FROM CART

const removeFromCart=asyncHandler(async(req,res)=>{
    const {product}=req.body
    const {_id}=req.user
    try{
        /*
        {
            $push:{products:[{_id:cart[0]._id,quantity:1,price:prodPrice,title:prod.title}]},
            cartTotal:(cartAlreadyExists.cartTotal+prodPrice)
        },
        */
        const getProduct=await Product.findById(product)
        const getCart=await Cart.findOne({buyer:_id})
        const newCartTotal=getCart.cartTotal-getProduct.price
        const userCart=await Cart.findOneAndUpdate({buyer:_id},
            {
             $pull: { products: {_id:product} },
             cartTotal:newCartTotal,
            },
            {
                new:true
            },
    )
    res.json(userCart)
    } catch(error){
        logger.error(`Error removing product from cart ${error}`)
    }
})

// SEND ORDER BY TWILIO AND MAIL

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
        logger.error(error)
    }
})

module.exports={
    sendCart,
    addToCart, 
    getUserCart, 
    emptyCart, 
    removeFromCart 
}