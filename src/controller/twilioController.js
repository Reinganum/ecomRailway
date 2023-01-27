const twilio=require('twilio')
const config=require('../config/twilio')
const asyncHandler=require('express-async-handler')
const clientTwilio=twilio(config.token,config.pass)

const sendMsg=asyncHandler(async(msg,)=>{
    try{
        const msgSent=await clientTwilio.messages.create(msg)
        console.log(msgSent)
    }catch(error){
        throw new Error(error)
    }
})

module.exports=sendMsg