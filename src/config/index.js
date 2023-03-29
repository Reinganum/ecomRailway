const args=require('./config/argsConfig')
const connect=require('./config/DBconnect')
const cors=require('cors')
const logger=require('./config/logger')
const sessionOptions=require('./config/sessionStorage')

module.exports={
    ARGS:args,
    PORT: process.env.PORT,
    CORS:cors({origin:`http://localhost:${process.env.PORT}`}),
    DB:{
        DB_TYPE:process.env.SELECTED_DATABASE,
        DB_URI:process.env.MONGO_URI,
        DB_CLUSTER:process.env.MONGO_DB_NAME,
        collections:{
            message:process.env.MESSAGES_STORAGE_NAME,
            product:process.env.PRODUCTS_STORAGE_NAME,
            user:process.env.CHATUSER_STORAGE_NAME,
            cart:process.env.CART_STORAGE_NAME,
            order:process.env.ORDER_STORAGE_NAME,
            category:process.env.CATEGORY_STORAGE_NAME
        },
        CONNECT:connect,
    },
    AUTH_METHOD:{
        AUTH:process.env.AUTH_METHOD
    },
    JWT:{
        secret:process.env.JWT_SECRET,
        refreshSecret:process.env.JWT_REFRESH_SECRET
    },
    SESSIONSTORAGE:{
        STORAGE:sessionOptions
    },
    NOTIFICATIONS:{
        email:{
            name:process.env.EMAIL_NAME,
            username:process.env.EMAIL_USERNAME,
            password:process.env.EMAIL_PASSWORD
        },
        whatsapp:{
            whatsapp:process.env.TWILIO_CEL,
            token:process.env.TWILIO_TOKEN,
            password:process.env.TWILIO_PASS,
            failsafe:process.env.FAILSAFE_TWILIO
        }
    },
    logger:logger
}

