const nodemailer=require('nodemailer')
const asyncHandler=require('express-async-handler')

const sendEmail=asyncHandler(async(data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: data.from, // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
      });
})


/*
datos mail a ENV

EMAIL_NAME=Tomasa Klocko
EMAIL_USERNAME=tomasa.klocko84@ethereal.email
EMAIL_PASSWORD=YJueXQgRSHYqvYX2BF
*/

module.exports=sendEmail