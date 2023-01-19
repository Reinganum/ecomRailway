const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler');
const generateToken = require('../config/jwt');
const validateMongoDBID = require('../utils/validateMongoDbID');
const signRefreshToken = require('../config/refreshJWT');

// REGISTER USER 

const createUser=asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const findUser=await User.findOne({email:email});
    if(!findUser){
        // create new user
        const newUser=await User.create(req.body);
        res.json(newUser)
    } else {
        // email is used, user already exists
        throw new Error('User already exists')
    }
});

// LOGIN USER 

const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const findUser=await User.findOne({email})
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
            maxAge:72*60*60*1000
        })
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            token:generateToken(findUser?._id)
        })
    } else {
        throw new Error ("invalid login")
    }
})

// Handle refresh token

const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies
    if(!cookie?.refreshToken)throw new Error('there is no refresh token in cookies')
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken})
    if(!user)throw new Error('no user matches refresh token in Database')
    jwt.verify(refreshToken,process.env.JWT_SECRET, (error, decoded)=>{
        if (error || decoded.id !== user.id){
            throw new Error('error in refresh token')
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
})

// All users

const getAllUsers=asyncHandler(async(req,res)=>{
    try{
        const getUsers=await User.find();
        res.json(getUsers)
    } catch (error){
        throw new Error(error)
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
        throw new Error(error)
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
        throw new Error(error)
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
        throw new Error(error)
    }
}) 

// Block and unblock users for admins

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
        throw new Error(error)
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
        throw new Error(error)
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
};