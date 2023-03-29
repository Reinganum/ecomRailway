const express=require('express')
const app=express()
const dotenv=require('dotenv').config()
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const authRouter=require('./routes/userRoute')
const productRouter=require('./routes/productRoute')
const cartRouter=require('./routes/cartRoute')
const mainRouter=require('./routes/mainRoute')
const cookieParser=require('cookie-parser')
const categoryRouter=require('./routes/categoryRoute')
const session=require('express-session')
const args = require('./config/config/argsConfig')
const runServer = require('./config/config/cluster');
const {engine} = require('express-handlebars');
const {newUser,newMessage,userDisconnected}=require('./controller/chatController')
const config=require('./config')
const logger=require('./config/config/logger')
const orderRouter=require('./routes/orderRoute')
const cors=require('cors')

// Swagger

const swaggerUI=require('swagger-ui-express')
const swaggerJsdoc=require('swagger-jsdoc')
const options={
    definition:{
        openapi:'3.0.0',
        security: [ { bearerAuth: [] } ],
        info:{
            title:'API testing for eCommerce Project',
            description:'a simple CRUD API application made with Swagger',
        },
    },
    apis:['./src/docs/**/*.yaml']
}
const specs=swaggerJsdoc(options)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(specs))
//    
const corsOptions = {
    origin: ["http://localhost:3000","http://localhost:5000"],
    credentials: true,
  }
app.use(cors(corsOptions))

// body parser middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session(config.SESSIONSTORAGE.STORAGE))

// HANDLEBARS

app.engine('.hbs', engine({
    extname:'.hbs'
}));
app.set('view engine', 'hbs');
app.set('views',process.cwd()+'/public/views')
app.use(express.static('public'))
app.use(express.static('public/views'))


// routers

app.use('/user', authRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/category', categoryRouter)
app.use('/order', orderRouter)
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

const httpServer=runServer(app,args)
const { Server } = require("socket.io");
const io = new Server(httpServer, {
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on('connection', async (socket)=>{
    newUser(socket,io)
    
    socket.on('msg',(newMsg)=>{
        newMessage(socket,io,newMsg)
    })

    socket.on('typing',(user)=>{
        socket.broadcast.emit('typing',user)
    })
    socket.on('newItem',(itemData)=>{
        newItem(socket,io,itemData)
    })
    socket.on("disconnect",async ()=>{
        console.log(`User disconnected: ${socket.id}`,
        userDisconnected(socket.id)
        )
    })
})

config.DB.CONNECT()

module.exports=app