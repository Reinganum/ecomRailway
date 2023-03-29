require('dotenv').config({path:'.env'})

const config={
    token:process.env.TWILIO_TOKEN,
    pass:process.env.TWILIO_PASS,
    cel:process.env.TWILIO_CEL
}

module.exports=config