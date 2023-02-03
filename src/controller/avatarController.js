const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const logger = require('../config/logger')

const saveAvatar=asyncHandler(async(userId,avatar)=>{
    try{
        await User.findByIdAndUpdate(userId,{avatar},{new:true})
    }catch(error){
        logger.error(error)
}})

const renderAvatar=(req,res)=>{
    const name=req.user.firstname
    const avatar=`../uploads/${req.user.avatar}`
    res.render("greeting",{name,avatar})
}

const updateAvatar=(req,res)=>{
     const file = req.file;
     saveAvatar(req.user.id,`../uploads/${file.filename}`)
     if (!file) {
        logger.info('Could not upload file: no file')
        return res.status(400).send('Could not upload file: no file');
    }
    res.redirect('/dashboard')
}
module.exports={
    saveAvatar,
    renderAvatar,
    updateAvatar,
}