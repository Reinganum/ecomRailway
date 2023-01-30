require('dotenv').config({path:'.env'})

const config={
    token:process.env.TWILIO_TOKEN,
    pass:process.env.TWILIO_PASS,
    cel:process.env.TWILIO_CEL
}

// token:"AC0361909f8a0efddd48cb3359f170af48",
// pass:"66a6cd1f31e2b55b96bcc2a50f885167",
// cel:"whatsapp:+12066721850"


module.exports=config