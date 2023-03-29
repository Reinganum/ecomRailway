const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const upload=require('../controller/uploadController')
const { updateAvatar } = require('../controller/avatarController')

router.post('/uploadFile',auth,upload,updateAvatar)

module.exports=router;