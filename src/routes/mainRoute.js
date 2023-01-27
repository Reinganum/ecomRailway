const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const passport=require('passport')

router.get('/',(req,res)=>res.render('register'))
router.get('/login', (req,res)=>res.render('login'))
router.get('/dashboard',auth,(req,res)=>{
    try{
        const name=req.user.firstname
        res.render('greeting',{name:name})
    }
    catch(error){
        res.status(500).send(`could not logout, error: ${error}`)
    }
}
)

// inner files, reemplazar todo cuando avance con react

router.get('/index',(req,res)=>{
    res.sendFile(process.cwd()+'/public/views/html/index.html')
})
router.get('/styles',(req,res)=>{
    res.sendFile(process.cwd()+'/public/views/styles/styles.css')
})
router.get('/js',(req,res)=>{
    res.sendFile(process.cwd()+'/public/views/js/index.js')
})
module.exports=router;