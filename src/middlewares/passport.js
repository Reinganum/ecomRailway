const asyncHandler = require('express-async-handler')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const {User}=require('../repository/repository')
const bcrypt=require('bcrypt')
const logger = require('../config/config/logger')


// CHECK AUTHENTICATION MIDDLEWARE

const checkAuthenticated=(req,res,next)=>{
    if (req.isAuthenticated()){
        logger.info("login has been authenticated")
        return next();
    } else{
        logger.info("login unauthorized")
        res.send("login to view the page")
    }
}

// COMPARE PASSWORD HASHING

const validatePassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

// PASSPORT INITIALIZATION

    const passportInit=(req,res,next)=>{
        console.log("function called")
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
                session:true,
            },
             asyncHandler(async(req,email,password,done)=>{
                console.log("function called 2")
                if(!email|!password)console.log("insufficient data for validation")
                try{
                    const findUser=await User.findOne({email})
                    if(!findUser)return done(null,false)
                    if(!validatePassword(findUser,password))return done(null)
                    const userData={
                        id:findUser._id,
                        firstname:findUser.firstname,
                        email:findUser.email,
                        cart:findUser.cart,
                        avatar:findUser.avatar
                    }
                    done(null,userData)
                } catch (error){
                    throw new Error(error)
                }
    })))}
    
    passportInit()
 module.exports={
    checkAuthenticated
}
