const asyncHandler=require('express-async-handler');
const sendMsg = require('./twilioController');
const sendEmail = require('./emailController');
const {logger}=require('../config/index')
const {User,Cart,Product}=require('../repository/repository');
const { cartAsDTO } = require('../DTO/DTO');

// GET ALL CARTS

const getAllCarts=asyncHandler(async(req,res)=>{
    try{
        const response=await Cart.getAll()
        res.json(response)
    }catch(error){
        logger.error(`error getting cart collection ${error}`)
    }
})


// GET USERS CART

const getUserCart=asyncHandler(async(req,res)=>{
    console.log(`getUserCart called ${req.user}`)
    const {_id}=req.user
    try{
        const cart=await Cart.findOne({buyer:_id})
        if(!cart){
            console.log("cart not found")
            let newCart=await Cart.save({
                buyer:_id,
                products:[],
                cartTotal:0
            })
            console.log(newCart)
            res.json(newCart)
        } else {
            res.json(cart)
        }
    }catch(error){
        logger.error(`error in getting user cart funcionality ${error}`)
    }
})

// ADD PRODUCT TO CART
const addToCart=asyncHandler(async(req,res)=>{
    const {productId,quantity}=req.body
    const {_id}=req.user
    try{
        const cartAlreadyExists=await Cart.findOne({buyer:_id})
        const prod=await Product.getById(productId)
        if(!prod){
            console.log("product not found")
            logger.info(`Product with ID:${productId} not found (addToCart)`)
        }
        if(!cartAlreadyExists){
            console.log("cart doesnt exist")
            const prodPrice=Number(prod.price)
                let products=[{_id:productId,quantity:quantity,price:prodPrice,title:prod.title}]
                let newCart=await Cart.save({
                    products,
                    cartTotal:(prodPrice*quantity),
                    buyer:_id,
                })
                res.json(newCart)
        } else {
            console.log("cart already exist")
            const id=cartAlreadyExists._id
            const productsArr=cartAlreadyExists.products
            const productIndex=productsArr.findIndex((prod)=>prod._id.toString()===productId)
            if(productIndex!==-1){
                productsArr[productIndex].quantity+=quantity
                newCartTotal=cartAlreadyExists.cartTotal+(prod.price*quantity)
                const updatedCart=await Cart.updateById(id,
                    {
                        products:productsArr,
                        cartTotal:newCartTotal
                    },
                    {
                        new:true
                    })
                res.json(updatedCart)
            } else {
                productsArr.push({
                    _id:productId,
                    quantity:quantity,
                    title:prod.title,
                    price:prod.price
                })
                newCartTotal=cartAlreadyExists.cartTotal+(prod.price*quantity)
                const updatedCart=await Cart.updateById(id,
                    {
                        products:productsArr,
                        cartTotal:newCartTotal
                    },
                    {
                        new:true
                    })
                res.json(updatedCart)
            }
        }
    } catch(error){
        logger.error(`Error in the add to cart functionality ${error} (addToCart)`)
    }
})

// EMPTY AND REMOVE CART

const emptyCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    try{
        const cart=await Cart.findOneAndRemove({buyer:_id})
        res.json(cart)
    }catch(error){
        logger.error(`error in removing cart ${error}`)
    }
})

// REMOVE PRODUCT FROM CART

const removeFromCart=asyncHandler(async(req,res)=>{
    const {productId}=req.body
    const {_id}=req.user
    try{
        const product=await Product.getById(productId)
        const userCart=await Cart.findOne({buyer:_id})
        const products=userCart.products
        console.log(products)
        const productIndex=userCart.products.findIndex((prod)=>prod._id.toString()===productId)
        console.log(productIndex)
        if(productIndex!==-1){
                let quantity=products[productIndex].quantity
                products.splice(productIndex,1)
                const newCart={
                    products:products,
                    cartTotal:userCart.cartTotal-(product.price*quantity)
                }
                const updatedCart=await Cart.updateById(userCart._id,newCart)
                res.json(updatedCart)
            } else {
                logger.info("product not found in users cart")
                res.json({Error:"product not found in users cart"})
        }
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
    removeFromCart,
    getAllCarts
}