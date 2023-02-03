const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const passport=require('passport')
const upload=require('../controller/uploadController')
const { checkAuthenticated} = require('../middlewares/passport')
const {renderAvatar, updateAvatar } = require('../controller/avatarController')
const { loginUser, logout } = require('../controller/userController')

router.get('/register',(req,res)=>res.render('register'))
router.get('/login', (req,res)=>res.render('login'))
router.post('/uploadFile',checkAuthenticated,upload,updateAvatar)
router.post('/login',passport.authenticate('local', { failureRedirect: '/login' }),loginUser)
router.get('/dashboard',checkAuthenticated,renderAvatar)
router.get('/logout', logout)

module.exports=router;