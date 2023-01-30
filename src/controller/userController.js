const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler');
const generateToken = require('../config/jwt');
const validateMongoDBID = require('../utils/validateMongoDbID');
const signRefreshToken = require('../config/refreshJWT');
const sendEmail=require('../controller/emailController')
const crypto=require('crypto')
const Product=require('../models/productModel')
const Cart=require('../models/cartModel');
const { findOne } = require('../models/userModel');
const logger = require('../config/logger');

// REGISTER USER 

const createUser=asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const findUser=await User.findOne({email:email});
    if(!findUser){
        // create new user
        const newUser=await User.create(req.body);
        const {firstname,lastname}=req.body
        const data={
            to:email,
            text:`Hello ${firstname} ${lastname}, we welcome you to our community!`,
            subject:"Welcome to the eCommerce",
        }
        sendEmail(data)
        res.redirect('/login')
    } else {
        // email is used, user already exists
        logger.info('User not created, email already in database')
    }
});

// LOGIN USER 

const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const findUser=await User.findOne({email})
    // aqui implementar estrategia local con passport
    if (findUser&&await findUser.passwordMatches(password)){
        const refreshToken=signRefreshToken(findUser?._id)
        const updateRefresh=await User.findByIdAndUpdate(
            findUser.id, 
        {
            refreshToken: refreshToken
        },
        {new:true})
        res.cookie('refreshToken',refreshToken, {
            httpOnly:true,
            maxAge:2*60*60*1000
        })
        /*res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            token:generateToken(findUser?._id)
        })*/
        res.redirect('/dashboard')
    } else {
        logger.info("invalid login")
    }
})

// Handle refresh token

const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies
    console.log(req.cookies)
    if(!cookie?.refreshToken)throw new Error('there is no refresh token in cookies')
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken})
    if(!user)throw new Error('no user matches refresh token in Database')
    jwt.verify(refreshToken,process.env.JWT_SECRET, (error, decoded)=>{
        if (error || decoded.id !== user.id){
            logger.warn('error in refresh token')
        } else {
            const accessToken=generateToken(user?._id)
            res.json({accessToken})
        }
    })
})

// Logout user

const logout=asyncHandler(async(req,res)=>{
    const cookie=req.cookies
    if(!cookie?.refreshToken)throw new Error('there is no refresh token in cookies')
    const refreshToken=cookie.refreshToken
    try{
        const user=await User.findOne({refreshToken})
    if(!user){
        res.clearCookie('refreshToken',{httpOnly:true,secure:true})
        return res.sendStatus(403); 
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken:""
    })
    res.clearCookie('refreshToken',{httpOnly:true,secure:true})
    res.sendStatus(204); 
    } catch (error){
        logger.error(`error with refresh token: ${error}`)
    }
})

// All users

const getAllUsers=asyncHandler(async(req,res)=>{
    try{
        const getUsers=await User.find();
        res.json(getUsers)
    } catch (error){
        logger.error(`Could not get users ${error}`)
    }
})

// One User

const getUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDBID(id)
    try{
        const getUser=await User.findById(id)
        res.json(getUser)
    }catch (error){
        logger.error(`Could not get user ${error}`)
    }
})

// Delete User by id

const deleteUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDBID(id)
    try{
        const deleteUser=await User.findByIdAndDelete(id)
        res.json(deleteUser)
    }catch (error){
        logger.error(`Could not delete user ${error}`)
    }
})

// Update user by id 

const updateUserById=asyncHandler(async(req,res)=>{
    const {id}=req.user;
    validateMongoDBID(id)
    try{
        const updatedUser=await User.findByIdAndUpdate(id,
            {
                firstname:req?.body?.firstname,
                lastname:req?.body?.lastname,
                email:req?.body?.email
            },
            {
                new:true
            }
            )
            res.json(updatedUser)
    } catch (error) {
        logger.error(`Could not update user ${error}`)
    }
}) 

// BLOCK AND UNBLOCK USER BY ID (FUNCTION MUST REQUIRE ADMIN ROLE)

const blockUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    validateMongoDBID(id)
    try{
        const block=await User.findByIdAndUpdate(id,
        {
            isBlocked:true
        },
        {
            new:true
        })
        res.json({
            message:`${block}`    
        })  
    }catch(error){
        logger.error(`Could not handle block user ${error}`)
    }
})


const unblockUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    validateMongoDBID(id)
    try{
        const unblock=await User.findByIdAndUpdate(id,
        {
            isBlocked:false
        },
        {
            new:true
        }
        )
        res.json({
            message:`${unblock}`    
        })
    }catch(error){
        logger.error(`Could not handle unblock user ${error}`)
    }
})

// FORGOT PASSWORD,RECOVERY OR UPDATE

const updatePassword=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const {password}=req.body
    validateMongoDBID(_id)
    try{
        const user=await User.findById(_id)
        if(password){
            user.password=password
            const updatedPassword=await user.save()
            res.json(updatedPassword)
        } else {
            res.json(user)
        }
    }catch(error){
        logger.error(`Could not update password ${error}`)
    }
})

// enviar al mail token de password perdido

const forgotPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user)throw new Error('User not found with email for password recovery')
    try{
        const token=await user.createPasswordResetToken();
        await user.save()
        const resetURL=`If you forgot your password and requested a reset, follow this link (valid for 15 minutes) <a href='http://localhost:3000/api/user/reset-password/${token}'>Click here</>`
        const data={
            to:email,
            text:"Hello",
            subject:"Reset Forgotten Password Link",
            html:resetURL,
        }
        sendEmail(data)
        res.json(token)
    }catch(error){
        logger.error(`Error in lost password token function ${error}`)
    }
})

const resetPassword=asyncHandler(async(req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const hashedToken=crypto.createHash('sha256').update(token).digest('hex')
    try{
        const user=await User.findOne({
            passwordResetToken:hashedToken,
            passwordResetExpires:{$gt:Date.now()} // revisar si el token no ha expirado 
        })
        if (!user) logger.info('Token expired, please try with a new token')
        user.password=password
        user.passwordResetToken=undefined
        user.passwordResetExpires=undefined
        user.passwordChangedAt=Date.now()
        await user.save()
        res.json(user)  
    } catch(error){
        logger.error(`Error in reset passworld functionality: ${error}`)
    }
})

// traer wishlist del usuario

const getWishList=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const user=await User.findById(_id).select('Wishlist') // asi o populate?
        res.json(user)
    } catch(error){
        logger.error(`Could not retrieve user wishlist ${error}`)
    }
})
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

module.exports={
    createUser,
    loginUser, 
    getAllUsers, 
    getUserById, 
    deleteUserById, 
    updateUserById, 
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishList,
    addToCart,
    getUserCart,
    emptyCart,
    removeFromCart,
};