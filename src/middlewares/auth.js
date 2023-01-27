const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const util = require('util')

const auth=asyncHandler(async(req,res,next)=>{
    let token;
    if(!req?.headers?.authorization?.startsWith("Bearer")&&!req.cookies.refreshToken)res.redirect('/login')
    if (req?.headers?.authorization?.startsWith("Bearer")){
        token=(req.headers.authorization.split(' ')[1])
        try{
            if (token){
                const decoded=jwt.verify(token, process.env.JWT_SECRET)
                const user=await User.findById(decoded?.id)
                req.user=user
                next()
            }
        }catch(error){
            res.redirect('/login')
            throw new Error('non authed user, token expired, login')
        }
    } else if (req.cookies.refreshToken!==null){
        token=req.cookies.refreshToken
        try{
            if (token){
                const decoded=jwt.verify(token, process.env.JWT_SECRET)
                const user=await User.findById(decoded?.id)
                req.user=user
                next()
            }
        }catch(error){
            throw new Error('non authed user, token expired, login')
        }
    } else {
        res.redirect('/login')
    }
})

const isAdmin=asyncHandler(async(req,res,next)=>{
    if (req.user.role!=="admin"){
        throw Error('Logged user does not have admin credentials')
    } else {
        next()
    }
})

module.exports={ auth, isAdmin }