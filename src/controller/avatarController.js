const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')

const saveAvatar=asyncHandler(async(userId,avatar)=>{
    try{
        await User.findByIdAndUpdate(userId,{avatar},{new:true})
    }catch(error){
        throw new Error(error)
}})

module.exports={
    saveAvatar,
}