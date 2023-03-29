const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler');
const generateToken = require('../config/config/jwt');
const signRefreshToken = require('../config/config/refreshJWT');
const sendEmail=require('../controller/emailController')
const crypto=require('crypto')
const config = require('../config/index');
const {User}=require('../repository/repository')
const logger=require('../config/config/logger')

// REGISTER USER 

const createUser=asyncHandler(async(req,res)=>{
    const {email,password,firstname,lastname,mobile,avatar,role}=req.body;
    const findUser=await User.findOne({email:email});
    if(!findUser){
        const salt=bcrypt.genSaltSync(10);
        const hashedPass=await bcrypt.hash(password, salt)
        const newUser=await User.save({
            email,password:hashedPass,firstname,lastname,mobile,avatar,role,wishlist:[],ratings:[]
        })
        const data={
            to:email,
            text:`Hello ${firstname} ${lastname}, we welcome you to our community!`,
            subject:"Welcome to the eCommerce",
        }
        sendEmail(data)
        res.json(newUser)
        
    } else {
        logger.info('Error creating user')
        res.json({error:'could not create new user'})
    }
});

// LOGIN USER 

const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const salt=bcrypt.genSaltSync(10);
    const hashedPass=await bcrypt.hash(password, salt)
    const findUser=await User.findOne({email:email});
    req.user=await findUser
    if (findUser&&await bcrypt.compare(password, findUser.password)){
            try{
                if(config.AUTH_METHOD.AUTH==='JWT'){
                const refreshToken=signRefreshToken(findUser._id)
                const updateRefresh=await User.updateById(
                    findUser._id, 
                {
                    refreshToken: refreshToken
                },
                {new:true})
                res.cookie('refreshToken',refreshToken, {
                    httpOnly:true,
                    maxAge: Number(process.env.COOKIE_MAX_AGE)
                })
                res.json({
                    _id:findUser?._id,
                    firstname:findUser?.firstname,
                    lastname:findUser?.lastname,
                    email:findUser?.email,
                    avatar:findUser?.avatar,
                    mobile:findUser?.mobile,
                    role:findUser?.role,
                    accessToken:generateToken(findUser?._id)
                })
                logger.info("login successful (JWT system)")}
                else {
                    req.session.userId={
                        userId:findUser._id,
                    }
                    req.session.save()
                    res.json({
                        _id:findUser?._id,
                        firstname:findUser?.firstname,
                        lastname:findUser?.lastname,
                        email:findUser?.email,
                        avatar:findUser?.avatar,
                        mobile:findUser?.mobile,
                        role:findUser?.role,
                        accessToken:generateToken(findUser?._id),
                    })
                    logger.info("login successful (Session system)")
                }
            }catch(error){
                logger.info(`Login error: ${error}`)
            }
    } else {
        logger.info("invalid login")
        res.sendStatus(401)
    }
})

// Handle refresh token

const handleRefreshToken=asyncHandler(async(req,res)=>{
    console.log("handleRefresh called")
    const cookie=req.cookies
    if(!cookie?.refreshToken)return res.sendStatus(401)
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken})
    if(!user)res.sendStatus(403)
    jwt.verify(refreshToken,config.JWT.refreshSecret, (error, decoded)=>{
        if (error || decoded.id !== user._id){
            logger.warn('error in refresh token')
            return res.sendStatus(403)
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
        const user=await User.findOne({refreshToken:refreshToken})
    if(!user){
        res.clearCookie('refreshToken',{httpOnly:true,secure:true})
        console.log("user not found")
        return res.sendStatus(403); 
    }
    const updatedUser=await User.updateById(user._id, {
        refreshToken:""
    })
    res.clearCookie('refreshToken',{httpOnly:true,secure:true})
    res.status(201).json({message: "Successfully Logged Out", status: 201})
    } catch (error){
        logger.error(`error with refresh token: ${error}`)
    }
})

// All users

const getAllUsers=asyncHandler(async(req,res)=>{
    try{
        const getUsers=await User.getAll();
        res.json(getUsers)
    } catch (error){
        logger.error(`Could not get users ${error}`)
    }
})

const getAuthedUser=asyncHandler(async(req,res)=>{
    try{
        console.log("get authed user called")
        const {_id,firstname,lastname,avatar,mobile,email,role}=req.user
        res.json({_id,firstname,lastname,avatar,mobile,email,role})
    } catch (error){
        logger.error(`Could not get users ${error}`)
    }
})


// One User

const getUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {_id}=req.user;
    try{
        const getUser=await User.getById(id)
        res.json(getUser)
    }catch (error){
        logger.error(`Could not get user ${error}`)
    }
})

// Delete User by id

const deleteUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteUser=await User.deleteById(id)
        res.json(deleteUser)
    }catch (error){
        logger.error(`Could not delete user ${error}`)
    }
})

// Update user by id 

const updateUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const updatedUser=await User.updateById(id,
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
    console.log(id)
    try{
        const block=await User.updateById(id,
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
    try{
        const unblock=await User.updateById(id,
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

// UPDATE PASSWORD

const updatePassword=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const {password}=req.body
    try{
        const user=await User.getById(_id)
        if(password){
            user.password=password
            const updatedPassword=await User.save(user)
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
        const token=await createPasswordResetToken();
        await User.updateById(user._id, 
            {
                passwordResetToken:token.passwordResetToken,
                passwordResetExpires:token.passwordResetExpires
            }
        )
        const resetURL=`If you forgot your password and requested a reset, follow this link (valid for 15 minutes) <p>${token}</p>`
        const data={
            to:email,
            text:"Hello",
            subject:"Reset Forgotten Password Link",
            html:resetURL,
        }
        sendEmail(data)
        res.json(token.resetToken)
    }catch(error){
        logger.error(`Error in lost password token function ${error}`)
    }
})

async function createPasswordResetToken () {
    const resetToken=crypto.randomBytes(32).toString("hex")
    const passwordResetToken=crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    const passwordResetExpires=Date.now()+30*60*15000;
    return {resetToken,passwordResetToken,passwordResetExpires};
}

// CAMBIAR PASSWORD CON TOKEN ENVIADO AL MAIL

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
        if (user.passwordResetExpires<Date.now())res.json({msg:"token already expired"})
        const salt=bcrypt.genSaltSync(10);
        const hashedPass=await bcrypt.hash(password, salt)
        await User.updateById(user._id,
            {
            password:hashedPass,
            passwordResetToken:undefined,
            passwordResetExpires:undefined,
            passwordChangedAt:Date.now()
            }
        )
        res.json(user) 
        
    } catch(error){
        logger.error(`Error in reset passworld functionality: ${error}`)
    }
})

// traer wishlist del usuario

const getWishList=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const user=await User.getById(_id)
        res.json(user.wishlist)
    } catch(error){
        logger.error(`Could not retrieve user wishlist ${error}`)
    }
})

// logout user 

const logoutUser=(req,res)=>{
    req.session.destroy();
    res.clearCookie('refreshToken',{httpOnly:true,secure:true});
    res.clearCookie('connect.sid',{httpOnly:true,secure:true});
    res.redirect('/')}


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
    logoutUser,
    getAuthedUser,
};