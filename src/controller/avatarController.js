const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const logger = require('../config/logger')

const saveAvatar=asyncHandler(async(userId,avatar)=>{
    try{
        await User.findByIdAndUpdate(userId,{avatar},{new:true})
    }catch(error){
        logger.error(error)
}})

module.exports={
    saveAvatar,
}