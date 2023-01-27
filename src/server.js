const express=require('express')
const app=express()
const dotenv=require('dotenv').config()
const db=require('./config/DBconnect');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const authRouter=require('./routes/userRoute')
const productRouter=require('./routes/productRoute')
const cartRouter=require('./routes/cartRoute')
const mainRouter=require('./routes/mainRoute')
const cookieParser=require('cookie-parser')
const logger = require('./config/logger')
const categoryRouter=require('./routes/categoryRoute')
const passport = require('passport');
const User=require('./models/userModel');
const passportInit = require('./middlewares/passport');
const session=require('express-session');
const args = require('./config/argsConfig');
const runServer = require('./config/cluster');
const {engine} = require('express-handlebars')

// connection to MongoDB

db()

// body parser middleware

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// passport
app.use(passport.initialize())
app.use(session({
    secret:process.env.JWT_SECRET,
    resave:true,
    saveUninitialized:true,
}))
passportInit

// HANDLEBARS
app.engine('.hbs', engine({
    extname:'.hbs'
}));
app.set('view engine', 'hbs');
app.set('views',process.cwd()+'/public/views')
app.use(express.static('public/views'))
app.use(express.static('public'))

// SESSION 

// routers

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/category', categoryRouter)
app.use('/', mainRouter)
// main routes 
app.get('*', (req, res) => {
    const { url, method } = req
    logger.warn(`The Route ${method} ${url} has not been created`)
    res.send(`The following route ${method} ${url} does not exist`)
  })
  
// error handling middlewares

app.use(errorHandler)
app.use(notFound)

// CORRER SERVIDOR EN UN NUCLEO O CLUSTER

runServer(app,args)


