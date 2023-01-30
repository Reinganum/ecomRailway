const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const passport=require('passport')
const upload=require('../controller/uploadController')
const { checkAuthenticated } = require('../middlewares/passport')
const fs=require('fs')
const { saveAvatar } = require('../controller/avatarController')
const { loginUser } = require('../controller/userController')

router.get('/register',(req,res)=>res.render('register'))
router.get('/login', (req,res)=>res.render('login'))
router.post('/uploadFile',checkAuthenticated, upload.single('myFile'),(req,res)=>{
     const file = req.file;
     saveAvatar(req.user.id,`../uploads/${file.filename}`)
     if (!file) {
        return res.status(400).send('Could not upload file: no file');
    }
    res.redirect('/dashboard')
})
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),loginUser,
  function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/dashboard',checkAuthenticated,(req,res)=>{
    const name=req.user.firstname
    const avatar=`../uploads/${req.user.avatar}`
    res.render("greeting",{name,avatar})
})

router.get('/logout',(req,res)=>{
  console.log(req)
  req.session.destroy();
  res.send({msg:"User logged out"})
})

module.exports=router;