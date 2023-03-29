const nodemailer=require('nodemailer')
const asyncHandler=require('express-async-handler')
const config=require('../config/index')

const sendEmail=asyncHandler(async(data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: config.NOTIFICATIONS.email.username,
            pass: config.NOTIFICATIONS.email.password
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

module.exports=sendEmail