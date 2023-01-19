const express=require('express')
const app=express()
app.use('/',(req,res)=>{
    res.send('hola weonooooo!')
})
const PORT=8085
app.listen(PORT, ()=>{
    console.log(`listening to ${PORT}`)
})