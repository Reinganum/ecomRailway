const {User}=require('../repository/repository')
const asyncHandler=require('express-async-handler')

const saveAvatar=asyncHandler(async(userId,avatar)=>{
    try{
        await User.updateById(userId,{avatar},{new:true})
    }catch(error){
        logger.error(error)
}})

const renderAvatar=(req,res)=>{
    const avatar=`../uploads/${req.user.avatar}`
    res.send({avatar:avatar})
}

const updateAvatar=(req,res)=>{
    console.log("we made it to the updateAvatar")
     if(!req.user){
        console.log("no user in the req")
     }
     const {file}=req
     saveAvatar(req.user._id,`/uploads/${file.filename}`)
     res.send({avatar:`/uploads/${file.filename}`})
}
module.exports={
    saveAvatar,
    renderAvatar,
    updateAvatar,
}