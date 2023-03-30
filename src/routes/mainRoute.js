const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const upload=require('../controller/uploadController')
const { updateAvatar } = require('../controller/avatarController')
const dotenv=require('dotenv').config()
const CONFIG=(dotenv.parsed)

router.post('/uploadFile',auth,upload,updateAvatar)
router.get('/config',(req,res)=>{
    res.render('config',{CONFIG})
})

module.exports=router;