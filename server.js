const express=require('express')
const app=express()
const dotenv=require('dotenv').config()
const PORT=process.env.PORT||8080;
const db=require('./config/DBconnect');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const authRouter=require('./routes/authRoute')
const productRouter=require('./routes/productRoute')
const cookieParser=require('cookie-parser')
// connection to MongoDB

db();

// body parser middleware

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)

// error handling middlewares

app.use(errorHandler)
app.use(notFound)

// listening PORT
app.listen(PORT,()=>{
    console.log(`server is listening in ${PORT}`)
})


