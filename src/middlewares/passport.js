const asyncHandler = require('express-async-handler')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const signRefreshToken = require('../config/refreshJWT')

// CHECK AUTHENTICATION MIDDLEWARE

const checkAuthenticated=(req,res,next)=>{
    if (req.isAuthenticated()){
        console.log("login has been authenticated")
        return next();
    } else{
        console.log("login unauthorized")
        res.send("login to view the page")
    }
}

// COMPARE PASSWORD HASHING

const validatePassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

// PASSPORT INITIALIZATION

    const portInit=(req,res,next)=>{
        passport.serializeUser((user,done)=>{
            done(null,user.id)
        })
        passport.deserializeUser(async(id,done)=>{
            const user=await User.getById(id)
            done(null,user)
        })
        passport.use('local',
        new LocalStrategy(
            {
                usernameField:'email',
                passwordField:'password',
                passReqToCallback:true,
            },
             asyncHandler(async(req,email,password,done)=>{
                if(!email|!password)console.log("insufficient data for validation")
                try{
                    const findUser=await User.findOne({email})
                    if(!findUser)return done(null,false)
                    if(!validatePassword(findUser,password))return done(null)
                    const userData={
                        id:findUser._id,
                        email:findUser.email,
                        cart:findUser.cart
                    }
                    done(null,userData)
                } catch (error){
                    throw new Error(error)
                }
                
    })))}

    const passportInit=portInit()
           
 module.exports={
    passportInit,
    checkAuthenticated
}
