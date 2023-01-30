const twilio=require('twilio')
const config=require('../config/twilio')
const asyncHandler=require('express-async-handler')
const logger = require('../config/logger')
const clientTwilio=twilio(config.token,config.pass)

const sendMsg=asyncHandler(async(msg,)=>{
    try{
        const msgSent=await clientTwilio.messages.create(msg)
        logger.info(msgSent)
    }catch(error){
        logger.error(`Error sending Twilio messag ${error}`)
    }
})

module.exports=sendMsg