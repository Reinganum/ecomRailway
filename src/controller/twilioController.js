const twilio=require('twilio')
const config=require('../config/index')
const asyncHandler=require('express-async-handler')
const logger = config.logger
const clientTwilio=twilio(config.NOTIFICATIONS.whatsapp.token,config.NOTIFICATIONS.whatsapp.password)

const sendMsg=asyncHandler(async(msg,)=>{
    try{
        const msgSent=await clientTwilio.messages.create(msg)
        logger.info(msgSent)
    }catch(error){
        logger.error(`Error sending Twilio messag ${error}`)
    }
})

module.exports=sendMsg