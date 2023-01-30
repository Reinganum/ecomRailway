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
const Mongostore=require('connect-mongo')
const session=require('express-session')
const passport = require('passport');
const args = require('./config/argsConfig');
const runServer = require('./config/cluster');
const {engine} = require('express-handlebars')

// connection to MongoDB

db()

// body parser middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// passport
app.use(session({
    store:Mongostore.create({
        mongoUrl:process.env.MONGO_URI,
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:60,
        dbName:process.env.MONGO_DB_NAME,
        collectionName:'sessions'
    }),
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    cookie : {
        maxAge: 60000
    }
}))
app.use(passport.initialize())
/*app.use(session({
    secret:process.env.JWT_SECRET,
    resave:true,
    saveUninitialized:true,
}))*/
app.use(passport.session())


// HANDLEBARS
app.engine('.hbs', engine({
    extname:'.hbs'
}));
app.set('view engine', 'hbs');
app.set('views',process.cwd()+'/public/views')
app.use(express.static('public'))
app.use(express.static('public/views'))

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
    logger.error(`Attempted connection to route ${method} ${url} which does not exist`)
    res.redirect('/login')
  })
  
// error handling middlewares

app.use(errorHandler)
app.use(notFound)

// CORRER SERVIDOR EN UN NUCLEO O CLUSTER

runServer(app,args)


